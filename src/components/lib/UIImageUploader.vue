<script setup lang="ts">
import { computed, ref } from 'vue'
import { Upload } from 'lucide-vue-next'

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

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const errorMessage = ref('')

const currentFiles = computed<File[]>(() => {
  if (!model.value) return []
  return Array.isArray(model.value) ? model.value : [model.value]
})

const acceptedTypes = computed(() =>
  props.accept
    .split(',')
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean),
)

const acceptedFormats = computed(() => {
  if (!acceptedTypes.value.length) return 'All image formats'

  return acceptedTypes.value
    .map((type) => (type.startsWith('image/') ? type.slice('image/'.length) : type))
    .join(', ')
    .toUpperCase()
})

function isAcceptedType(file: File): boolean {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  if (!acceptedTypes.value.length) return true

  return acceptedTypes.value.some((type) => {
    if (type.startsWith('.')) return fileName.endsWith(type)
    if (type.endsWith('/*')) return fileType.startsWith(type.slice(0, -1))
    return fileType === type
  })
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

  const dropzone = event.currentTarget
  if (
    dropzone instanceof HTMLElement &&
    event.relatedTarget instanceof Node &&
    dropzone.contains(event.relatedTarget)
  ) {
    return
  }

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
  if (!files.length) return

  const validFiles: File[] = []
  const errors: string[] = []

  for (const file of files) {
    if (!file.type.toLowerCase().startsWith('image/')) {
      errors.push(`${file.name} is not an image.`)
      continue
    }

    if (!isAcceptedType(file)) {
      errors.push(`${file.name} has an unsupported image format.`)
      continue
    }

    if (file.size > props.maxSize * 1024 * 1024) {
      errors.push(`${file.name} exceeds ${props.maxSize}MB.`)
      continue
    }

    validFiles.push(file)
  }

  const availableSlots = props.multiple
    ? Math.max(0, props.maxFiles - currentFiles.value.length)
    : 1
  const acceptedFiles = validFiles.slice(0, availableSlots)

  if (validFiles.length > availableSlots) {
    errors.push(
      props.multiple
        ? `Maximum ${props.maxFiles} images allowed.`
        : 'Only one image can be selected.',
    )
  }

  errorMessage.value = errors.join(' ')

  if (!acceptedFiles.length) return

  const nextFiles = props.multiple ? [...currentFiles.value, ...acceptedFiles] : acceptedFiles

  model.value = props.multiple ? nextFiles : (nextFiles[0] ?? null)
}
</script>

<template>
  <div class="w-full space-y-3">
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden"
      :disabled="disabled"
      @click.stop
      @change="handleFileChange"
    />

    <!-- Dropzone -->
    <div
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      aria-label="Choose or drop image files"
      class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors"
      :class="[
        isDragging && !disabled
          ? 'border-primary bg-primary/5'
          : disabled
            ? 'cursor-not-allowed border-muted-foreground/30 bg-muted/20 opacity-50'
            : 'border-muted-foreground/30 bg-muted/20 hover:border-primary/60 hover:bg-muted/40',
      ]"
      @click="openFilePicker"
      @keydown.enter.prevent="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div class="mb-3 rounded-full bg-muted p-4">
        <Upload class="size-7" aria-hidden="true" />
      </div>

      <p class="text-sm font-semibold">
        {{ isDragging ? 'Drop your images here' : 'Drag and drop your images here' }}
      </p>

      <p class="mt-1 text-sm text-muted-foreground">
        or
        <span class="font-medium text-primary">browse files</span>
      </p>

      <p class="mt-3 text-xs text-muted-foreground">
        {{ acceptedFormats }} · Max {{ maxSize }}MB per image
        <span v-if="multiple"> · Up to {{ maxFiles }} images</span>
      </p>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" role="alert" class="text-sm text-destructive">
      {{ errorMessage }}
    </p>
  </div>
</template>
