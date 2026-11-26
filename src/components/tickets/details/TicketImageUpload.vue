<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import { MAX_TICKET_IMAGE_ATTACHMENTS } from '@/constants/ticket'
import { Trash2 } from 'lucide-vue-next'
import UIImageUploader from '@/components/lib/UIImageUploader.vue'
import ImagePreviewLightbox from '@/components/lib/ImagePreviewLightbox.vue'
import type { TicketAttachment } from '@/services/ticketAttachmentService'

const props = defineProps<{
  attachments: TicketAttachment[]
  isLoading: boolean
  error: string | null
  isUploading: boolean
  currentUserId: string | null
  deletingAttachmentId: string | null
}>()

const files = defineModel<File[]>('files', { default: () => [] })
const isDialogOpen = ref(false)
const selectedPreview = ref<TicketAttachment | null>(null)
const canAddImage = computed(
  () =>
    !props.isLoading &&
    !props.error &&
    !props.isUploading &&
    props.attachments.length < MAX_TICKET_IMAGE_ATTACHMENTS,
)
const uploaderFiles = computed<File[] | File | null>({
  get: () => files.value,
  set: (value) => {
    files.value = Array.isArray(value) ? value : value ? [value] : []
  },
})

const emit = defineEmits<{
  upload: [files: File[]]
  remove: [attachment: TicketAttachment]
}>()

watch(
  () => props.isUploading,
  (isUploading, wasUploading) => {
    if (wasUploading && !isUploading && files.value.length === 0) {
      isDialogOpen.value = false
    }
  },
)

watch(isDialogOpen, (isOpen) => {
  if (!isOpen && !props.isUploading) {
    files.value = []
  }
})

watch(
  () => props.attachments,
  (attachments) => {
    if (
      selectedPreview.value &&
      !attachments.some((attachment) => attachment.id === selectedPreview.value?.id)
    ) {
      selectedPreview.value = null
    }
  },
)

function uploadFiles() {
  if (!canAddImage.value || files.value.length === 0) return
  emit('upload', [...files.value])
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <span v-if="!isLoading && !error" class="text-xs text-muted-foreground">
        {{ attachments.length }} / {{ MAX_TICKET_IMAGE_ATTACHMENTS }} images
      </span>

      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button size="sm" variant="outline" :disabled="!canAddImage">Add image</Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add image</DialogTitle>
          </DialogHeader>

          <UIImageUploader
            v-model="uploaderFiles"
            :multiple="false"
            :max-size="5"
            :max-files="1"
            :disabled="!canAddImage"
          />

          <div class="flex justify-end">
            <Button :disabled="!canAddImage || files.length === 0" @click="uploadFiles">
              {{ isUploading ? 'Uploading...' : 'Add image' }}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <div v-if="isLoading" class="text-sm text-muted-foreground">Loading attachments...</div>

    <div
      v-else-if="error"
      class="rounded-lg border border-destructive/30 p-4 text-sm text-destructive"
    >
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div
        v-for="attachment in attachments"
        :key="attachment.id"
        class="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
      >
        <button
          type="button"
          :aria-label="`Preview ${attachment.file_name}`"
          :title="attachment.file_name"
          class="block w-full cursor-zoom-in text-left"
          @click="selectedPreview = attachment"
        >
          <img
            :src="attachment.signedUrl"
            :alt="attachment.file_name"
            class="h-40 w-full object-cover"
          />
        </button>

        <a
          :href="attachment.signedUrl"
          target="_blank"
          rel="noopener noreferrer"
          :title="attachment.file_name"
          class="block truncate px-3 py-2 text-xs text-muted-foreground"
        >
          {{ attachment.file_name }}
        </a>

        <button
          v-if="currentUserId === attachment.uploaded_by"
          type="button"
          :aria-label="`Remove ${attachment.file_name}`"
          :title="deletingAttachmentId === attachment.id ? 'Removing image...' : 'Remove image'"
          :disabled="deletingAttachmentId !== null"
          class="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white opacity-100 transition hover:bg-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
          @click.stop="emit('remove', attachment)"
        >
          <Trash2 class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <ImagePreviewLightbox
      :open="selectedPreview !== null"
      :src="selectedPreview?.signedUrl ?? ''"
      :alt="selectedPreview?.file_name ?? 'Ticket image'"
      @close="selectedPreview = null"
    />
  </section>
</template>
