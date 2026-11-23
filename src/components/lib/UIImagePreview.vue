<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  multiple?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  disabled: false,
})

const model = defineModel<File[] | File | null>({
  default: () => [],
})

interface ImagePreview {
  file: File
  url: string
}

const previews = ref<ImagePreview[]>([])

const files = computed<File[]>(() => {
  if (!model.value) return []
  return Array.isArray(model.value) ? model.value : [model.value]
})

function revokePreviews() {
  previews.value.forEach((preview) => {
    URL.revokeObjectURL(preview.url)
  })
}

function generatePreviews() {
  revokePreviews()

  previews.value = files.value.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }))
}

function removeImage(index: number) {
  if (props.disabled) return

  const updatedFiles = files.value.filter((_, i) => i !== index)

  model.value = props.multiple ? updatedFiles : (updatedFiles[0] ?? null)
}

// Regenerate previews whenever the model changes.
watch(
  files,
  () => {
    generatePreviews()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  revokePreviews()
})
</script>

<template>
  <div v-if="previews.length" class="w-full">
    <div
      class="grid gap-3"
      :class="multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'"
    >
      <div
        v-for="(preview, index) in previews"
        :key="`${preview.file.name}-${index}`"
        class="group relative overflow-hidden rounded-lg border bg-muted"
      >
        <img
          :src="preview.url"
          :alt="preview.file.name"
          class="w-full object-cover"
          :class="multiple ? 'h-32 sm:h-40' : 'max-h-80'"
        />

        <!-- Delete button -->
        <button
          v-if="!disabled"
          type="button"
          aria-label="Remove image"
          class="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white transition hover:bg-destructive sm:opacity-0 sm:group-hover:opacity-100"
          @click="removeImage(index)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <!-- Filename -->
        <div class="truncate px-3 py-2 text-xs text-muted-foreground">
          {{ preview.file.name }}
        </div>
      </div>
    </div>
  </div>
</template>
