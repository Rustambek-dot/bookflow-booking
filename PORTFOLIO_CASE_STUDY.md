# Case Study: BookFlow — Online Booking System

## Краткое описание
SaaS для онлайн-записи в сервисные бизнесы: публичный виджет бронирования, умный расчёт свободных слотов, предоплаты Stripe, напоминания и аналитика загрузки.

## Проблема клиента
Салон с 6 мастерами вёл запись по телефону: администратор занят половину дня, двойные брони случались еженедельно, 15% клиентов не приходили без предупреждения.

## Решение
Самозапись 24/7 через виджет, автоматический расчёт слотов из графиков мастеров, защита от двойного бронирования на уровне БД, предоплата как фильтр от no-show, автонапоминания за 24ч и 1ч.

## Целевая аудитория
Салоны, клиники, студии, репетиторы, консультанты (2–50 сотрудников).

## Моя роль
Full-stack: спецификация, архитектура, БД, slot-engine, UI, интеграции, деплой.

## Технологии
Next.js 15, React 19, TypeScript, Tailwind, Supabase (PostgreSQL + RLS), Stripe, Resend, Recharts, Zod.

## Ключевые архитектурные решения
- **Slot engine как чистая функция** (`availability.service.ts`) — рабочие часы − брони − буфер; ноль I/O, легко тестировать и переиспользовать (клиент и сервер).
- **Двойное бронирование исключено на уровне PostgreSQL** — частичный уникальный индекс по (staff_id, starts_at) для активных броней; гонки невозможны в принципе.
- **Все интеграции mock-first** — Stripe/Resend/Google Calendar за стабильными интерфейсами; проект полноценно демонстрируется без единого ключа.

## Сложные задачи
1. Расчёт слотов с учётом длительности услуги, шага сетки и прошедшего времени.
2. Race-безопасность бронирования: уникальный индекс вместо блокировок в коде.
3. Мультишаговый виджет с прогрессом и оптимистичным UX.

## Результаты (ожидаемые)
- Администратор освобождён от ~4 часов телефонной записи в день
- No-show с 15% → ~5% (предоплата + напоминания)
- Запись доступна 24/7 → +20–30% броней в нерабочие часы

## Тексты

**GitHub About:** Online booking SaaS for service businesses — smart slot engine, DB-level double-booking guard, Stripe deposits, email reminders. Next.js 15 + Supabase. Works fully in mock mode.
**Topics:** `nextjs` `typescript` `supabase` `booking` `stripe` `scheduling` `saas` `tailwindcss`

**LinkedIn:** 📅 Построил систему онлайн-бронирования BookFlow: Next.js 15 + Supabase + Stripe. Чистый slot-engine, защита от двойных броней на уровне PostgreSQL (partial unique index), предоплаты, напоминания, аналитика загрузки мастеров. Все интеграции — mock-first: проект демонстрируется без единого API-ключа.

**Upwork:** I built a production-grade booking platform (Next.js 15, Supabase, Stripe): public booking widget, automatic slot calculation from staff schedules, database-level double-booking prevention, deposits, email reminders, and utilization analytics. I can adapt it to your salon, clinic, or studio workflow.

**Резюме:** BookFlow (Next.js 15, Supabase, Stripe) — booking SaaS с чистым slot-engine, DB-level защитой от двойных броней и mock-first интеграциями.
