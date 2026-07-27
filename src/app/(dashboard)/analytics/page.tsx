'use client'

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const revenue = [
  { month: 'Feb', revenue: 6800 }, { month: 'Mar', revenue: 7400 }, { month: 'Apr', revenue: 8100 },
  { month: 'May', revenue: 7900 }, { month: 'Jun', revenue: 9200 }, { month: 'Jul', revenue: 9800 },
]

const utilization = [
  { name: 'Alex Rivera', pct: 82 },
  { name: 'Jordan Kim', pct: 74 },
  { name: 'Sam Patel', pct: 41 },
]

const statusSplit = [
  { name: 'Completed', value: 214, color: '#10b981' },
  { name: 'Cancelled', value: 22, color: '#ef4444' },
  { name: 'No-show', value: 11, color: '#f59e0b' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (6m)', value: formatCurrency(49200) },
          { label: 'Bookings (6m)', value: '247' },
          { label: 'Avg check', value: formatCurrency(58) },
          { label: 'No-show rate', value: '4.5%' },
        ].map((k) => (
          <div key={k.label} className="card p-5">
            <div className="text-sm text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33415530" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">Booking Outcomes</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusSplit} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {statusSplit.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-4">Staff Utilization</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={utilization} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#33415530" />
            <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} unit="%" />
            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={100} />
            <Tooltip />
            <Bar dataKey="pct" fill="#f59e0b" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
