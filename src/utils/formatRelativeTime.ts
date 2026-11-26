const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const month = 30 * day

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
const calendarDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const exactDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
  timeStyle: 'short',
})

const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase() + value.slice(1)

export function formatRelativeTime(
  timestamp: string | null | undefined,
  now: number = Date.now(),
): string {
  if (!timestamp?.trim() || !Number.isFinite(now)) return ''

  const date = new Date(timestamp)
  const timestampMs = date.getTime()

  if (!Number.isFinite(timestampMs)) return ''

  const difference = timestampMs - now
  const absoluteDifference = Math.abs(difference)

  if (absoluteDifference < minute) {
    return difference > 0 ? 'In a few seconds' : 'Just now'
  }

  if (absoluteDifference < hour) {
    return capitalize(relativeFormatter.format(Math.round(difference / minute), 'minute'))
  }

  if (absoluteDifference < day) {
    return capitalize(relativeFormatter.format(Math.round(difference / hour), 'hour'))
  }

  if (absoluteDifference < week) {
    return capitalize(relativeFormatter.format(Math.round(difference / day), 'day'))
  }

  if (absoluteDifference < month) {
    return capitalize(relativeFormatter.format(Math.round(difference / week), 'week'))
  }

  return calendarDateFormatter.format(date)
}

export function formatExactTimestamp(timestamp: string | null | undefined): string {
  if (!timestamp?.trim()) return ''

  const date = new Date(timestamp)

  return Number.isFinite(date.getTime()) ? exactDateTimeFormatter.format(date) : ''
}
