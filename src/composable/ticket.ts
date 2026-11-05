import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import type { CreateTicketInput, Ticket } from '@/types/ticket'
import { ticketService } from '@/services/ticketService'

export const useTickets = () => {
  const tickets = ref<Ticket[]>([])
  const isFetching = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isAssigning = ref(false)

  const fetchError = ref<string | null>(null)

  // Convert unknown errors into readable messages
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }

    return 'Something went wrong. Please try again.'
  }

  // Fetch tickets
  const fetchTickets = async (): Promise<void> => {
    isFetching.value = true
    fetchError.value = null

    try {
      tickets.value = await ticketService.getAll()
    } catch (err: unknown) {
      fetchError.value = getErrorMessage(err)
      toast.error(fetchError.value)
    } finally {
      isFetching.value = false
    }
  }

  // Create ticket
  const addTicket = async (ticket: CreateTicketInput): Promise<Ticket | null> => {
    isCreating.value = true

    try {
      const newTicket = await ticketService.create(ticket)

      tickets.value.unshift(newTicket)

      toast.success('Ticket created successfully!')

      return newTicket
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
      return null
    } finally {
      isCreating.value = false
    }
  }

  // Update ticket status
  const updateTicketStatus = async (
    id: number,
    status: Ticket['status'],
  ): Promise<Ticket | null> => {
    isUpdating.value = true

    try {
      // First update the database
      const updatedTicket = await ticketService.updateStatus(id, status)

      // Then synchronize the state
      const ticketIndex = tickets.value.findIndex((ticket) => ticket.id === id)

      if (ticketIndex !== -1) {
        tickets.value[ticketIndex] = updatedTicket
      }

      toast.success('Ticket status updated successfully!')

      return updatedTicket
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
      return null
    } finally {
      isUpdating.value = false
    }
  }

  // Assign or reassign a ticket
  const assignTicket = async (id: number, assigneeId: string): Promise<Ticket | null> => {
    isAssigning.value = true

    try {
      const updatedTicket = await ticketService.assignTicket(id, assigneeId)

      const ticketIndex = tickets.value.findIndex((ticket) => ticket.id === id)

      if (ticketIndex !== -1) {
        tickets.value[ticketIndex] = updatedTicket
      }

      toast.success('Ticket assigned successfully!')

      return updatedTicket
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
      return null
    } finally {
      isAssigning.value = false
    }
  }

  return {
    fetchTickets,
    tickets,
    addTicket,
    isFetching,
    isCreating,
    isUpdating,
    fetchError,
    updateTicketStatus,
    assignTicket,
    isAssigning,
  }
}
