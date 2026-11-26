import { onBeforeUnmount, onMounted, ref } from 'vue'

const now = ref(Date.now())
let subscriberCount = 0
let intervalId: number | null = null

export function useRelativeTimeClock() {
  let subscribed = false

  onMounted(() => {
    if (typeof window === 'undefined') return

    subscribed = true
    subscriberCount += 1
    now.value = Date.now()

    if (intervalId === null) {
      intervalId = window.setInterval(() => {
        now.value = Date.now()
      }, 60_000)
    }
  })

  onBeforeUnmount(() => {
    if (!subscribed || typeof window === 'undefined') return

    subscribed = false
    subscriberCount -= 1

    if (subscriberCount === 0 && intervalId !== null) {
      window.clearInterval(intervalId)
      intervalId = null
    }
  })

  return now
}
