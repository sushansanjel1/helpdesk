<script setup lang="ts">
import { ref } from 'vue'
import type { Ticket } from '@/types/ticket'

//Shadcn imports
import {
  Button,
  Input,
  Textarea,
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

import { LoaderCircle } from 'lucide-vue-next'

//storing values from modal
const subject = ref('')
const description = ref('')
const category = ref('')
const priority = ref('')
const type = ref('')

//saving and error state
const isSaving = ref(false)
// const errorMessage = ref('')

// Save function provided by the parent component
const props = defineProps<{
  saveTicket: (ticket: Ticket) => Promise<Ticket | null>
}>()

// Control whether the dialog is open
const isDialogOpen = ref(false)

// Handle Create Ticket Form
const createTicket = async () => {
  if (isSaving.value) return

  isSaving.value = true

  try {
    const newTicket: Ticket = {
      id: Date.now(),
      subject: subject.value.trim(),
      description: description.value.trim(),
      category: category.value,
      priority: priority.value,
      type: type.value,
      status: 'open',
      assignee: null,
      createdAt: new Date().toISOString(),
    }

    const savedTicket = await props.saveTicket(newTicket)

    if (!savedTicket) return

    // Reset the form after successful saving
    subject.value = ''
    description.value = ''
    category.value = ''
    priority.value = ''
    type.value = ''

    isDialogOpen.value = false
  } catch (error) {
    console.error('Failed to create ticket:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<!-- <template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button class="rounded-full"> +New Ticket </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-162.5">
      <DialogHeader>
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogDescription>
          Provide some details about your issue and we'll get back to you.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="createTicket">
        <FieldGroup>
          <Field>
            <FieldLabel for="subject">Subject</FieldLabel>
            <Input
              v-model="subject"
              id="subject"
              required
              placeholder="Briefly describe your issue..."
            />
          </Field>

          <Field>
            <FieldLabel for="description">Description</FieldLabel>
            <Textarea
              v-model="description"
              id="description"
              required
              placeholder="Please provide more details about your issue"
            ></Textarea>
          </Field>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel for="category">Category</FieldLabel>
              <Select v-model="category" name="category" required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account & login</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="product">Product Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel for="priority">Priority</FieldLabel>
              <Select v-model="priority" name="priority" required>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel for="type">Type</FieldLabel>
              <Select v-model="type" name="type" required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="problem">Problem</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Field orientation="horizontal">
              <DialogClose as-child>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" :disabled="isSaving">
                <LoaderCircle v-if="isSaving" class="mr-2 size-4 animate-spin" />
                {{ isSaving ? 'Creating...' : 'Create Ticket' }}
              </Button>
            </Field>
          </DialogFooter>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template> -->

<template>
  <Dialog v-model:open="isDialogOpen">
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
          <Field class="gap-2">
            <FieldLabel for="subject" class="font-medium text-slate-700"> Subject </FieldLabel>

            <Input
              id="subject"
              v-model="subject"
              required
              placeholder="e.g. Unable to access my account"
              class="border-slate-200 focus-visible:ring-blue-500"
            />
          </Field>

          <Field class="gap-2">
            <FieldLabel for="description" class="font-medium text-slate-700">
              Description
            </FieldLabel>

            <Textarea
              id="description"
              v-model="description"
              required
              placeholder="Describe what happened and what you were trying to do..."
              class="min-h-32 resize-y border-slate-200 focus-visible:ring-blue-500"
            />
            <p class="text-xs text-slate-500">
              Include any details that could help us understand the issue.
            </p>
          </Field>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field class="min-w-0 gap-2">
              <FieldLabel for="category" class="font-medium text-slate-700"> Category </FieldLabel>

              <Select v-model="category" name="category" required>
                <SelectTrigger id="category" class="w-full border-slate-200">
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
            </Field>

            <Field class="min-w-0 gap-2">
              <FieldLabel for="priority" class="font-medium text-slate-700"> Priority </FieldLabel>

              <Select v-model="priority" name="priority" required>
                <SelectTrigger id="priority" class="w-full border-slate-200">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field class="min-w-0 gap-2">
              <FieldLabel for="type" class="font-medium text-slate-700"> Type </FieldLabel>

              <Select v-model="type" name="type" required>
                <SelectTrigger id="type" class="w-full border-slate-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="problem">Problem</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                </SelectContent>
              </Select>
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
