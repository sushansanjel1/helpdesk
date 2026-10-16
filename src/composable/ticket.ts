import { ref } from 'vue'
import type { Ticket } from '@/types/ticket'
import { TICKETS } from '@/constants/ticket'

//Shared state: one ticket list for the entire app
const tickets = ref<Ticket[]>([])

export const useTickets = () => {
  const fetchTickets = () => {
    // tickets.value = TICKETS
    if (tickets.value.length === 0) {
      tickets.value = [...TICKETS]
    }
  }
  const addTicket = (ticket: Ticket) => {
    tickets.value.unshift(ticket)
  }
  return {
    tickets,
    fetchTickets,
    addTicket,
  }
}
