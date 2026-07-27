'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronLeft, Loader2 } from 'lucide-react'
import { computeFreeSlots } from '@/services/availability.service'
import type { StaffSchedule, TimeSlot } from '@/types'

const services = [
  { id: 's1', name: 'Haircut & Styling', duration_min: 60, price: 45, category: 'Hair' },
  { id: 's2', name: 'Beard Trim', duration_min: 30, price: 25, category: 'Hair' },
  { id: 's3', name: 'Full Color', duration_min: 120, price: 110, category: 'Color' },
  { id: 's4', name: 'Deep Conditioning', duration_min: 45, price: 55, category: 'Care' },
]

const staff = [
  { id: 'st1', name: 'Alex Rivera', specialization: 'Senior Stylist' },
  { id: 'st2', name: 'Jordan Kim', specialization: 'Color Specialist' },
]

// Mon-Sat 9:00-18:00 demo schedule for both specialists
const demoSchedule = (staffId: string): StaffSchedule[] =>
  [1, 2, 3, 4, 5, 6].map((weekday) => ({
    id: `${staffId}-${weekday}`,
    staff_id: staffId,
    weekday,
    start_time: '09:00',
    end_time: '18:00',
  }))

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState('')
  const [staffId, setStaffId] = useState('')
  const [slot, setSlot] = useState<TimeSlot | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const service = services.find((s) => s.id === serviceId)

  const slots = useMemo(() => {
    if (!service || !staffId) return []
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return computeFreeSlots({
      date: tomorrow,
      schedule: demoSchedule(staffId),
      bookings: [],
      durationMin: service.duration_min,
      staffId,
      stepMin: 30,
    }).slice(0, 12)
  }, [service, staffId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Demo mode: simulate API latency; in production this POSTs to /api/bookings
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">You&apos;re booked!</h1>
          <p className="text-slate-500 mb-6">
            {service?.name} with {staff.find((s) => s.id === staffId)?.name}
            <br />
            {slot && new Date(slot.start).toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 mb-6">A confirmation email has been sent to {form.email}.</p>
          <Link href="/" className="btn-primary inline-block">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="p-2 rounded-xl hover:bg-slate-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-bold">Book an appointment</h1>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-slate-700">Choose a service</h2>
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => { setServiceId(s.id); setStep(2) }}
                className={`card w-full p-5 text-left flex items-center justify-between hover:border-primary-400 transition-colors ${serviceId === s.id ? 'border-primary-500' : ''}`}
              >
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-slate-500">{s.duration_min} min · {s.category}</div>
                </div>
                <div className="font-bold text-primary-600">${s.price}</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-slate-700">Choose a specialist</h2>
            {staff.map((s) => (
              <button
                key={s.id}
                onClick={() => { setStaffId(s.id); setStep(3) }}
                className={`card w-full p-5 text-left hover:border-primary-400 transition-colors ${staffId === s.id ? 'border-primary-500' : ''}`}
              >
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-slate-500">{s.specialization}</div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-semibold text-slate-700 mb-3">Pick a time (tomorrow)</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s.start}
                  onClick={() => { setSlot(s); setStep(4) }}
                  className={`card py-2.5 text-sm font-medium hover:border-primary-400 transition-colors ${slot?.start === s.start ? 'border-primary-500 bg-primary-50' : ''}`}
                >
                  {new Date(s.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
            {slots.length === 0 && <p className="text-slate-500">No free slots tomorrow — pick another specialist.</p>}
          </div>
        )}

        {step === 4 && (
          <form onSubmit={submit} className="card p-6 space-y-4">
            <h2 className="font-semibold text-slate-700">Your details</h2>
            <div>
              <label className="label">Name</label>
              <input className="input-base" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input-base" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input-base" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="p-4 bg-primary-50 rounded-xl text-sm text-primary-800">
              {service?.name} · {slot && new Date(slot.start).toLocaleString()} · ${service?.price}
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm booking
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
