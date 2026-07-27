'use client'

import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { formatCurrency, formatDateWithTime } from '@/lib/utils'

interface Row {
  id: string
  when: string
  service: string
  customer: string
  staff: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  amount: number
}

const rows: Row[] = [
  { id: 'b1', when: '2026-07-27T09:00:00', service: 'Haircut & Styling', customer: 'Nina Park', staff: 'Alex Rivera', status: 'confirmed', amount: 45 },
  { id: 'b2', when: '2026-07-27T10:30:00', service: 'Full Color', customer: 'Maria Lopez', staff: 'Jordan Kim', status: 'confirmed', amount: 110 },
  { id: 'b3', when: '2026-07-27T13:00:00', service: 'Beard Trim', customer: 'Tom Hale', staff: 'Alex Rivera', status: 'pending', amount: 25 },
  { id: 'b4', when: '2026-07-26T15:00:00', service: 'Deep Conditioning', customer: 'Amy Chen', staff: 'Jordan Kim', status: 'completed', amount: 55 },
  { id: 'b5', when: '2026-07-25T11:00:00', service: 'Haircut & Styling', customer: 'Ben Ortiz', staff: 'Alex Rivera', status: 'no_show', amount: 45 },
  { id: 'b6', when: '2026-07-24T16:30:00', service: 'Full Color', customer: 'Kate Miller', staff: 'Jordan Kim', status: 'cancelled', amount: 110 },
]

const badge: Record<Row['status'], string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
  no_show: 'badge-cancelled',
}

export default function BookingsPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (status === 'all' || r.status === status) &&
          (!q || `${r.customer} ${r.service} ${r.staff}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, status]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="input-base pl-9 w-56" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-base w-40">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No-show</option>
          </select>
          <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Specialist</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-5 py-3 whitespace-nowrap">{formatDateWithTime(r.when)}</td>
                <td className="px-5 py-3">{r.service}</td>
                <td className="px-5 py-3 font-medium">{r.customer}</td>
                <td className="px-5 py-3 text-slate-500">{r.staff}</td>
                <td className="px-5 py-3"><span className={badge[r.status]}>{r.status.replace('_', '-')}</span></td>
                <td className="px-5 py-3 text-right font-semibold">{formatCurrency(r.amount)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No bookings match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
