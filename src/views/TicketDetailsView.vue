<script lang="ts" setup>
import { useRoute, RouterLink } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui'
import { useTickets } from '@/composable/ticket/useTickets'
import { useAuthStore } from '@/stores/auth'
import type { Ticket } from '@/types/ticket'
import { useCsrs } from '@/composable/profile'
import { getAvailableStatusActions } from '@/utils/ticketStatus'
import { MAX_TICKET_IMAGE_ATTACHMENTS } from '@/constants/ticket'
import TicketHeader from '@/components/tickets/details/TicketHeader.vue'
import TicketDescription from '@/components/tickets/details/TicketDescription.vue'
import TicketImageUpload from '@/components/tickets/details/TicketImageUpload.vue'
import TicketDetailsSidebar from '@/components/tickets/details/TicketDetailsSidebar.vue'
import TicketComments from '@/components/tickets/TicketComments.vue'
import { ticketAttachmentService, type TicketAttachment } from '@/services/ticketAttachmentService'

const route = useRoute()
const authStore = useAuthStore()
const {
  tickets,
  isFetching,
  isUpdating,
  isUpdatingSubject,
  updateTicketStatus,
  updateTicketSubject,
  fetchError,
  fetchTickets,
  assignTicket,
  isAssigning,
  isUpdatingDescription,
  updateTicketDescription,
  isUpdatingPriority,
  updateTicketPriority,
  reporterName,
  isFetchingReporterName,
  fetchReporterName,
} = useTickets()

const descriptionEditor = ref<{
  closeEditor: () => void
} | null>(null)

const { csrs, isFetchingCsrs, fetchCsrs } = useCsrs()

//Get ticket ID from the URL
const ticketId = computed(() => Number(route.params.id))

//Find the corresponding ticket
const ticket = computed(() => tickets.value.find((item) => item.id === ticketId.value))
const attachments = ref<TicketAttachment[]>([])
const isFetchingAttachments = ref(false)
const attachmentError = ref<string | null>(null)
const selectedAttachmentFiles = ref<File[]>([])
const isUploadingAttachments = ref(false)
const deletingAttachmentId = ref<string | null>(null)

const fetchAttachments = async (id: number) => {
  isFetchingAttachments.value = true
  attachmentError.value = null
  attachments.value = []

  try {
    attachments.value = await ticketAttachmentService.getForTicket(id)
  } catch (error: unknown) {
    attachmentError.value =
      error instanceof Error ? error.message : 'Failed to load ticket attachments.'
  } finally {
    isFetchingAttachments.value = false
  }
}

const handleAttachmentUpload = async (files: File[]) => {
  if (!ticket.value || isUploadingAttachments.value || isFetchingAttachments.value) return

  if (attachmentError.value) {
    toast.error('Unable to verify the current image count. Please try again.')
    return
  }

  if (attachments.value.length + files.length > MAX_TICKET_IMAGE_ATTACHMENTS) {
    toast.error(`A ticket can have up to ${MAX_TICKET_IMAGE_ATTACHMENTS} images.`)
    return
  }

  isUploadingAttachments.value = true

  try {
    await ticketAttachmentService.upload(ticket.value.id, files)
    selectedAttachmentFiles.value = []
    await fetchAttachments(ticket.value.id)
    toast.success('Image uploaded successfully.')
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'Failed to upload ticket image.')
  } finally {
    isUploadingAttachments.value = false
  }
}

const handleAttachmentRemove = async (attachment: TicketAttachment) => {
  if (deletingAttachmentId.value) return

  deletingAttachmentId.value = attachment.id

  try {
    await ticketAttachmentService.remove(attachment)
    await fetchAttachments(attachment.ticket_id)
    toast.success('Image removed successfully.')
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'Failed to remove ticket image.')
  } finally {
    deletingAttachmentId.value = null
  }
}

watch(
  ticketId,
  (id) => {
    if (Number.isInteger(id) && id > 0) {
      fetchAttachments(id)
    }
  },
  { immediate: true },
)

const selectedCsrId = ref('')

//Keep the selected CSR synchronized with the ticket
watch(
  ticket,
  (currentTicket) => {
    selectedCsrId.value = currentTicket?.assigneeId ?? ''
  },
  { immediate: true },
)

