export type CommentRow = {
  id: string
  ticket_id: number
  user_id: string
  content: string
  created_at: string
}

export type CommentAuthorRow = {
  user_id: string
  full_name: string | null
  avatar_url: string | null
}

export type TicketComment = {
  id: string
  ticketId: number
  userId: string
  content: string
  createdAt: string
  authorName: string | null
  authorAvatarUrl: string | null
}

export type CreateCommentInput = {
  ticketId: number
  content: string
}
