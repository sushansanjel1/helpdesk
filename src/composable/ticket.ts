import { ref } from 'vue'
import type { Ticket } from '@/types/ticket'
import { supabase } from '@/lib/supabase'

//Shared state: one ticket list for the entire app
const tickets = ref<Ticket[]>([])

export const useTickets = () => {
  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('id, subject, description, category, priority, type, status, assignee, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch tickets:', error.message)
      return
    }

    //Why map the data?
    // To keep the database snake_case and TypeScript camelCase consistent.
    tickets.value = (data ?? []).map((ticket) => ({
      id: Number(ticket.id),
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      type: ticket.type,
      status: ticket.status as Ticket['status'],
      assignee: ticket.assignee,
      createdAt: ticket.created_at,
    }))
  }

  const addTicket = async (ticket: Ticket): Promise<Ticket | null> => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Unable to get the current user')
      return null
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
      console.error('Failed to create ticket:', error.message)
      return null
    }

    const savedTicket: Ticket = {
      id: Number(data.id),
      subject: data.subject,
      description: data.description,
      category: data.category,
      priority: data.priority,
      type: data.type,
      status: data.status as Ticket['status'],
      assignee: data.assignee,
      createdAt: data.created_at,
    }

    tickets.value.unshift(savedTicket)
    return savedTicket
  }
  return {
    tickets,
    fetchTickets,
    addTicket,
  }
}
