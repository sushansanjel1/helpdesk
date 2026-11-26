import { ref } from 'vue'
import { toast } from 'vue-sonner'
import type { CreateTicketInput, Ticket } from '@/types/ticket'
import { ticketService } from '@/services/ticketService'
import { ticketAttachmentService } from '@/services/ticketAttachmentService'

export const useTickets = () => {
  const tickets = ref<Ticket[]>([])

  //convert isFetching, isCreating, isUpdating, isAssigning to a single isLoading state.
  const isFetching = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isAssigning = ref(false)
  const isUpdatingPriority = ref(false)
  const isUpdatingSubject = ref(false)
  const isUpdatingDescription = ref(false)

  const fetchError = ref<string | null>(null)
  // Reporter information
  const reporterName = ref<string | null>(null)
  const isFetchingReporterName = ref(false)

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
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate 300ms delay for demonstration
      tickets.value = await ticketService.getAll()
    } catch (err: unknown) {
      fetchError.value = getErrorMessage(err)
      toast.error(fetchError.value)
    } finally {
      isFetching.value = false
    }
  }

  // Fetch ticket reporter
  const fetchReporterName = async (ticketId: number): Promise<void> => {
    isFetchingReporterName.value = true
    reporterName.value = null

    try {
      reporterName.value = await ticketService.getReporterName(ticketId)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    } finally {
      isFetchingReporterName.value = false
    }
  }

  // Create ticket
  const addTicket = async (
    ticket: CreateTicketInput,
    images: File[] = [],
  ): Promise<Ticket | null> => {
    isCreating.value = true

    try {
      const newTicket = await ticketService.create(ticket)

      tickets.value.unshift(newTicket)

      if (images.length > 0) {
        try {
          await ticketAttachmentService.upload(newTicket.id, images)
          toast.success('Ticket and images created successfully!')
        } catch (attachmentError: unknown) {
          // Ticket creation is not transactional with attachment upload.
          // Keep the created ticket in the UI and report the partial failure clearly.
          toast.error(
            `Ticket created, but the images could not be uploaded: ${getErrorMessage(attachmentError)}`,
          )
        }
      } else {
        toast.success('Ticket created successfully!')
      }

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

  //Update ticket subject
  const updateTicketSubject = async (id: number, subject: string): Promise<Ticket | null> => {
    isUpdatingSubject.value = true

    try {
      const updatedTicket = await ticketService.updateSubject(id, subject)

      const ticketIndex = tickets.value.findIndex((ticket) => ticket.id === id)

      if (ticketIndex !== -1) {
        tickets.value[ticketIndex] = updatedTicket
      }

      toast.success('Ticket subject updated successfully!')
      return updatedTicket
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
      return null
    } finally {
      isUpdatingSubject.value = false
    }
  }

  //Update ticket description
  const updateTicketDescription = async (
    id: number,
    description: string,
  ): Promise<Ticket | null> => {
    isUpdatingDescription.value = true

    try {
      const updatedTicket = await ticketService.updateDescription(id, description)

      const ticketIndex = tickets.value.findIndex((ticket) => ticket.id === id)

      if (ticketIndex !== -1) {
        tickets.value[ticketIndex] = updatedTicket
      }

      toast.success('Ticket description updated successfully!')
      return updatedTicket
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
      return null
    } finally {
      isUpdatingDescription.value = false
    }
  }

  const updateTicketPriority = async (
    id: number,
    priority: Ticket['priority'],
  ): Promise<Ticket | null> => {
    isUpdatingPriority.value = true

    try {
      const updatedTicket = await ticketService.updatePriority(id, priority)
      const ticketIndex = tickets.value.findIndex((ticket) => ticket.id === id)

      if (ticketIndex !== -1) {
        tickets.value[ticketIndex] = updatedTicket
      }

      toast.success('Ticket priority updated successfully!')
      return updatedTicket
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
      return null
    } finally {
      isUpdatingPriority.value = false
    }
  }

  // Assign or reassign a ticket
  const assignTicket = async (id: number, assigneeId: string | null): Promise<Ticket | null> => {
    isAssigning.value = true

    try {
      const updatedTicket = await ticketService.assignTicket(id, assigneeId)

      const ticketIndex = tickets.value.findIndex((ticket) => ticket.id === id)

      if (ticketIndex !== -1) {
        tickets.value[ticketIndex] = updatedTicket
      }

      toast.success(
        assigneeId === null ? 'Ticket unassigned successfully!' : 'Ticket assigned successfully!',
      )

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
    isUpdatingSubject,
    fetchError,
    updateTicketStatus,
    updateTicketSubject,
    assignTicket,
    isAssigning,
    isUpdatingDescription,
    updateTicketDescription,
    isUpdatingPriority,
    updateTicketPriority,
    reporterName,
    isFetchingReporterName,
    fetchReporterName,
  }
}
