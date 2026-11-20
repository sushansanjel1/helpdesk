import type { Ticket } from '@/types/ticket'
import type { TicketStatusAction } from '@/types/ticket'

export const getAvailableStatusActions = (status: Ticket['status']): TicketStatusAction[] => {
  switch (status) {
    case 'open':
      return [{ label: 'Start Progress', status: 'in-progress' }]

    case 'in-progress':
      return [
        { label: 'Stop Progress', status: 'open' },
        { label: 'Resolve', status: 'resolved' },
      ]

    case 'resolved':
      return [
        { label: 'Reopen', status: 'in-progress' },
        { label: 'Close', status: 'closed' },
      ]

    case 'closed':
      return [{ label: 'Reopen', status: 'open' }]

    default:
      return []
  }
}
