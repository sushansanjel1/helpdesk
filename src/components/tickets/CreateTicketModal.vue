<script setup lang="ts">
import { ref } from 'vue'

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

//storing values from modal
const subject = ref('')
const description = ref('')
const category = ref('')
const priority = ref('')
const type = ref('')

//emit
import type { Ticket } from '@/types/ticket.ts'
const emit = defineEmits<{
  (event: 'ticket-created', ticket: Ticket): void
}>()

//Handle Create Ticket Form
const createTicket = () => {
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
  emit('ticket-created', newTicket)

  //Reset the form after successful submission
  subject.value = ''
  description.value = ''
  category.value = ''
  priority.value = ''
  type.value = ''
}
</script>

<template>
  <Dialog>
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
              <Button type="submit">Create Ticket</Button>
            </Field>
          </DialogFooter>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
</template>
