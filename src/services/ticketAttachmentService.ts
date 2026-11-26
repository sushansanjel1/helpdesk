import { supabase } from '@/lib/supabase'
import { MAX_TICKET_IMAGE_ATTACHMENTS } from '@/constants/ticket'

const BUCKET_NAME = 'ticket-attachments'
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function validateFiles(files: File[]) {
  if (files.length > MAX_TICKET_IMAGE_ATTACHMENTS) {
    throw new Error(`A ticket can have up to ${MAX_TICKET_IMAGE_ATTACHMENTS} images.`)
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      throw new Error(`${file.name} has an unsupported image format.`)
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`${file.name} exceeds 5MB.`)
    }
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unknown attachment upload error occurred.'
}

class AttachmentUploadError extends Error {
  constructor(
    readonly originalError: unknown,
    message: string,
  ) {
    super(message)
    this.name = 'AttachmentUploadError'
  }
}

export type TicketAttachment = {
  id: string
  ticket_id: number
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  uploaded_by: string
  created_at: string
  signedUrl: string
}

export const ticketAttachmentService = {
  async upload(ticketId: number, files: File[]): Promise<void> {
    if (files.length === 0) return

    validateFiles(files)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('You must be logged in to upload attachments.')
    }

    const uploadItems = files.map((file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${crypto.randomUUID()}.${fileExtension}`
      const filePath = `${ticketId}/${user.id}/${fileName}`

      return {
        file,
        filePath,
        metadata: {
          ticket_id: ticketId,
          uploaded_by: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        },
      }
    })
    const filePaths = uploadItems.map(({ filePath }) => filePath)
    const attemptedPaths: string[] = []
    let reservationAttempted = false
    let metadataInsertAttempted = false

    try {
      reservationAttempted = true
      const { error: reservationError } = await supabase.rpc('reserve_ticket_attachment_slots', {
        p_ticket_id: ticketId,
        p_file_paths: filePaths,
      })

      if (reservationError) {
        throw new Error(`Failed to reserve attachment slots: ${reservationError.message}`)
      }

      for (const { file, filePath } of uploadItems) {
        attemptedPaths.push(filePath)
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
        }
      }

      metadataInsertAttempted = true
      const { error: metadataError } = await supabase
        .from('ticket_attachments')
        .insert(uploadItems.map(({ metadata }) => metadata))

      if (metadataError) {
        throw new Error(`Failed to save attachment information: ${metadataError.message}`)
      }
    } catch (error) {
      const cleanupErrors: string[] = []
      const committedPaths = new Set<string>()
      let metadataStateVerified = !metadataInsertAttempted

      if (metadataInsertAttempted) {
        try {
          const { data, error: metadataLookupError } = await supabase
            .from('ticket_attachments')
            .select('file_path')
            .eq('ticket_id', ticketId)
            .in('file_path', filePaths)

          if (metadataLookupError) {
            cleanupErrors.push(
              `Could not verify saved attachment records: ${metadataLookupError.message}. Uploaded files and reservations were left for automatic cleanup.`,
            )
          } else {
            metadataStateVerified = true
            for (const attachment of data) {
              committedPaths.add(attachment.file_path)
            }
          }
        } catch (metadataLookupError: unknown) {
          cleanupErrors.push(
            `Could not verify saved attachment records: ${getErrorMessage(metadataLookupError)}. Uploaded files and reservations were left for automatic cleanup.`,
          )
        }
      }

      if (metadataStateVerified && committedPaths.size === filePaths.length) {
        return
      }

      const pathsToRemove = attemptedPaths.filter((path) => !committedPaths.has(path))
      const pathsSafeToRelease = filePaths.filter((path) => !attemptedPaths.includes(path))

      if (metadataStateVerified && pathsToRemove.length > 0) {
        try {
          const { error: cleanupError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(pathsToRemove)

          if (cleanupError) {
            cleanupErrors.push(
              `Storage cleanup failed; reservations were left pending for automatic cleanup: ${cleanupError.message}`,
            )
          } else {
            pathsSafeToRelease.push(...pathsToRemove)
          }
        } catch (cleanupError: unknown) {
          cleanupErrors.push(
            `Storage cleanup failed; reservations were left pending for automatic cleanup: ${getErrorMessage(cleanupError)}`,
          )
        }
      }

      if (reservationAttempted && pathsSafeToRelease.length > 0) {
        try {
          const { error: releaseError } = await supabase.rpc(
            'release_ticket_attachment_reservations',
            {
              p_ticket_id: ticketId,
              p_file_paths: [...new Set(pathsSafeToRelease)],
            },
          )

          if (releaseError) {
            cleanupErrors.push(`Could not release attachment reservations: ${releaseError.message}`)
          }
        } catch (releaseError: unknown) {
          cleanupErrors.push(
            `Could not release attachment reservations: ${getErrorMessage(releaseError)}`,
          )
        }
      }

      const partialCommitMessage =
        committedPaths.size > 0
          ? ` ${committedPaths.size} of ${filePaths.length} attachments were saved.`
          : ''
      const originalMessage = `${getErrorMessage(error)}${partialCommitMessage}`

      if (cleanupErrors.length > 0) {
        throw new AttachmentUploadError(
          error,
          `${originalMessage} Cleanup details: ${cleanupErrors.join(' ')}`,
        )
      }

      if (partialCommitMessage) {
        throw new AttachmentUploadError(error, originalMessage)
      }

      throw error
    }
  },

  async getForTicket(ticketId: number) {
    const { data, error } = await supabase
      .from('ticket_attachments')
      .select('id, ticket_id, file_name, file_path, file_size, mime_type, uploaded_by, created_at')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch ticket attachments: ${error.message}`)
    }

    const attachments = await Promise.all(
      data.map(async (attachment) => {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(attachment.file_path, 3600)

        if (signedUrlError) {
          throw new Error(
            `Failed to generate image URL for ${attachment.file_name}: ${signedUrlError.message}`,
          )
        }

        return {
          ...attachment,
          signedUrl: signedUrlData.signedUrl,
        }
      }),
    )

    return attachments
  },

  async remove(attachment: TicketAttachment): Promise<void> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('You must be logged in to remove attachments.')
    }

    if (attachment.uploaded_by !== user.id) {
      throw new Error('You can only remove images you uploaded.')
    }

    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([attachment.file_path])

    if (storageError) {
      throw new Error(`Failed to remove ${attachment.file_name}: ${storageError.message}`)
    }

    const { data, error: metadataError } = await supabase
      .from('ticket_attachments')
      .delete()
      .eq('id', attachment.id)
      .eq('ticket_id', attachment.ticket_id)
      .eq('uploaded_by', user.id)
      .select('id')

    if (metadataError) {
      throw new Error(
        `Image file was removed, but its attachment record could not be deleted: ${metadataError.message}`,
      )
    }

    if (data.length === 0) {
      throw new Error('Image file was removed, but its attachment record could not be found.')
    }
  },
}
