<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import { computed } from 'vue'
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  Field,
  FieldLabel,
  FieldGroup,
} from '@/components/ui'
import { QuillEditor } from '@vueup/vue-quill'
import { LoaderCircle } from 'lucide-vue-next'
import UIImageUploader from '../lib/UIImageUploader.vue'
import UIImagePreview from '../lib/UIImagePreview.vue'
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_TYPES } from '@/constants/ticket'

type ValidationField = {
  $error: boolean
  $errors: ErrorObject[]
  $touch: () => void
}

type TicketFormValidation = {
  subject: ValidationField
  description: ValidationField
  category: ValidationField
  priority: ValidationField
  type: ValidationField
}

const props = defineProps<{
  subject: string
  description: string
  category: string
  priority: string
  type: string
  images: File[]
  isSaving: boolean
  v$: TicketFormValidation
}>()

const emit = defineEmits<{
  'update:subject': [value: string]
  'update:description': [value: string]
  'update:category': [value: string]
  'update:priority': [value: string]
  'update:type': [value: string]
  'update:images': [value: File[]]
  submit: []
  cancel: []
}>()

const imagesModel = computed({
  get: () => props.images,
  set: (value) => emit('update:images', Array.isArray(value) ? value : []),
})
</script>

<template>
  <form @submit.prevent="emit('submit')">
    <FieldGroup class="gap-5">
      <!-- Subject -->
      <Field class="gap-2">
        <FieldLabel for="subject" class="font-medium text-slate-700"> Subject </FieldLabel>

        <Input
          id="subject"
          :model-value="props.subject"
          @update:model-value="emit('update:subject', String($event))"
          placeholder="e.g. Unable to access my account"
          class="border-slate-200 focus-visible:ring-blue-500"
          :class="{ 'border-red-500 focus-visible:ring-red-500': props.v$.subject.$error }"
          @blur="props.v$.subject.$touch"
        />

        <p v-if="props.v$.subject.$error" class="text-xs text-red-500">
          {{ props.v$.subject.$errors[0]?.$message }}
        </p>
      </Field>

      <!-- Description -->
      <Field class="gap-2">
        <FieldLabel for="description" class="font-medium text-slate-700"> Description </FieldLabel>

        <QuillEditor
          theme="snow"
          id="description"
          :content="props.description"
          @update:content="emit('update:description', $event)"
          content-type="html"
          toolbar="minimal"
          placeholder="Describe what happened and what you were trying to do..."
          class="min-h-32 resize-y border-slate-200 focus-visible:ring-blue-500"
          :class="{ 'border-red-500 focus-visible:ring-red-500': props.v$.description.$error }"
          @blur="props.v$.description.$touch"
        />

        <p class="text-xs text-slate-500">
          Include any details that could help us understand the issue.
        </p>

        <p v-if="props.v$.description.$error" class="text-xs text-red-500">
          {{ props.v$.description.$errors[0]?.$message }}
        </p>
      </Field>

      <!-- Images -->
      <Field class="gap-2">
        <FieldLabel for="images" class="font-medium text-slate-700"> Images </FieldLabel>

        <UIImageUploader v-model="imagesModel" multiple :max-size="5" :max-files="5" />

        <UIImagePreview v-if="imagesModel.length" v-model="imagesModel" multiple class="mt-3" />
      </Field>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <!-- Category -->
        <Field class="min-w-0 gap-2">
          <FieldLabel for="category" class="font-medium text-slate-700"> Category </FieldLabel>

          <Select
            :model-value="props.category"
            name="category"
            @update:model-value="
              (value) => {
                emit('update:category', String(value))
                props.v$.category.$touch()
              }
            "
          >
            <SelectTrigger
              id="category"
              class="w-full border-slate-200"
              :class="{ 'border-red-500 focus:ring-red-500': props.v$.category.$error }"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="option in TICKET_CATEGORIES"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <p v-if="props.v$.category.$error" class="text-xs text-red-500">
            {{ props.v$.category.$errors[0]?.$message }}
          </p>
        </Field>

        <!-- Priority -->
        <Field class="min-w-0 gap-2">
          <FieldLabel for="priority" class="font-medium text-slate-700"> Priority </FieldLabel>

          <Select
            :model-value="props.priority"
            name="priority"
            @update:model-value="
              (value) => {
                emit('update:priority', String(value))
                props.v$.priority.$touch()
              }
            "
          >
            <SelectTrigger
              id="priority"
              class="w-full border-slate-200"
              :class="{ 'border-red-500 focus:ring-red-500': props.v$.priority.$error }"
            >
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="option in TICKET_PRIORITIES"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <p v-if="props.v$.priority.$error" class="text-xs text-red-500">
            {{ props.v$.priority.$errors[0]?.$message }}
          </p>
        </Field>

        <!-- Type -->
        <Field class="min-w-0 gap-2">
          <FieldLabel for="type" class="font-medium text-slate-700"> Type </FieldLabel>

          <Select
            :model-value="props.type"
            name="type"
            @update:model-value="
              (value) => {
                emit('update:type', String(value))
                props.v$.type.$touch()
              }
            "
          >
            <SelectTrigger
              id="type"
              class="w-full border-slate-200"
              :class="{ 'border-red-500 focus:ring-red-500': props.v$.type.$error }"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem v-for="option in TICKET_TYPES" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <p v-if="props.v$.type.$error" class="text-xs text-red-500">
            {{ props.v$.type.$errors[0]?.$message }}
          </p>
        </Field>
      </div>

      <!-- Actions -->
      <div
        class="mt-2 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"
      >
        <Button
          type="button"
          variant="outline"
          class="w-full border-slate-200 sm:w-auto"
          @click="emit('cancel')"
        >
          Cancel
        </Button>

        <Button type="submit" :disabled="props.isSaving" class="w-full sm:w-auto">
          <LoaderCircle v-if="props.isSaving" class="mr-2 size-4 animate-spin" />
          {{ props.isSaving ? 'Creating...' : 'Create Ticket' }}
        </Button>
      </div>
    </FieldGroup>
  </form>
</template>
