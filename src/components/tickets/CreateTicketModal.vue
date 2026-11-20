<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import type { CreateTicketInput, Ticket } from '@/types/ticket'
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  Field,
  FieldLabel,
  FieldGroup,
} from '@/components/ui'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { QuillEditor } from '@vueup/vue-quill'

import { LoaderCircle } from 'lucide-vue-next'
import UIImageUploader from '../lib/UIImageUploader.vue'
import UIImagePreview from '../lib/UIImagePreview.vue'

//storing values from modal
const subject = ref('')
const description = ref('')
const category = ref('')
const priority = ref('')
const type = ref('')
const images = ref<File[]>([])

function handleUploaded(files: File[]) {
  console.log('Images added:', files)
}

//Validation rules
const rules = computed(() => ({
  subject: {
    required,
    minLength: helpers.withMessage('Subject must be at least 5 characters', minLength(5)),
  },
  description: {
    required,
    // minLength: helpers.withMessage('Description must be at least 10 characters.', minLength(10)),
  },
  category: {
    required: helpers.withMessage('Please select a category.', required),
  },
  priority: {
    required: helpers.withMessage('Please select a priority', required),
  },
  type: {
    required: helpers.withMessage('Please select a type', required),
  },
}))

const v$ = useVuelidate(rules, {
  subject,
  description,
  category,
  priority,
  type,
})

//saving and error state
const isSaving = ref(false)
// const errorMessage = ref('')

// Save function provided by the parent component
const props = defineProps<{
  saveTicket: (ticket: CreateTicketInput) => Promise<Ticket | null>
}>()

// Control whether the dialog is open
const isDialogOpen = ref(false)

//Handle Dialog Change function
const handleDialogChange = async (isOpen: boolean) => {
  if (!isOpen) {
    await nextTick()
    v$.value.$reset()
  }
}

// Handle Create Ticket Form
const createTicket = async () => {
  if (isSaving.value) return

  const isValid = await v$.value.$validate()
  if (!isValid) return

  isSaving.value = true

  try {
    const newTicket: CreateTicketInput = {
      subject: subject.value.trim(),
      description: description.value.trim(),
      category: category.value,
      priority: priority.value,
      type: type.value,
    }

    const savedTicket = await props.saveTicket(newTicket)

    if (!savedTicket) return

    // Reset the form after successful saving
    subject.value = ''
    description.value = ''
    category.value = ''
    priority.value = ''
    type.value = ''

    v$.value.$reset()

    isDialogOpen.value = false
  } catch (error) {
    console.error('Failed to create ticket:', error)
  } finally {
    isSaving.value = false
  }
}

