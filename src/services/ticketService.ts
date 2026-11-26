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
  userId: ticket.user_id,
})

const ticketColumns =
  'id, subject, description, category, priority, type, status, assignee, assignee_id, created_at, user_id'

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
  // Fetch the original creator's name through the secure RPC
  async getReporterName(ticketId: number): Promise<string | null> {
    const { data, error } = await supabase.rpc('get_ticket_reporter', {
      p_ticket_id: ticketId,
    })

    if (error) {
      throw new Error(`Failed to fetch ticket reporter: ${error.message}`)
    }

    return data
  },

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

    // Get the current user's role
    const { data: role, error: roleError } = await supabase.rpc('current_user_role')

    if (roleError || !role) {
      throw new Error('Unable to determine your user role.')
    }

    // Automatically assign tickets created by CSRs to themselves
    const assigneeId = role === 'admin' ? user.id : null
    let assigneeName: string | null = null

    if (assigneeId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', assigneeId)
        .single()

      if (profileError) {
        throw new Error(`Failed to fetch assignee name: ${profileError.message}`)
      }

      assigneeName = profile.full_name ?? 'Unnamed CSR'
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
        assignee_id: assigneeId,
        assignee: assigneeName,
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

  //Update Subject
  async updateSubject(id: number, subject: string): Promise<Ticket> {
    const { data, error } = await supabase.rpc('update_ticket_subject', {
      p_ticket_id: id,
      p_subject: subject,
    })

    if (error) {
      throw new Error(`Failed to update ticket subject: ${error.message}`)
    }

    if (!data) {
      throw new Error('Ticket not found or could not be updated.')
    }

    return mapTicket(data)
  },

  async updateDescription(id: number, description: string): Promise<Ticket> {
    const { data, error } = await supabase.rpc('update_ticket_description', {
      p_ticket_id: id,
      p_description: description,
    })

    if (error) {
      throw new Error(`Failed to update ticket description: ${error.message}`)
    }

    if (!data) {
      throw new Error('Ticket not found or could not be updated.')
    }

    return mapTicket(data)
  },

  async updatePriority(id: number, priority: Ticket['priority']): Promise<Ticket> {
    const { data, error } = await supabase.rpc('update_ticket_priority', {
      p_ticket_id: id,
      p_priority: priority,
    })

    if (error) {
      throw new Error(`Failed to update ticket priority: ${error.message}`)
    }

    if (!data) {
      throw new Error('Ticket not found or you do not have permission to change its priority.')
    }

    return mapTicket(data)
  },

  // Assign, reassign, or unassign a ticket
  async assignTicket(id: number, assigneeId: string | null): Promise<Ticket> {
    const { data, error } = await supabase.rpc('assign_ticket', {
      p_ticket_id: id,
      p_assignee_id: assigneeId,
    })

    if (error) {
      throw new Error(`Failed to update ticket assignment: ${error.message}`)
    }

    if (!data) {
      throw new Error('Ticket not found or assignment could not be updated.')
    }

    return mapTicket(data)
  },
}
