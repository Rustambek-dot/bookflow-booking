CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  timezone VARCHAR(64) DEFAULT 'UTC',
  cancellation_hours INT DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'staff', -- admin | staff
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_min INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  email VARCHAR(255),
  color VARCHAR(7) DEFAULT '#0d9488',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  weekday INT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  staff_id UUID NOT NULL REFERENCES staff(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integrations_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  kind VARCHAR(50) NOT NULL, -- email | gcal | stripe
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_staff_time ON bookings(staff_id, starts_at);
CREATE INDEX idx_bookings_business ON bookings(business_id, starts_at);
CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_staff_business ON staff(business_id);
CREATE INDEX idx_customers_business ON customers(business_id);
CREATE INDEX idx_schedules_staff ON staff_schedules(staff_id);

-- Prevent double booking at DB level
CREATE UNIQUE INDEX idx_no_double_booking
  ON bookings(staff_id, starts_at)
  WHERE status IN ('pending', 'confirmed');

-- RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business members read services" ON services FOR SELECT
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
CREATE POLICY "business members write services" ON services FOR ALL
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
CREATE POLICY "business members read staff" ON staff FOR SELECT
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
CREATE POLICY "business members write staff" ON staff FOR ALL
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
CREATE POLICY "business members read customers" ON customers FOR SELECT
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
CREATE POLICY "business members write customers" ON customers FOR ALL
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
CREATE POLICY "business members read bookings" ON bookings FOR SELECT
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
CREATE POLICY "business members write bookings" ON bookings FOR ALL
  USING (business_id IN (SELECT business_id FROM users WHERE id = auth.uid()));
