<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Button,
} from '@/components/ui'

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')

const emit = defineEmits<{
  (
    event: 'filter-change',
    filters: {
      searchQuery: string
      selectedStatus: string
      selectedPriority: string
    },
  ): void
}>()

const emitFilters = () => {
  emit('filter-change', {
    searchQuery: searchQuery.value,
    selectedStatus: selectedStatus.value,
    selectedPriority: selectedPriority.value,
  })
}
const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPriority.value = ''
}

watch([searchQuery, selectedStatus, selectedPriority], emitFilters)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Search Tickets</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <Input v-model="searchQuery" placeholder="Search by subject or ticket ID..." />
      <Button variant="outline" @click="clearFilters"> Clear filters </Button>
      <FieldGroup class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select name="status" id="status" v-model="selectedStatus">
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-progress"> In Progress</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Priority</FieldLabel>
          <Select name="priority" id="priority" v-model="selectedPriority">
            <SelectTrigger>
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
      </FieldGroup>
    </CardContent>
  </Card>
</template>
