'use client'

import { CalendarDays, DollarSign, Users, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const todayBookings = [
  { time: '09:00', service: 'Haircut & Styling', customer: 'Nina Park', staff: 'Alex Rivera', status: 'confirmed' },
  { time: '10:30', service: 'Full Color', customer: 'Maria Lopez', staff: 'Jordan Kim', status: 'confirmed' },
  { time: '13:00', service: 'Beard Trim', customer: 'Tom Hale', staff: 'Alex Rivera', status: 'pending' },
  { time: '15:00', service: 'Deep Conditioning', customer: 'Amy Chen', staff: 'Jordan Kim', status: 'confirmed' },
]

const weekLoad = [
  { day: 'Mon', bookings: 9 }, { day: 'Tue', bookings: 12 }, { day: 'Wed', bookings: 8 },
  { day: 'Thu', bookings: 14 }, { day: 'Fri', bookings: 16 }, { day: 'Sat', bookings: 18 }, { day: 'Sun', bookings: 0 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's bookings", value: '4', icon: CalendarDays },
          { label: "Today's revenue", value: formatCurrency(235), icon: DollarSign },
          { label: 'Utilization', value: '76%', icon: TrendingUp },
          { label: 'New customers (wk)', value: '11', icon: Users },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">{s.label}</span>
              <s.icon className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Today&apos;s Schedule</h2>
          <div className="space-y-3">
            {todayBookings.map((b) => (
              <div key={b.time + b.customer} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="font-mono font-semibold text-primary-600 dark:text-primary-400 w-14">{b.time}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{b.service}</div>
                  <div className="text-xs text-slate-500">{b.customer} · {b.staff}</div>
                </div>
                <span className={b.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Week load */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4">This Week&apos;s Load</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weekLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415530" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
