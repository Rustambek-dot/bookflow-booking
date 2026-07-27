'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ServiceRow {
  id: string
  name: string
  duration_min: number
  price: number
  category: string
  active: boolean
}

const initial: ServiceRow[] = [
  { id: 's1', name: 'Haircut & Styling', duration_min: 60, price: 45, category: 'Hair', active: true },
  { id: 's2', name: 'Beard Trim', duration_min: 30, price: 25, category: 'Hair', active: true },
  { id: 's3', name: 'Full Color', duration_min: 120, price: 110, category: 'Color', active: true },
  { id: 's4', name: 'Deep Conditioning', duration_min: 45, price: 55, category: 'Care', active: false },
]

const empty = { name: '', duration_min: 60, price: 0, category: 'Hair' }

export default function ServicesPage() {
  const [services, setServices] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(empty)

  const startEdit = (s: ServiceRow) => {
    setEditing(s.id)
    setForm({ name: s.name, duration_min: s.duration_min, price: s.price, category: s.category })
    setShowForm(true)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      setServices((prev) => prev.map((s) => (s.id === editing ? { ...s, ...form } : s)))
    } else {
      setServices((prev) => [...prev, { id: crypto.randomUUID(), active: true, ...form }])
    }
    setShowForm(false)
    setEditing(null)
    setForm(empty)
  }

  const remove = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id))
  const toggle = (id: string) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="card p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="label">Name</label>
            <input className="input-base" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Duration (min)</label>
            <input className="input-base" type="number" min={5} required value={form.duration_min}
              onChange={(e) => setForm({ ...form, duration_min: +e.target.value })} />
          </div>
          <div>
            <label className="label">Price ($)</label>
            <input className="input-base" type="number" min={0} step="0.01" required value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">{editing ? 'Save' : 'Add'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className={`card p-5 ${!s.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-slate-500">{s.duration_min} min · {s.category}</div>
              </div>
              <div className="font-bold text-primary-600 dark:text-primary-400">{formatCurrency(s.price)}</div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button onClick={() => startEdit(s)} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => toggle(s.id)} className="btn-secondary text-sm py-1.5">
                {s.active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => remove(s.id)} className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
