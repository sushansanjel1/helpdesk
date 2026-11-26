<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Ticket } from '@/types/ticket'
import { Button } from '@/components/ui'
import { Check, X } from 'lucide-vue-next'

const props = defineProps<{
  ticket: Ticket
  isSaving?: boolean
}>()

const emit = defineEmits<{
  save: [subject: string]
}>()

const isEditing = ref(false)
const editedSubject = ref(props.ticket.subject)
const subjectInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.ticket.subject,
  (newSubject) => {
    editedSubject.value = newSubject
    isEditing.value = false
  },
)

const startEditing = async () => {
  editedSubject.value = props.ticket.subject
  isEditing.value = true

  await nextTick()
  subjectInput.value?.focus()
  subjectInput.value?.select()
}

const cancelEditing = () => {
  editedSubject.value = props.ticket.subject
  isEditing.value = false
}

const saveSubject = () => {
  if (props.isSaving) return

  const subject = editedSubject.value.trim()

  if (subject.length < 5) return

  if (subject === props.ticket.subject) {
    isEditing.value = false
    return
  }

  emit('save', subject)
}
</script>

<template>
  <section class="space-y-3">
    <!-- Inline editable subject -->
    <div v-if="isEditing" class="space-y-2">
      <input
        ref="subjectInput"
        v-model="editedSubject"
        maxlength="150"
        class="w-full rounded-md border border-input bg-background px-3 py-2 text-xl leading-6 font-semibold tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Enter ticket subject"
        @keydown.enter.prevent="saveSubject"
        @keydown.esc="cancelEditing"
      />

      <div class="flex items-center justify-end gap-2">
        <Button
          size="icon"
          class="h-8 w-8"
          title="Save subject"
          :disabled="props.isSaving || editedSubject.trim().length < 5"
          @click="saveSubject"
        >
          <Check v-if="!isSaving" />
          <span v-else>...</span>
        </Button>

        <Button
          size="icon"
          variant="outline"
          class="h-8 w-8"
          title="Cancel editing"
          :disabled="isSaving"
          @click="cancelEditing"
        >
          <X />
        </Button>
      </div>
    </div>

    <p
      v-else
      class="cursor-text -mx-2 rounded-md border border-transparent px-2 py-1 text-xl leading-6 font-semibold tracking-tight text-foreground transition-colors hover:border-border hover:bg-muted/40"
      title="Click to edit subject"
      @click="startEditing"
    >
      {{ ticket.subject }}
    </p>
  </section>
</template>
