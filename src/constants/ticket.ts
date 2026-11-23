export const TICKET_CATEGORIES = [
  { label: 'Technical Issue', value: 'technical' },
  { label: 'Account & login', value: 'account' },
  { label: 'Billing', value: 'billing' },
  { label: 'Product Issue', value: 'product' },
  { label: 'Other', value: 'other' },
] as const

export const TICKET_PRIORITIES = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
] as const

export const TICKET_TYPES = [
  { label: 'Question', value: 'question' },
  { label: 'Incident', value: 'incident' },
  { label: 'Problem', value: 'problem' },
  { label: 'Request', value: 'request' },
] as const
