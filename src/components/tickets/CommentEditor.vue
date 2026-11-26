<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Send, X } from 'lucide-vue-next'
import TiptapRichTextEditor from './TiptapRichTextEditor.vue'
import { hasMeaningfulText } from '@/utils/textChecker'

const props = defineProps<{
  content: string
  isSubmitting: boolean
  expanded: boolean
}>()

const emit = defineEmits<{
  'update:content': [content: string]
  'update:expanded': [expanded: boolean]
  submit: []
}>()

const richTextEditor = ref<{ focus: () => void } | null>(null)

const openEditor = async () => {
  emit('update:expanded', true)
  await nextTick()
  richTextEditor.value?.focus()
}

const closeEditor = () => {
  emit('update:content', '')
  emit('update:expanded', false)
}
</script>

<template>
  <div>
    <button
      v-if="!props.expanded"
      type="button"
      class="flex min-h-17 w-full items-center rounded-xl border border-input bg-background px-5 text-left text-muted-foreground transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      @click="openEditor"
    >
      Add a comment...
    </button>

    <div v-else class="overflow-hidden rounded-xl border border-input bg-background">
      <TiptapRichTextEditor
        ref="richTextEditor"
        :content="props.content"
        :disabled="props.isSubmitting"
        placeholder="Write a comment..."
        editor-class="min-h-24"
        @update:content="emit('update:content', $event)"
      >
        <template #toolbar-end>
          <button
            type="button"
            aria-label="Close comment editor"
            :disabled="props.isSubmitting"
            class="ml-auto flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            @mousedown.prevent
            @click="closeEditor"
          >
            <X class="h-4 w-4" />
          </button>
        </template>
      </TiptapRichTextEditor>

      <div class="flex justify-end px-4 pb-3">
        <button
          type="button"
          aria-label="Submit comment"
          :disabled="props.isSubmitting || !hasMeaningfulText(props.content)"
          class="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          @click="emit('submit')"
        >
          <Send class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>
