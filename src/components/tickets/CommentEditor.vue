<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Send, X } from 'lucide-vue-next'
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

const editor = useEditor({
  content: props.content,
  editable: !props.isSubmitting,
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      'aria-label': 'Write a comment',
      class:
        'min-h-24 text-sm leading-6 focus:outline-none',
    },
  },
  onUpdate: ({ editor: currentEditor }) => {
    emit('update:content', currentEditor.getHTML())
  },
})

const openEditor = async () => {
  emit('update:expanded', true)
  await nextTick()
  editor.value?.commands.focus('end')
}

const closeEditor = () => {
  emit('update:content', '')
  emit('update:expanded', false)
}

watch(
  () => props.content,
  (content) => {
    if (editor.value && editor.value.getHTML() !== content) {
      editor.value.commands.setContent(content || '', { emitUpdate: false })
    }
  },
)

watch(
  () => props.isSubmitting,
  (isSubmitting) => {
    editor.value?.setEditable(!isSubmitting)
  },
)

</script>

<template>
  <div>
    <button
      v-if="!expanded"
      type="button"
      class="flex min-h-17 w-full items-center rounded-xl border border-input bg-background px-5 text-left text-muted-foreground transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      @click="openEditor"
    >
      Add a comment...
    </button>

    <div v-else class="overflow-hidden rounded-xl border border-input bg-background">
      <div
        class="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2"
        role="toolbar"
        aria-label="Comment formatting"
      >
        <button
          type="button"
          aria-label="Bold"
          :aria-pressed="editor?.isActive('bold') ?? false"
          :disabled="isSubmitting || !editor"
          class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <Bold class="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Italic"
          :aria-pressed="editor?.isActive('italic') ?? false"
          :disabled="isSubmitting || !editor"
          class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <Italic class="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Bulleted list"
          :aria-pressed="editor?.isActive('bulletList') ?? false"
          :disabled="isSubmitting || !editor"
          class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <List class="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Numbered list"
          :aria-pressed="editor?.isActive('orderedList') ?? false"
          :disabled="isSubmitting || !editor"
          class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <ListOrdered class="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Close comment editor"
          :disabled="isSubmitting"
          class="ml-auto flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          @mousedown.prevent
          @click="closeEditor"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="space-y-3 px-4 py-3">
        <EditorContent :editor="editor" class="comment-editor-content" />

        <div class="flex justify-end">
          <button
            type="button"
            aria-label="Submit comment"
            :disabled="isSubmitting || !hasMeaningfulText(content)"
            class="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('submit')"
          >
            <Send class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-editor-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}

.comment-editor-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}
</style>
