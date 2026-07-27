'use client'

import { useState } from 'react'
import { Building2, Plug, ShieldAlert } from 'lucide-react'

const tabs = [
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'policy', label: 'Cancellation Policy', icon: ShieldAlert },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('business')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              tab === t.key
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'business' && (
        <div className="card p-6 max-w-xl space-y-4">
          <div>
            <label className="label">Business name</label>
            <input className="input-base" defaultValue="Style Studio" />
          </div>
          <div>
            <label className="label">Timezone</label>
            <select className="input-base">
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Bishkek</option>
            </select>
          </div>
          <button className="btn-primary">Save</button>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="space-y-4 max-w-xl">
          {[
            { name: 'Stripe', desc: 'Accept deposits and payments', status: 'Mock mode — add STRIPE_SECRET_KEY' },
            { name: 'Google Calendar', desc: 'Sync bookings to staff calendars', status: 'Mock mode — add credentials' },
            { name: 'Resend', desc: 'Email confirmations and reminders', status: 'Mock mode — add RESEND_API_KEY' },
          ].map((i) => (
            <div key={i.name} className="card p-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-slate-500">{i.desc}</div>
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">{i.status}</div>
              </div>
              <button className="btn-secondary shrink-0">Configure</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'policy' && (
        <div className="card p-6 max-w-xl space-y-4">
          <div>
            <label className="label">Free cancellation window (hours before visit)</label>
            <input className="input-base" type="number" defaultValue={24} min={0} />
          </div>
          <div>
            <label className="label">Deposit required</label>
            <select className="input-base">
              <option>No deposit</option>
              <option>Fixed $10</option>
              <option>50% of service price</option>
              <option>100% prepayment</option>
            </select>
          </div>
          <button className="btn-primary">Save Policy</button>
        </div>
      )}
    </div>
  )
}
