import { ref } from 'vue'
import { ticketCommentService } from '@/services/ticketCommentService'
import type { TicketComment } from '@/types/comment'
import { sanitizeRichText } from '@/lib/utils'
import { hasMeaningfulText } from '@/utils/textChecker'

export const useTicketComments = () => {
  const comments = ref<TicketComment[]>([])
  const isFetching = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref<string | null>(null)

  // Fetch comments for a ticket
  const fetchComments = async (ticketId: number) => {
    isFetching.value = true
    errorMessage.value = null

    try {
      comments.value = await ticketCommentService.getAll(ticketId)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Failed to fetch comments.'
    } finally {
      isFetching.value = false
    }
  }

  // Submit a new comment
  const addComment = async (ticketId: number, content: string) => {
    if (isSubmitting.value) return null

    const sanitizedContent = sanitizeRichText(content).trim()

    if (!hasMeaningfulText(sanitizedContent)) {
      errorMessage.value = 'Comment cannot be empty.'
      return null
    }

    isSubmitting.value = true
    errorMessage.value = null

    try {
      const newComment = await ticketCommentService.create({
        ticketId,
        content: sanitizedContent,
      })

      comments.value.push(newComment)

      return newComment
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Failed to add comment.'

      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    comments,
    isFetching,
    isSubmitting,
    errorMessage,
    fetchComments,
    addComment,
  }
}
