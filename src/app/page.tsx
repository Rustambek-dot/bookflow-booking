'use client'

import Link from 'next/link'
import { CalendarCheck, Clock, CreditCard, Bell, BarChart3, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container-app flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">
              BF
            </div>
            <span className="font-bold text-lg">BookFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/book" className="text-slate-600 hover:text-primary-600 font-medium hidden sm:block">
              Book a visit
            </Link>
            <Link href="/auth/login" className="text-slate-600 hover:text-primary-600 font-medium">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 container-app text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
          Online booking for service businesses
        </span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Your calendar, <span className="text-primary-600">fully booked</span>
        </h1>
        <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto">
          Let clients book 24/7, take prepayments, and never double-book again. Built for salons,
          clinics, studios, and consultants.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/register" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Start 14-day trial
          </Link>
          <Link href="/book" className="px-8 py-3 border border-slate-200 rounded-xl font-semibold hover:border-primary-300 transition-colors">
            Try the booking widget
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-center mb-14">Everything a service business needs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CalendarCheck, title: 'Smart scheduling', text: 'Free slots are computed from staff hours automatically — no double bookings, ever.' },
              { icon: CreditCard, title: 'Prepayments', text: 'Stripe-powered deposits cut no-shows by up to 70%.' },
              { icon: Bell, title: 'Auto reminders', text: 'Email reminders 24h and 1h before each visit.' },
              { icon: Users, title: 'Staff management', text: 'Individual schedules, services, and workload per specialist.' },
              { icon: BarChart3, title: 'Revenue analytics', text: 'Utilization, revenue, and no-show rates at a glance.' },
              { icon: Clock, title: 'Google Calendar sync', text: 'Every booking lands in your staff calendars instantly.' },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary-700" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 container-app">
        <h2 className="text-3xl font-bold text-center mb-14">Simple pricing</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Solo', price: '$19', per: '/mo', features: ['1 specialist', 'Unlimited bookings', 'Email reminders'] },
            { name: 'Team', price: '$49', per: '/mo', features: ['Up to 10 staff', 'Prepayments', 'Google Calendar', 'Analytics'], highlighted: true },
            { name: 'Business', price: '$99', per: '/mo', features: ['Unlimited staff', 'Multiple locations', 'API access', 'Priority support'] },
          ].map((p) => (
            <div key={p.name} className={`card p-8 ${p.highlighted ? 'border-primary-500 ring-2 ring-primary-100' : ''}`}>
              <h3 className="font-bold text-lg mb-1">{p.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-slate-400">{p.per}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarCheck className="w-4 h-4 text-primary-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className={`block text-center ${p.highlighted ? 'btn-primary' : 'btn-secondary'}`}>
                Choose {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10 text-center text-slate-400 text-sm">
        © 2026 BookFlow. All rights reserved.
      </footer>
    </div>
  )
}
