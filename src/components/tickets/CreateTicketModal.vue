<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import type { CreateTicketInput, Ticket } from '@/types/ticket'
import { useCreateTicket } from '@/composable/ticket/useCreateTickets.ts'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import CreateTicketForm from './CreateTicketForm.vue'

// Save function provided by the parent component
const props = defineProps<{
  saveTicket: (ticket: CreateTicketInput, images: File[]) => Promise<Ticket | null>
}>()

// Form state, validation, and submission logic
const {
  subject,
  description,
  category,
  priority,
  type,
  isSaving,
  v$,
  createTicket,
  resetValidation,
} = useCreateTicket(props.saveTicket)

// Image upload state
const images = ref<File[]>([])

// Dialog state
const isDialogOpen = ref(false)

// Handle successful ticket creation
async function handleCreateTicket() {
  const isCreated = await createTicket(images.value)

  if (isCreated) {
    isDialogOpen.value = false
  }
}

// Handle dialog changes
async function handleDialogChange(isOpen: boolean) {
  if (!isOpen) {
    await nextTick()
    resetValidation()
  }
}

// Clear images when dialog closes
watch(isDialogOpen, (newValue) => {
  if (!newValue) {
    images.value = []
  }
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen" @update:open="handleDialogChange">
    <DialogTrigger as-child>
      <Button class="gap-2 rounded-lg px-4 font-medium shadow-sm">
        <span class="text-lg leading-none">+</span>
        New Ticket
      </Button>
    </DialogTrigger>

    <DialogContent
      class="max-h-[90vh] overflow-y-auto border-slate-200 bg-white p-6 sm:max-w-2xl sm:p-8"
    >
      <DialogHeader class="space-y-2">
        <DialogTitle class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Create a new ticket
        </DialogTitle>

        <DialogDescription class="text-sm leading-6 text-slate-500">
          Tell us about the issue you're experiencing. Our support team will help you resolve it.
        </DialogDescription>
      </DialogHeader>

      <div class="mt-4">
        <CreateTicketForm
          :subject="subject"
          @update:subject="subject = $event"
          :description="description"
          @update:description="description = $event"
          :category="category"
          @update:category="category = $event"
          :priority="priority"
          @update:priority="priority = $event"
          :type="type"
          @update:type="type = $event"
          :images="images"
          @update:images="images = $event"
          :is-saving="isSaving"
          :v$="v$"
          @submit="handleCreateTicket"
          @cancel="isDialogOpen = false"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
