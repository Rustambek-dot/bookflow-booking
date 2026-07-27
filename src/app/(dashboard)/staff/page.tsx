'use client'

import { useState } from 'react'
import { Plus, Clock } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface StaffRow {
  id: string
  name: string
  specialization: string
  color: string
  hours: string
  active: boolean
  todayCount: number
}

const initial: StaffRow[] = [
  { id: 'st1', name: 'Alex Rivera', specialization: 'Senior Stylist', color: '#14b8a6', hours: 'Mon–Sat 9:00–18:00', active: true, todayCount: 5 },
  { id: 'st2', name: 'Jordan Kim', specialization: 'Color Specialist', color: '#f59e0b', hours: 'Tue–Sat 10:00–19:00', active: true, todayCount: 3 },
  { id: 'st3', name: 'Sam Patel', specialization: 'Junior Stylist', color: '#8b5cf6', hours: 'Mon–Fri 9:00–17:00', active: false, todayCount: 0 },
]

export default function StaffPage() {
  const [staff] = useState(initial)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Specialist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staff.map((s) => {
          const [first, last] = s.name.split(' ')
          return (
            <div key={s.id} className={`card p-5 ${!s.active ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: s.color }}
                >
                  {getInitials(first, last ?? '')}
                </div>
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-slate-500">{s.specialization}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <Clock className="w-4 h-4" /> {s.hours}
              </div>
              <div className="flex items-center justify-between">
                <span className={s.active ? 'badge-confirmed' : 'badge-cancelled'}>
                  {s.active ? 'active' : 'inactive'}
                </span>
                <span className="text-sm text-slate-500">{s.todayCount} bookings today</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
