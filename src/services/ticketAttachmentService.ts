import { supabase } from '@/lib/supabase'

const BUCKET_NAME = 'ticket-attachments'

export type TicketAttachment = {
  id: string
  ticket_id: number
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  created_at: string
  signedUrl: string
}

export const ticketAttachmentService = {
  async upload(ticketId: number, files: File[]): Promise<void> {
    if (files.length === 0) return

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('You must be logged in to upload attachments.')
    }

    const uploadedPaths: string[] = []

    try {
      const attachments = []

      for (const file of files) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${crypto.randomUUID()}.${fileExtension}`
        const filePath = `${ticketId}/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
        }

        uploadedPaths.push(filePath)

        attachments.push({
          ticket_id: ticketId,
          uploaded_by: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        })
      }

      const { error: metadataError } = await supabase.from('ticket_attachments').insert(attachments)

      if (metadataError) {
        throw new Error(`Failed to save attachment information: ${metadataError.message}`)
      }
    } catch (error) {
      // Remove uploaded files if any part of the upload process fails.
      if (uploadedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(uploadedPaths)

        if (cleanupError) {
          console.error('Attachment cleanup failed:', cleanupError.message)
        }
      }

      throw error
    }
  },

  async getForTicket(ticketId: number) {
    const { data, error } = await supabase
      .from('ticket_attachments')
      .select('id, ticket_id, file_name, file_path, file_size, mime_type, created_at')
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
}
