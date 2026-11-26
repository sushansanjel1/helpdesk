<script setup lang="ts">
import { computed } from 'vue'
import { useRelativeTimeClock } from '@/composable/useRelativeTimeClock'
import { formatExactTimestamp, formatRelativeTime } from '@/utils/formatRelativeTime'

const props = defineProps<{
  timestamp: string | null | undefined
}>()

const now = useRelativeTimeClock()
const relativeText = computed(() => formatRelativeTime(props.timestamp, now.value))
const exactText = computed(() => formatExactTimestamp(props.timestamp))
</script>

<template>
  <time
    :datetime="exactText ? (timestamp ?? undefined) : undefined"
    :title="exactText || undefined"
  >
    {{ relativeText }}
  </time>
</template>
