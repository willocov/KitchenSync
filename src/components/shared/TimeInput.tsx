import { useState } from 'react'

/** Parse a free-text time string into "HH:MM" 24h format. Returns null if unparseable. */
function parseTimeInput(raw: string): string | null {
  const s = raw.trim().toLowerCase()
  if (!s) return null

  const isPM = s.includes('pm')
  const isAM = s.includes('am')
  const cleaned = s.replace(/[apm]/g, '').replace(/\s/g, '')

  let hours: number
  let minutes: number

  const colonMatch = cleaned.match(/^(\d{1,2}):(\d{2})$/)
  const compactMatch = cleaned.match(/^(\d{1,2})(\d{2})$/)
  const hourOnlyMatch = cleaned.match(/^(\d{1,2})$/)

  if (colonMatch) {
    hours = parseInt(colonMatch[1])
    minutes = parseInt(colonMatch[2])
  } else if (compactMatch) {
    hours = parseInt(compactMatch[1])
    minutes = parseInt(compactMatch[2])
  } else if (hourOnlyMatch) {
    hours = parseInt(hourOnlyMatch[1])
    minutes = 0
  } else {
    return null
  }

  if (minutes > 59) return null

  if (isPM && hours < 12) hours += 12
  if (isAM && hours === 12) hours = 0
  if (hours > 23) return null

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/** Format "HH:MM" 24h string as "h:mm AM/PM" for display. */
function formatDisplay(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayH = h % 12 || 12
  return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`
}

interface TimeInputProps {
  value: string // "HH:MM" 24h
  onChange: (value: string) => void
  className?: string
}

export function TimeInput({ value, onChange, className = '' }: TimeInputProps) {
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState('')

  const handleFocus = () => {
    setDraft(formatDisplay(value))
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
    const parsed = parseTimeInput(draft)
    if (parsed) {
      onChange(parsed)
    }
    // If unparseable, silently revert to current value (displayed below)
  }

  return (
    <input
      type="text"
      value={focused ? draft : formatDisplay(value)}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="e.g. 6:30 PM"
      className={className}
    />
  )
}
