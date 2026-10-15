export interface Ticket {
  id: number
  subject: string
  description: string
  // category: 'technical' | 'account' | 'billing' | 'product' | 'sales' | 'other'
  // priority: 'low' | 'medium' | 'high' | 'urgent'
  // type: 'question' | 'incident' | 'problem' | 'request'
  category: string
  priority: string
  type: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignee: string | null
  createdAt: string
}
