import { TICKETS } from '@/constants/ticket'

export const fetchTicket = async () => {
  return setTimeout(() => {
    return ticketSchema.parse(TICKETS)
  }, 1000)
}
