import type { Ticket } from '@/types/ticket'

export const TICKETS: Ticket[] = [
  {
    id: 1024,
    subject: 'Payment Failed',
    description: 'The customer payment did not go through.',
    category: 'billing',
    priority: 'high',
    type: 'incident',
    status: 'in-progress',
    assignee: 'Support Agent 1',
    createdAt: '2026-10-10T09:00:00Z',
  },
  {
    id: 1022,
    subject: 'Login Problem',
    description: 'The customer cannot log in to their account.',
    category: 'account',
    priority: 'high',
    type: 'problem',
    status: 'in-progress',
    assignee: 'Support Agent 2',
    createdAt: '2026-10-09T10:30:00Z',
  },
  {
    id: 1019,
    subject: 'Refund Request',
    description: 'The customer is requesting a refund.',
    category: 'billing',
    priority: 'low',
    type: 'request',
    status: 'resolved',
    assignee: 'Support Agent 1',
    createdAt: '2026-10-08T11:00:00Z',
  },
]
