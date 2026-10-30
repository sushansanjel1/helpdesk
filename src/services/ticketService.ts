import { supabase } from '@/lib/supabase'
import type { Ticket } from '@/types/ticket'

export const getTickets = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('id, subject, description, category, priority, type, status, assignee, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to fetch tickets: ' + error.message)
  }

  //Why map the data?
  // To keep the database snake_case and TypeScript camelCase consistent.
  return data.map((ticket) => ({
    id: Number(ticket.id),
    subject: ticket.subject,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    type: ticket.type,
    status: ticket.status,
    assignee: ticket.assignee,
    createdAt: ticket.created_at,
  }))
}
