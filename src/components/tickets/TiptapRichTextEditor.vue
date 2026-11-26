<script setup lang="ts">
import { computed, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered } from 'lucide-vue-next'
import { sanitizeRichText } from '@/lib/utils'
import { hasMeaningfulText } from '@/utils/textChecker'

const props = withDefaults(
  defineProps<{
    content: string
    placeholder: string
    editorClass?: string
    id?: string
    disabled?: boolean
    autoFocus?: boolean
  }>(),
  {
    editorClass: 'min-h-28',
    disabled: false,
    autoFocus: false,
  },
)

const emit = defineEmits<{
  'update:content': [content: string]
  blur: []
}>()

const prepareContent = (content: string) => {
  const safeContent = sanitizeRichText(content)

  if (!safeContent.includes('data-list')) return safeContent

  const container = document.createElement('div')
  container.innerHTML = safeContent

  container.querySelectorAll('ol').forEach((list) => {
    const items = Array.from(list.children).filter(
      (child) => child.tagName.toLowerCase() === 'li',
    ) as HTMLLIElement[]

    if (!items.some((item) => item.dataset.list === 'bullet')) return

    const replacement = document.createDocumentFragment()
    let activeType = ''
    let activeList: HTMLOListElement | HTMLUListElement | null = null

    items.forEach((item) => {
      const type = item.dataset.list === 'bullet' ? 'ul' : 'ol'

      if (type !== activeType) {
        activeList = document.createElement(type)
        replacement.append(activeList)
        activeType = type
      }

      item.removeAttribute('data-list')
      item.querySelector(':scope > .ql-ui')?.remove()
      activeList?.append(item)
    })

    list.replaceWith(replacement)
  })

  return container.innerHTML
}

const initialContent = prepareContent(props.content)
const editor = useEditor({
  content: initialContent,
  editable: !props.disabled,
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      autolink: false,
      linkOnPaste: false,
    }),
  ],
  editorProps: {
    attributes: {
      ...(props.id ? { id: props.id } : {}),
      'aria-label': props.placeholder,
      class: `${props.editorClass} text-sm leading-6 focus:outline-none`,
    },
  },
  onUpdate: ({ editor: currentEditor }) => {
    emit('update:content', currentEditor.getHTML())
  },
  onBlur: () => emit('blur'),
})

const isEmpty = computed(() => !hasMeaningfulText(props.content))

watch(
  () => props.content,
  (content) => {
    const preparedContent = prepareContent(content)

    if (editor.value && editor.value.getHTML() !== preparedContent) {
      editor.value.commands.setContent(preparedContent || '', { emitUpdate: false })
    }
  },
)

watch(
  () => props.disabled,
  (disabled) => {
    editor.value?.setEditable(!disabled)
  },
)

watch(
  editor,
  (currentEditor) => {
    if (currentEditor && props.autoFocus) {
      currentEditor.commands.focus('end')
    }
  },
  { flush: 'post' },
)

const focus = () => editor.value?.commands.focus('end')

defineExpose({ focus })
</script>

<template>
  <div class="overflow-hidden rounded-md">
    <div class="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2" role="toolbar">
      <button
        type="button"
        aria-label="Bold"
        :aria-pressed="editor?.isActive('bold') ?? false"
        :disabled="disabled || !editor"
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
        :disabled="disabled || !editor"
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
        :disabled="disabled || !editor"
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
        :disabled="disabled || !editor"
        class="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
        @mousedown.prevent
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <ListOrdered class="h-4 w-4" />
      </button>
      <slot name="toolbar-end" />
    </div>

    <div class="relative px-3 py-2">
      <EditorContent :editor="editor" />
      <span
        v-if="isEmpty"
        aria-hidden="true"
        class="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground"
      >
        {{ placeholder }}
      </span>
    </div>
  </div>
</template>

<style scoped>
:deep(.tiptap ul) {
  list-style: disc;
  padding-left: 1.5rem;
}

:deep(.tiptap ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

:deep(.tiptap p) {
  margin: 0;
}
</style>
