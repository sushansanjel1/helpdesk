import { ref } from 'vue'
import type { CreateTicketInput, Ticket } from '@/types/ticket'
import { ticketService } from '@/services/ticketService'

export const useTickets = () => {
  const tickets = ref<Ticket[]>([])
  const isFetching = ref(false)
  const isCreating = ref(false)

  const errorMessage = ref<string | null>(null)

  //Convert unknown errors into readable messages (Error Handling)
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    return `Something went wrong. Pleaase try again.`
  }

  //Fetch tickets
  const fetchTickets = async (): Promise<void> => {
    isFetching.value = true
    errorMessage.value = null

    try {
      tickets.value = await ticketService.getAll()
    } catch (err: unknown) {
      errorMessage.value = getErrorMessage(err)
    } finally {
      isFetching.value = false
    }
  }
  //Create ticket
  const addTicket = async (ticket: CreateTicketInput): Promise<Ticket | null> => {
    isCreating.value = true
    errorMessage.value = null
    try {
      const newTicket = await ticketService.create(ticket)
      tickets.value.unshift(newTicket)
      return newTicket
    } catch (err: unknown) {
      errorMessage.value = getErrorMessage(err)
      return null
    } finally {
      isCreating.value = false
    }
  }

  // onMounted(() => {
  //   fetchTickets()
  // })

  return {
    fetchTickets,
    tickets,
    addTicket,
    isFetching,
    isCreating,
    errorMessage,
  }
}
