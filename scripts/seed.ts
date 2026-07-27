/**
 * Seed script — demo business, services, staff, schedules, customers, bookings.
 * Usage: npm run db:seed  (requires SUPABASE_SERVICE_ROLE_KEY)
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const db = createClient(url, key)

async function seed() {
  console.log('Seeding BookFlow...')

  const { data: business, error: bErr } = await db
    .from('businesses')
    .insert({ name: 'Style Studio', timezone: 'America/New_York', cancellation_hours: 24 })
    .select()
    .single()
  if (bErr) throw bErr

  const { error: uErr } = await db.from('users').insert({
    email: 'demo@example.com',
    full_name: 'Demo Admin',
    role: 'admin',
    business_id: business.id,
  })
  if (uErr) throw uErr

  const { data: services, error: sErr } = await db
    .from('services')
    .insert(
      [
        { name: 'Haircut & Styling', duration_min: 60, price: 45, category: 'Hair' },
        { name: 'Beard Trim', duration_min: 30, price: 25, category: 'Hair' },
        { name: 'Full Color', duration_min: 120, price: 110, category: 'Color' },
        { name: 'Deep Conditioning', duration_min: 45, price: 55, category: 'Care' },
      ].map((s) => ({ ...s, business_id: business.id }))
    )
    .select()
  if (sErr) throw sErr

  const { data: staff, error: stErr } = await db
    .from('staff')
    .insert(
      [
        { name: 'Alex Rivera', specialization: 'Senior Stylist', color: '#14b8a6' },
        { name: 'Jordan Kim', specialization: 'Color Specialist', color: '#f59e0b' },
      ].map((s) => ({ ...s, business_id: business.id }))
    )
    .select()
  if (stErr) throw stErr

  const schedules = staff.flatMap((st) =>
    [1, 2, 3, 4, 5, 6].map((weekday) => ({
      staff_id: st.id,
      weekday,
      start_time: '09:00',
      end_time: '18:00',
    }))
  )
  const { error: schErr } = await db.from('staff_schedules').insert(schedules)
  if (schErr) throw schErr

  const { data: customers, error: cErr } = await db
    .from('customers')
    .insert(
      [
        { name: 'Nina Park', email: 'nina@example.com', phone: '+1 555 0101' },
        { name: 'Maria Lopez', email: 'maria@example.com', phone: '+1 555 0102' },
        { name: 'Tom Hale', email: 'tom@example.com', phone: '+1 555 0103' },
      ].map((c) => ({ ...c, business_id: business.id }))
    )
    .select()
  if (cErr) throw cErr

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const at = (h: number, m = 0) => {
    const d = new Date(tomorrow)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }

  const { error: bkErr } = await db.from('bookings').insert([
    {
      business_id: business.id, service_id: services[0].id, staff_id: staff[0].id,
      customer_id: customers[0].id, starts_at: at(9), ends_at: at(10),
      status: 'confirmed', payment_status: 'paid', amount: 45,
    },
    {
      business_id: business.id, service_id: services[2].id, staff_id: staff[1].id,
      customer_id: customers[1].id, starts_at: at(10, 30), ends_at: at(12, 30),
      status: 'confirmed', payment_status: 'unpaid', amount: 110,
    },
    {
      business_id: business.id, service_id: services[1].id, staff_id: staff[0].id,
      customer_id: customers[2].id, starts_at: at(13), ends_at: at(13, 30),
      status: 'pending', payment_status: 'unpaid', amount: 25,
    },
  ])
  if (bkErr) throw bkErr

  console.log('Seed complete: 1 business, 4 services, 2 staff, 12 schedule rows, 3 customers, 3 bookings')
  console.log('Demo login: demo@example.com / Demo123! (create in Supabase Auth dashboard)')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
