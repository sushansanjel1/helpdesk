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
import UIImageUploader from '@/components/lib/UIImageUploader.vue'
import type { TicketAttachment } from '@/services/ticketAttachmentService'

const props = defineProps<{
  attachments: TicketAttachment[]
  isLoading: boolean
  error: string | null
  isUploading: boolean
  uploadError: string | null
}>()

const files = defineModel<File[]>('files', { default: () => [] })
const isDialogOpen = ref(false)
const uploaderFiles = computed<File[] | File | null>({
  get: () => files.value,
  set: (value) => {
    files.value = Array.isArray(value) ? value : value ? [value] : []
  },
})

const emit = defineEmits<{
  upload: [files: File[]]
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

function uploadFiles() {
  if (props.isUploading || files.value.length === 0) return
  emit('upload', [...files.value])
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button size="sm" variant="outline">Add image</Button>
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
            :disabled="isUploading"
          />

          <p v-if="uploadError" role="alert" class="text-sm text-destructive">
            {{ uploadError }}
          </p>

          <div class="flex justify-end">
            <Button :disabled="isUploading || files.length === 0" @click="uploadFiles">
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
      <a
        v-for="attachment in attachments"
        :key="attachment.id"
        :href="attachment.signedUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        :title="attachment.file_name"
      >
        <img
          :src="attachment.signedUrl"
          :alt="attachment.file_name"
          class="h-40 w-full object-cover"
        />
        <div class="truncate px-3 py-2 text-xs text-muted-foreground">
          {{ attachment.file_name }}
        </div>
      </a>
    </div>
  </section>
</template>