watch(
  ticket,
  (currentTicket, previousTicket) => {
    if (currentTicket && currentTicket.id !== previousTicket?.id) {
      fetchReporterName(currentTicket.id)
    }
  },
  { immediate: true },
)
// Assign, reassign, or unassign a ticket
const handleAssignment = async (assigneeId: string | null) => {
  if (!ticket.value) return

  const currentTicket = ticket.value

  const updatedTicket = await assignTicket(currentTicket.id, assigneeId)

  if (updatedTicket) {
    selectedCsrId.value = updatedTicket.assigneeId ?? ''
  } else {
    // Restore the previous selection if the request fails
    selectedCsrId.value = currentTicket.assigneeId ?? ''
  }
}

const availableActions = computed(() => {
  if (!ticket.value || !authStore.canManageTickets) return []

  return getAvailableStatusActions(ticket.value.status)
})

//Update ticket status
const handleStatusChange = async (status: Ticket['status']) => {
  if (!ticket.value) return

  await updateTicketStatus(ticket.value.id, status)
}

const handlePriorityChange = async (priority: Ticket['priority']) => {
  if (!ticket.value) return

  await updateTicketPriority(ticket.value.id, priority)
}

const handleSubjectSave = async (subject: string) => {
  if (!ticket.value) return

  await updateTicketSubject(ticket.value.id, subject)
}

const handleDescriptionSave = async (description: string) => {
  if (!ticket.value) return

  const updatedTicket = await updateTicketDescription(ticket.value.id, description)

  if (updatedTicket) {
    descriptionEditor.value?.closeEditor()
  }
}

//Initial data fetching
onMounted(() => {
  fetchTickets()

  if (authStore.isManager) {
    fetchCsrs()
  }
})
</script>
<template>
  <main class="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-6">
      <!-- Back navigation -->
      <RouterLink to="/tickets">
        <Button size="sm" class="mb-4"> ← Back to Tickets </Button>
      </RouterLink>

      <!-- Loading and error states -->
      <div v-if="isFetching" class="py-12 text-center text-muted-foreground">
        Loading ticket details...
      </div>

      <div
        v-else-if="fetchError"
        class="rounded-lg border border-destructive/30 p-5 text-sm text-destructive"
      >
        {{ fetchError }}
      </div>

      <div
        v-else-if="!Number.isInteger(ticketId) || ticketId <= 0"
        class="py-12 text-center text-muted-foreground"
      >
        Invalid ticket ID.
      </div>

      <div v-else-if="!ticket" class="py-12 text-center text-muted-foreground">
        Ticket not found.
      </div>

      <!-- Ticket details layout -->
      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <!-- Main content -->
        <div class="min-w-0 space-y-8">
          <!-- Ticket header -->
          <TicketHeader :ticket="ticket" :is-saving="isUpdatingSubject" @save="handleSubjectSave" />

          <!-- <div class="border-t" /> -->

          <!-- Description -->
          <TicketDescription
            ref="descriptionEditor"
            :description="ticket.description"
            :is-saving="isUpdatingDescription"
            @save="handleDescriptionSave"
          >
            <TicketImageUpload
              v-model:files="selectedAttachmentFiles"
              :attachments="attachments"
              :is-loading="isFetchingAttachments"
              :error="attachmentError"
              :is-uploading="isUploadingAttachments"
              :current-user-id="authStore.profile?.id ?? null"
              :deleting-attachment-id="deletingAttachmentId"
              @upload="handleAttachmentUpload"
              @remove="handleAttachmentRemove"
            />
          </TicketDescription>

          <TicketComments :ticket-id="ticket.id" />
        </div>

        <!-- Right sidebar -->
        <div class="min-w-0">
          <TicketDetailsSidebar
            :ticket="ticket"
            :csrs="csrs"
            :is-manager="authStore.isManager"
            :is-admin="authStore.isAdmin"
            :current-user-id="authStore.profile?.id ?? null"
            :can-manage-tickets="authStore.canManageTickets"
            :is-fetching-csrs="isFetchingCsrs"
            :is-assigning="isAssigning"
            :is-updating="isUpdating"
            :is-updating-priority="isUpdatingPriority"
            :available-actions="availableActions"
            :selected-csr-id="selectedCsrId"
            @update:selected-csr-id="selectedCsrId = $event"
            @status-change="handleStatusChange"
            @priority-change="handlePriorityChange"
            @assign="handleAssignment"
            :reporter-name="reporterName"
            :is-fetching-reporter-name="isFetchingReporterName"
          />
        </div>
      </div>
    </div>
  </main>
</template>