// clear images when the dialog is closed
watch(isDialogOpen, (newValue) => {
  if (!newValue) {
    images.value = []
  }
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen" @update:open="handleDialogChange">
    <DialogTrigger as-child>
      <Button class="gap-2 rounded-lg px-4 font-medium shadow-sm">
        <span class="text-lg leading-none">+</span>
        New Ticket
      </Button>
    </DialogTrigger>

    <DialogContent
      class="max-h-[90vh] overflow-y-auto border-slate-200 bg-white p-6 sm:max-w-2xl sm:p-8"
    >
      <DialogHeader class="space-y-2">
        <DialogTitle class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Create a new ticket
        </DialogTitle>

        <DialogDescription class="text-sm leading-6 text-slate-500">
          Tell us about the issue you're experiencing. Our support team will help you resolve it.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="createTicket" class="mt-4">
        <FieldGroup class="gap-5">
          <!-- Subject Field -->
          <Field class="gap-2">
            <FieldLabel for="subject" class="font-medium text-slate-700"> Subject </FieldLabel>

            <Input
              id="subject"
              v-model="subject"
              placeholder="e.g. Unable to access my account"
              class="border-slate-200 focus-visible:ring-blue-500"
              :class="{ 'border-red-500 focus-visible:ring-red-500': v$.subject.$error }"
              @blur="isDialogOpen && v$.subject.$touch"
            />
            <p v-if="v$.subject.$error" class="text-xs text-red-500">
              {{ v$.subject.$errors[0]?.$message }}
            </p>
          </Field>
          <!-- Description Field  -->
          <Field class="gap-2">
            <FieldLabel for="description" class="font-medium text-slate-700">
              Description
            </FieldLabel>

            <!-- <Textarea
              id="description"
              v-model="description"
              placeholder="Describe what happened and what you were trying to do..."
              class="min-h-32 resize-y border-slate-200 focus-visible:ring-blue-500"
              :class="{ 'border-red-500 focus-visible:ring-red-500': v$.description.$error }"
              @blur="isDialogOpen && v$.description.$touch"
            /> -->
            <!-- {{ description }} -->
            <QuillEditor
              theme="snow"
              id="description"
              v-model:content="description"
              content-type="html"
              toolbar="minimal"
              placeholder="Describe what happened and what you were trying to do..."
              class="min-h-32 resize-y border-slate-200 focus-visible:ring-blue-500"
              :class="{ 'border-red-500 focus-visible:ring-red-500': v$.description.$error }"
              @blur="isDialogOpen && v$.description.$touch"
            ></QuillEditor>

            <p class="text-xs text-slate-500">
              Include any details that could help us understand the issue.
            </p>
            <p v-if="v$.description.$error" class="text-xs text-red-500">
              {{ v$.description.$errors[0]?.$message }}
            </p>
          </Field>

          <!-- Image Upload Field -->
          <Field class="gap-2">
            <FieldLabel for="images" class="font-medium text-slate-700"> Images </FieldLabel>
            <UIImageUploader
              v-model="images"
              @uploaded="handleUploaded"
              :max-size="5"
              :max-files="5"
            />
            <div class="my-4">
              <UIImagePreview v-model="images" multiple />
            </div>
          </Field>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <!-- Category Field  -->
            <Field class="min-w-0 gap-2">
              <FieldLabel for="category" class="font-medium text-slate-700"> Category </FieldLabel>

              <Select v-model="category" name="category" @update:model-value="v$.category.$touch">
                <SelectTrigger
                  id="category"
                  class="w-full border-slate-200"
                  :class="{ 'border-red-500 focus:ring-red-500': v$.category.$error }"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account &amp; login</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="product">Product Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <p v-if="v$.category.$error" class="text-xs text-red-500">
                {{ v$.category.$errors[0]?.$message }}
              </p>
            </Field>

            <!-- Priority Field  -->
            <Field class="min-w-0 gap-2">
              <FieldLabel for="priority" class="font-medium text-slate-700"> Priority </FieldLabel>

              <Select v-model="priority" name="priority" @update:model-value="v$.priority.$touch">
                <SelectTrigger
                  id="priority"
                  class="w-full border-slate-200"
                  :class="{ 'border-red-500 focus:ring-red-500': v$.priority.$error }"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <p v-if="v$.priority.$error" class="text-xs text-red-500">
                {{ v$.priority.$errors[0]?.$message }}
              </p>
            </Field>
            <!-- Type Field  -->
            <Field class="min-w-0 gap-2">
              <FieldLabel for="type" class="font-medium text-slate-700"> Type </FieldLabel>

              <Select v-model="type" name="type" @update:model-value="v$.type.$touch">
                <SelectTrigger
                  id="type"
                  class="w-full border-slate-200"
                  :class="{ 'border-red-500 focus:ring-red-500': v$.type.$error }"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="problem">Problem</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                </SelectContent>
              </Select>

              <p v-if="v$.type.$error" class="text-xs text-red-500">
                {{ v$.type.$errors[0]?.$message }}
              </p>
            </Field>
          </div>

          <DialogFooter class="mt-2 gap-2 border-t border-slate-100 pt-5 sm:gap-2">
            <DialogClose as-child>
              <Button type="button" variant="outline" class="w-full border-slate-200 sm:w-auto">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" :disabled="isSaving" class="w-full sm:w-auto">
              <LoaderCircle v-if="isSaving" class="mr-2 size-4 animate-spin" />
              {{ isSaving ? 'Creating...' : 'Create Ticket' }}
            </Button>
          </DialogFooter>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
