<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  src: string
  alt: string
}>()

const emit = defineEmits<{
  close: []
}>()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof window === 'undefined') return

    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4"
      @click="emit('close')"
    >
      <div
        role="dialog"
        aria-modal="true"
        :aria-label="`Image preview: ${alt}`"
        class="relative flex max-h-full max-w-full items-center justify-center"
        @click.stop
      >
        <button
          type="button"
          aria-label="Close image preview"
          class="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          @click="emit('close')"
        >
          <X class="size-5" aria-hidden="true" />
        </button>

        <img
          :src="src"
          :alt="alt"
          class="block max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        />
      </div>
    </div>
  </Teleport>
</template>
