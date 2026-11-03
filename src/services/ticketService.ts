import { supabase } from '@/lib/supabase'
import type { CreateTicketInput, Ticket } from '@/types/ticket'

export const ticketService = {
  //For fetching tickets
  async getAll(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, subject, description, category, priority, type, status, assignee, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tickets: ${error.message}`)
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
  },

  //For posting tickets or Creating a new ticket
  async create(ticket: CreateTicketInput): Promise<Ticket> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw new Error(`Authentication failed: ${userError.message}`)
    }
    if (!user) {
      throw new Error('You must be logged in to create a ticket.')
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        type: ticket.type,
        status: 'open',
        assignee: null,
        user_id: user.id,
      })
      .select('id, subject, description, category, priority, type, status, assignee, created_at')
      .single()

    if (error) {
      throw new Error(`Failed to create tickets ${error.message}`)
    }

    return {
      id: Number(data.id),
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
      type: data.type,
      status: data.status,
      assignee: data.assignee,
      createdAt: data.created_at,
    }
  },
}
