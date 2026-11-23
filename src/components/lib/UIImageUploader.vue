<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

interface Props {
  multiple?: boolean
  accept?: string
  maxSize?: number // In MB
  maxFiles?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  accept: 'image/png, image/jpeg, image/webp, image/gif',
  maxSize: 5,
  maxFiles: 10,
  disabled: false,
})

const model = defineModel<File[] | File | null>({
  default: () => [],
})

const emit = defineEmits<{
  uploaded: [files: File[]]
}>()

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const errorMessage = ref('')

interface ImagePreview {
  file: File
  url: string
}

const previews = ref<ImagePreview[]>([])

const currentFiles = computed<File[]>(() => {
  if (!model.value) return []
  return Array.isArray(model.value) ? model.value : [model.value]
})

function syncPreviews() {
  previews.value.forEach((preview) => URL.revokeObjectURL(preview.url))

  previews.value = currentFiles.value.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }))
}

function openFilePicker() {
  if (props.disabled) return
  inputRef.value?.click()
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  if (!props.disabled) isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  if (props.disabled) return

  const files = Array.from(event.dataTransfer?.files ?? [])
  processFiles(files)
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])

  processFiles(files)

  // Allow selecting the same file again
  target.value = ''
}

function processFiles(files: File[]) {
  errorMessage.value = ''

  if (!files.length) return

  const validFiles: File[] = []

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      errorMessage.value = `${file.name} is not an image.`
      continue
    }

    if (file.size > props.maxSize * 1024 * 1024) {
      errorMessage.value = `${file.name} exceeds ${props.maxSize}MB.`
      continue
    }

    validFiles.push(file)
  }

  if (!validFiles.length) return

  const nextFiles = props.multiple ? [...currentFiles.value, ...validFiles] : validFiles.slice(0, 1)

  const limitedFiles = props.multiple ? nextFiles.slice(0, props.maxFiles) : nextFiles

  if (nextFiles.length > props.maxFiles && props.multiple) {
    errorMessage.value = `Maximum ${props.maxFiles} images allowed.`
  }

  updateModel(limitedFiles)
  emit('uploaded', limitedFiles)
}

function updateModel(files: File[]) {
  model.value = props.multiple ? files : (files[0] ?? null)
  syncPreviews()
}

// function removeFile(index: number) {
//   if (props.disabled) return

//   const updatedFiles = currentFiles.value.filter((_, i) => i !== index)
//   updateModel(updatedFiles)
//   errorMessage.value = ''
// }

onBeforeUnmount(() => {
  previews.value.forEach((preview) => URL.revokeObjectURL(preview.url))
})
</script>

<template>
  <div class="w-full space-y-3">
    <!-- Dropzone -->
    <div
      role="button"
      tabindex="0"
      :aria-disabled="disabled"
      class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors"
      :class="[
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/30 bg-muted/20 hover:border-primary/60 hover:bg-muted/40',
        disabled ? 'cursor-not-allowed opacity-50' : '',
      ]"
      @click="openFilePicker"
      @keydown.enter.prevent="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        :disabled="disabled"
        @change="handleFileChange"
      />

      <div class="mb-3 rounded-full bg-muted p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m17 8-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
      </div>

      <p class="text-sm font-semibold">
        {{ isDragging ? 'Drop your images here' : 'Drag and drop your images here' }}
      </p>

      <p class="mt-1 text-sm text-muted-foreground">
        or
        <span class="font-medium text-primary">browse files</span>
      </p>

      <p class="mt-3 text-xs text-muted-foreground">
        {{ accept }} · Max {{ maxSize }}MB per image
        <span v-if="multiple"> · Up to {{ maxFiles }} images</span>
      </p>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-sm text-destructive">
      {{ errorMessage }}
    </p>
  </div>
</template>
