// export interface Ticket {
//   id: number
//   subject: string
//   description: string
//   // category: 'technical' | 'account' | 'billing' | 'product' | 'sales' | 'other'
//   // priority: 'low' | 'medium' | 'high' | 'urgent'
//   // type: 'question' | 'incident' | 'problem' | 'request'
//   category: string
//   priority: string
//   type: string
//   status: 'open' | 'in-progress' | 'resolved' | 'closed'
//   assignee: string | null
//   assigneeId: string | null
//   createdAt: string
// }

// export type CreateTicketInput = Omit<
//   Ticket,
//   'id' | 'createdAt' | 'status' | 'assignee' | 'assigneeId'
// >

/**
 * Represents a ticket returned from the Supabase database.
 * Uses database column names (snake_case).
 */
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

export type CreateTicketInput = Omit<
  Ticket,
  'id' | 'createdAt' | 'status' | 'assignee' | 'assigneeId' | 'userId'
>
