import { onMounted, ref } from 'vue'
import type { Ticket } from '@/types/ticket'
import { supabase } from '@/lib/supabase'
import { getTickets } from '@/services/ticketService'

export const useTickets = () => {
  const tickets = ref<Ticket[]>([])

  const fetchTickets = async () => {
    tickets.value = await getTickets()
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
      status: data.status,
      assignee: data.assignee,
      createdAt: data.created_at,
    }

    tickets.value.unshift(savedTicket)
    return savedTicket
  }

  onMounted(() => {
    fetchTickets()
  })
  return {
    tickets,
    addTicket,
  }
}
