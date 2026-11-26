<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui'
import { sanitizeRichText } from '@/lib/utils'
import { hasMeaningfulText } from '@/utils/textChecker'
import TiptapRichTextEditor from '@/components/tickets/TiptapRichTextEditor.vue'

const props = defineProps<{
  description: string
  isSaving?: boolean
}>()

const emit = defineEmits<{
  save: [description: string]
}>()

const isEditing = ref(false)
const editedDescription = ref(props.description)
const safeDescription = computed(() => sanitizeRichText(props.description))

//Keep the Local description synchronized with the ticket

watch(
  () => props.description,
  (newDescription) => {
    if (!isEditing.value) {
      editedDescription.value = newDescription
    }
  },
)

const startEditing = () => {
  editedDescription.value = props.description
  isEditing.value = true
}

const cancelEditing = () => {
  editedDescription.value = props.description
  isEditing.value = false
}

const saveDescription = () => {
  const description = sanitizeRichText(editedDescription.value).trim()

  if (props.isSaving || !hasMeaningfulText(description)) return

  emit('save', description)
}
const closeEditor = () => {
  isEditing.value = false
}

defineExpose({
  closeEditor,
})
</script>

<template>
  <section class="space-y-4">
    <!-- Display mode -->
    <div v-if="!isEditing">
      <div
        v-if="description"
        class="cursor-pointer rounded-md text-sm leading-5 transition hover:bg-slate-100"
        @click="startEditing"
      >
        <div class="description-content text-sm leading-5" v-html="safeDescription" />
      </div>

      <p
        v-else
        class="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
        @click="startEditing"
      >
        Add a description
      </p>
    </div>

    <!-- Editing mode -->
    <div v-else class="space-y-3 rounded-lg border border-input p-3">
      <TiptapRichTextEditor
        v-model:content="editedDescription"
        placeholder="Add a description..."
        editor-class="min-h-32"
        :disabled="isSaving"
        auto-focus
      />

      <div class="flex justify-end gap-2">
        <Button size="sm" variant="outline" :disabled="isSaving" @click="cancelEditing">
          Cancel
        </Button>

        <Button
          size="sm"
          :disabled="isSaving || !hasMeaningfulText(editedDescription)"
          @click="saveDescription"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </Button>
      </div>
    </div>

    <slot />
  </section>
</template>

<style scoped>
.description-content :deep(p) {
    margin: 0 0 0.5rem;
}

.description-content :deep(p:last-child) {
    margin-bottom: 0;
}

.description-content :deep(ul),
.description-content :deep(ol) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.description-content :deep(ul),
.description-content :deep(ol > li[data-list='bullet']) {
    list-style-type: disc;
}

.description-content :deep(ol),
.description-content :deep(ol > li[data-list='ordered']) {
    list-style-type: decimal;
}

.description-content :deep(.ql-ui) {
    display: none;
}
</style>
