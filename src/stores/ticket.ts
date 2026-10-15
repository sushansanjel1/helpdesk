import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ticket } from '@/types/ticket'
import { TICKETS } from '../constants/ticket'

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref<Ticket[]>([])

  const addTicket = (ticket: Ticket) => {
    tickets.value.unshift(ticket)
  }

  const fetchTicket = async () => {
    try {
      // start loader
      //Load mock ticket data
      tickets.value = TICKETS
    } catch {
      // error handling
      console.log('Failed to load tickets')
    } finally {
      // stop loader+
    }
  }

  return {
    tickets,
    addTicket,
    fetchTicket,
  }
})
