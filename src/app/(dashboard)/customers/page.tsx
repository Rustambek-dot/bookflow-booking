'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'

const customers = [
  { id: 'c1', name: 'Nina Park', email: 'nina@example.com', phone: '+1 555 0101', visits: 8, lastVisit: '2026-07-20', spent: 420 },
  { id: 'c2', name: 'Maria Lopez', email: 'maria@example.com', phone: '+1 555 0102', visits: 12, lastVisit: '2026-07-22', spent: 1180 },
  { id: 'c3', name: 'Tom Hale', email: 'tom@example.com', phone: '+1 555 0103', visits: 3, lastVisit: '2026-07-10', spent: 95 },
  { id: 'c4', name: 'Amy Chen', email: 'amy@example.com', phone: '+1 555 0104', visits: 6, lastVisit: '2026-07-26', spent: 340 },
  { id: 'c5', name: 'Ben Ortiz', email: 'ben@example.com', phone: '+1 555 0105', visits: 1, lastVisit: '2026-06-15', spent: 45 },
]

export default function CustomersPage() {
  const [q, setQ] = useState('')

  const filtered = useMemo(
    () => customers.filter((c) => !q || `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase())),
    [q]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers..." className="input-base pl-9 w-64" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium text-right">Visits</th>
              <th className="px-5 py-3 font-medium">Last visit</th>
              <th className="px-5 py-3 font-medium text-right">Total spent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const [first, last] = c.name.split(' ')
              return (
                <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold">
                        {getInitials(first, last ?? '')}
                      </div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{c.phone}</td>
                  <td className="px-5 py-3 text-right">{c.visits}</td>
                  <td className="px-5 py-3">{formatDate(c.lastVisit)}</td>
                  <td className="px-5 py-3 text-right font-semibold">${c.spent}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
