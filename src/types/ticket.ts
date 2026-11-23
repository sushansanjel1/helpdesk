export interface TicketRow {
  id: number
  subject: string
  description: string
  category: string
  priority: string
  type: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignee: string | null
  assignee_id: string | null
  created_at: string
  user_id: string
}

/**
 * Represents a ticket used throughout the Vue application.
 * Uses camelCase naming.
 */
export interface Ticket {
  id: number
  subject: string
  description: string
  category: string
  priority: string
  type: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignee: string | null
  assigneeId: string | null
  createdAt: string
  userId: string
}

export type TicketStatusAction = {
  label: string
  status: Ticket['status']
}

export type CreateTicketInput = Omit<
  Ticket,
  'id' | 'createdAt' | 'status' | 'assignee' | 'assigneeId' | 'userId'
>
