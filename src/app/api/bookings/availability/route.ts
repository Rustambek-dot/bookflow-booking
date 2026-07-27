import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { computeFreeSlots } from '@/services/availability.service'
import type { StaffSchedule } from '@/types'

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  staffId: z.string().min(1),
  durationMin: z.coerce.number().int().min(5).max(480),
})

// Demo schedule: Mon-Sat 9:00-18:00. In production this is loaded from staff_schedules.
const demoSchedule = (staffId: string): StaffSchedule[] =>
  [1, 2, 3, 4, 5, 6].map((weekday) => ({
    id: `${staffId}-${weekday}`,
    staff_id: staffId,
    weekday,
    start_time: '09:00',
    end_time: '18:00',
  }))

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
    }

    const { date, staffId, durationMin } = parsed.data
    const slots = computeFreeSlots({
      date: new Date(`${date}T00:00:00`),
      schedule: demoSchedule(staffId),
      bookings: [],
      durationMin,
      staffId,
      stepMin: 30,
    })

    return NextResponse.json({ data: slots })
  } catch (error) {
    console.error('Availability error:', error)
    return NextResponse.json({ error: 'Failed to compute availability' }, { status: 500 })
  }
}
