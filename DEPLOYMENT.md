# Deployment Guide — BookFlow

## Vercel + Supabase (~10 минут)

### 1. Supabase
1. Создайте проект на supabase.com
2. SQL Editor → выполните `sql/schema.sql`
3. Authentication → Users → создайте `demo@example.com` / `Demo123!`
4. Скопируйте URL, anon key, service_role key

### 2. Seed
```bash
cp .env.example .env.local   # заполните ключи
npm run db:seed
```

### 3. Vercel
1. Push на GitHub → vercel.com/new → Import
2. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Опционально: `STRIPE_SECRET_KEY`, `RESEND_API_KEY` (без них — mock mode)
4. Deploy

### 4. Подключение реального Stripe
1. dashboard.stripe.com → API keys → Secret key в `STRIPE_SECRET_KEY`
2. Webhook на `/api/stripe/webhook` (событие `checkout.session.completed`) — при расширении

### 5. Подключение Google Calendar
1. Google Cloud Console → Service Account → включите Calendar API
2. JSON-ключ в `GOOGLE_CALENDAR_CREDENTIALS`
3. Расшарьте календари сотрудников на email сервис-аккаунта

## Чеклист перед демо
- [ ] `/book` — виджет проходит все 4 шага
- [ ] Слоты рассчитываются (завтра, 9:00–18:00)
- [ ] Demo-логин открывает дашборд
- [ ] Bookings/Services/Staff/Customers отображают данные
