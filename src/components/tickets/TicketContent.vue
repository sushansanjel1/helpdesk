<script setup lang="ts">
import { ref } from 'vue'

import { Button } from '../ui/button/index.ts'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const totalNoOfTickets = ref(41)
</script>

<template>
  <main>
    <div class="flex justify-between container bg-gray-100 mx-auto pt-30 px-10">
      <div>
        <h1 class="font-bold text-2xl">Tickets</h1>
        <p>{{ totalNoOfTickets }} {{ totalNoOfTickets > 1 ? 'tickets' : 'ticket' }} in total</p>
      </div>
    </div>
    <Dialog>
      <DialogTrigger><Button class="rounded-full"> +New Ticket </Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription> ajfdslak </DialogDescription>
        </DialogHeader>
        <Button>Submit</Button>
      </DialogContent>
    </Dialog>
  </main>
</template>
