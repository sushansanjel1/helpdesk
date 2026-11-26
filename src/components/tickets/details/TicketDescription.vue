<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { Button } from '@/components/ui'
import { sanitizeRichText } from '@/lib/utils'
import { hasMeaningfulText } from '@/utils/textChecker'

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
        <div class="ql-editor p-0 text-sm leading-5" v-html="safeDescription" />
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
      <QuillEditor
        v-model:content="editedDescription"
        theme="snow"
        content-type="html"
        toolbar="minimal"
        placeholder="Add a description..."
        class="min-h-32"
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
