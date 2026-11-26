import { describe, expect, it } from 'vitest'
import { formatExactTimestamp, formatRelativeTime } from './formatRelativeTime'

const now = Date.parse('2026-11-26T15:40:00.000Z')

describe('formatRelativeTime', () => {
  it('formats recent past and future timestamps', () => {
    expect(formatRelativeTime(new Date(now - 5 * 60_000).toISOString(), now)).toBe('5 minutes ago')
    expect(formatRelativeTime(new Date(now + 60 * 60_000).toISOString(), now)).toBe('In 1 hour')
    expect(formatRelativeTime(new Date(now - 24 * 60 * 60_000).toISOString(), now)).toBe('Yesterday')
  })

  it('falls back to a calendar date for older timestamps', () => {
    const timestamp = new Date(now - 45 * 24 * 60 * 60_000)
    const expected = new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(timestamp)

    expect(formatRelativeTime(timestamp.toISOString(), now)).toBe(expected)
  })

  it('returns an empty string for missing or invalid timestamps', () => {
    expect(formatRelativeTime(null, now)).toBe('')
    expect(formatRelativeTime('not-a-timestamp', now)).toBe('')
    expect(formatRelativeTime(new Date(now).toISOString(), Number.NaN)).toBe('')
    expect(formatExactTimestamp('not-a-timestamp')).toBe('')
  })

  it('formats an exact local date and time for the tooltip', () => {
    const timestamp = new Date(now).toISOString()
    const expected = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(timestamp))

    expect(formatExactTimestamp(timestamp)).toBe(expected)
  })
})
