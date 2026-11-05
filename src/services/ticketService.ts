import { supabase } from '@/lib/supabase'
import type { CreateTicketInput, Ticket, TicketRow } from '@/types/ticket'

// Convert a database ticket into our frontend Ticket type
const mapTicket = (ticket: TicketRow): Ticket => ({
  id: Number(ticket.id),
  subject: ticket.subject,
  description: ticket.description,
  category: ticket.category,
  priority: ticket.priority,
  type: ticket.type,
  status: ticket.status,
  assignee: ticket.assignee,
  assigneeId: ticket.assignee_id,
  createdAt: ticket.created_at,
})

const ticketColumns =
  'id, subject, description, category, priority, type, status, assignee, assignee_id, created_at'

export const ticketService = {
  // Fetch tickets visible to the current user
  async getAll(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select(ticketColumns)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tickets: ${error.message}`)
    }

    return data.map(mapTicket)
  },

  // Create a new ticket
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
        assignee_id: null,
        user_id: user.id,
      })
      .select(ticketColumns)
      .single()

    if (error) {
      throw new Error(`Failed to create ticket: ${error.message}`)
    }

    return mapTicket(data)
  },

  // Update ticket status through the secure database function
  async updateStatus(id: number, status: Ticket['status']): Promise<Ticket> {
    const { data, error } = await supabase.rpc('update_ticket_status', {
      p_ticket_id: id,
      p_new_status: status,
    })

    if (error) {
      throw new Error(`Failed to update ticket status: ${error.message}`)
    }

    if (!data) {
      throw new Error('Ticket not found or could not be updated.')
    }

    return mapTicket(data)
  },

  // Assign or reassign a ticket (Manager only)
  async assignTicket(id: number, assigneeId: string): Promise<Ticket> {
    const { data, error } = await supabase.rpc('assign_ticket', {
      p_ticket_id: id,
      p_assignee_id: assigneeId,
    })

    if (error) {
      throw new Error(`Failed to assign ticket: ${error.message}`)
    }

    if (!data) {
      throw new Error('Ticket not found or could not be assigned.')
    }

    return mapTicket(data)
  },
}
