/**
 * Payment service — Stripe with mock mode fallback (no STRIPE_SECRET_KEY needed).
 */

export interface CheckoutResult {
  url: string
  sessionId: string
  mock: boolean
}

export async function createCheckoutSession(params: {
  bookingId: string
  amount: number
  currency?: string
  successUrl: string
  cancelUrl: string
  description: string
}): Promise<CheckoutResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    // Mock mode: simulate a successful checkout redirect
    return {
      url: `${params.successUrl}?mock_payment=success&booking=${params.bookingId}`,
      sessionId: `mock_cs_${params.bookingId}`,
      mock: true,
    }
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: params.currency ?? 'usd',
          product_data: { name: params.description },
          unit_amount: Math.round(params.amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: params.bookingId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })

  return { url: session.url!, sessionId: session.id, mock: false }
}
