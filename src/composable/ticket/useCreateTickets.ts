import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import type { CreateTicketInput, Ticket } from '@/types/ticket'
import { hasMeaningfulText } from '@/utils/textChecker'

export function useCreateTicket(saveTicket: (ticket: CreateTicketInput) => Promise<Ticket | null>) {
  // Form state
  const subject = ref('')
  const description = ref('')
  const category = ref('')
  const priority = ref('')
  const type = ref('')

  // Loading state
  const isSaving = ref(false)

  // Validation rules
  const rules = computed(() => ({
    subject: {
      required: helpers.withMessage(
        'Please enter a subject.',
        (value: string) => value.trim().length > 0,
      ),
      minLength: helpers.withMessage(
        'Subject must be at least 5 characters',
        (value: string) => value.trim().length >= 5,
      ),
    },
    description: {
      required: helpers.withMessage('Please enter a description.', (value: string) =>
        hasMeaningfulText(value),
      ),
    },
    category: {
      required: helpers.withMessage('Please select a category.', required),
    },
    priority: {
      required: helpers.withMessage('Please select a priority', required),
    },
    type: {
      required: helpers.withMessage('Please select a type', required),
    },
  }))

  // Vuelidate instance
  const v$ = useVuelidate(rules, {
    subject,
    description,
    category,
    priority,
    type,
  })

  // Reset form values and validation
  function resetForm() {
    subject.value = ''
    description.value = ''
    category.value = ''
    priority.value = ''
    type.value = ''

    v$.value.$reset()
  }

  // Reset validation state only
  function resetValidation() {
    v$.value.$reset()
  }

  // Submit ticket
  async function createTicket(): Promise<boolean> {
    if (isSaving.value) return false

    const isValid = await v$.value.$validate()
    if (!isValid) return false

    isSaving.value = true

    try {
      const newTicket: CreateTicketInput = {
        subject: subject.value.trim(),
        description: description.value.trim(),
        category: category.value,
        priority: priority.value,
        type: type.value,
      }

      const savedTicket = await saveTicket(newTicket)

      if (!savedTicket) return false

      resetForm()

      return true
    } catch (error) {
      console.error('Failed to create ticket:', error)
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    subject,
    description,
    category,
    priority,
    type,
    isSaving,
    v$,
    createTicket,
    resetForm,
    resetValidation,
  }
}
