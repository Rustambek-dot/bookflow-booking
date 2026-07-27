/**
 * Availability calculation — pure functions, fully testable.
 * Free slots = staff working hours − existing bookings, stepped by service duration.
 */
import type { StaffSchedule, Booking, TimeSlot } from '@/types'

interface AvailabilityInput {
  date: Date // day to compute slots for
  schedule: StaffSchedule[] // schedules of one staff member
  bookings: Pick<Booking, 'starts_at' | 'ends_at' | 'status'>[]
  durationMin: number
  staffId: string
  stepMin?: number // slot step, defaults to duration
  bufferMin?: number // buffer between bookings
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function computeFreeSlots({
  date,
  schedule,
  bookings,
  durationMin,
  staffId,
  stepMin,
  bufferMin = 0,
}: AvailabilityInput): TimeSlot[] {
  const weekday = date.getDay()
  const daySchedule = schedule.filter((s) => s.weekday === weekday)
  if (daySchedule.length === 0) return []

  const step = stepMin ?? durationMin
  const active = bookings
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .map((b) => ({
      start: new Date(b.starts_at).getTime(),
      end: new Date(b.ends_at).getTime() + bufferMin * 60_000,
    }))

  const slots: TimeSlot[] = []
  const now = Date.now()

  for (const window of daySchedule) {
    const windowStart = new Date(date)
    windowStart.setHours(0, timeToMinutes(window.start_time), 0, 0)
    const windowEnd = new Date(date)
    windowEnd.setHours(0, timeToMinutes(window.end_time), 0, 0)

    for (
      let t = windowStart.getTime();
      t + durationMin * 60_000 <= windowEnd.getTime();
      t += step * 60_000
    ) {
      const slotEnd = t + durationMin * 60_000
      if (t < now) continue // no past slots
      const overlaps = active.some((b) => t < b.end && slotEnd > b.start)
      if (!overlaps) {
        slots.push({
          start: new Date(t).toISOString(),
          end: new Date(slotEnd).toISOString(),
          staffId,
        })
      }
    }
  }

  return slots
}
