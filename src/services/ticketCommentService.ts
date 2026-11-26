import { supabase } from '@/lib/supabase'
import type {
  CommentAuthorRow,
  CommentRow,
  TicketComment,
  CreateCommentInput,
} from '@/types/comment'
import { sanitizeRichText } from '@/lib/utils'
import { hasMeaningfulText } from '@/utils/textChecker'

const mapComment = (comment: CommentRow, author?: CommentAuthorRow): TicketComment => ({
  id: comment.id,
  ticketId: comment.ticket_id,
  userId: comment.user_id,
  content: comment.content,
  createdAt: comment.created_at,
  authorName: author?.full_name ?? null,
  authorAvatarUrl: author?.avatar_url ?? null,
})

const commentColumns = 'id, ticket_id, user_id, content, created_at'

export const ticketCommentService = {
  // Fetch comments for a ticket in chronological order
  async getAll(ticketId: number): Promise<TicketComment[]> {
    const [commentsResult, authorsResult] = await Promise.all([
      supabase
        .from('ticket_comments')
        .select(commentColumns)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true }),
      supabase.rpc('get_ticket_comment_authors', {
        p_ticket_id: ticketId,
      }),
    ])

    if (commentsResult.error) {
      throw new Error(`Failed to fetch comments: ${commentsResult.error.message}`)
    }

    if (authorsResult.error) {
      throw new Error(`Failed to fetch comment authors: ${authorsResult.error.message}`)
    }

    const authorRows: CommentAuthorRow[] = authorsResult.data ?? []
    const authorsById = new Map(authorRows.map((author) => [author.user_id, author] as const))

    return commentsResult.data.map((comment) =>
      mapComment(comment, authorsById.get(comment.user_id)),
    )
  },

  // Add a comment to a ticket
  async create(comment: CreateCommentInput): Promise<TicketComment> {
    const content = sanitizeRichText(comment.content).trim()

    if (!hasMeaningfulText(content)) {
      throw new Error('Comment cannot be empty.')
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw new Error(`Authentication failed: ${userError.message}`)
    }

    if (!user) {
      throw new Error('You must be logged in to comment.')
    }

    const { data, error } = await supabase
      .from('ticket_comments')
      .insert({
        ticket_id: comment.ticketId,
        user_id: user.id,
        content,
      })
      .select(commentColumns)
      .single()

    if (error) {
      throw new Error(`Failed to add comment: ${error.message}`)
    }

    return mapComment(data)
  },
}
