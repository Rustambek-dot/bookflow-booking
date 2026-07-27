export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface Service {
  id: string
  business_id: string
  name: string
  description?: string
  duration_min: number
  price: number
  category: string
  active: boolean
  created_at: string
}

export interface Staff {
  id: string
  business_id: string
  name: string
  specialization: string
  email?: string
  color: string
  active: boolean
  created_at: string
}

export interface StaffSchedule {
  id: string
  staff_id: string
  weekday: number // 0 = Sunday
  start_time: string // "09:00"
  end_time: string // "18:00"
}

export interface Customer {
  id: string
  business_id: string
  name: string
  email: string
  phone?: string
  notes?: string
  created_at: string
}

export interface Booking {
  id: string
  business_id: string
  service_id: string
  staff_id: string
  customer_id: string
  starts_at: string
  ends_at: string
  status: BookingStatus
  payment_status: PaymentStatus
  amount: number
  created_at: string
}

export interface TimeSlot {
  start: string // ISO
  end: string // ISO
  staffId: string
}
