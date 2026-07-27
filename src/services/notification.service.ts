/**
 * Email notifications — Resend with mock mode (logs instead of sending).
 * Google Calendar sync — adapter with mock mode.
 */

export async function sendBookingEmail(params: {
  to: string
  subject: string
  html: string
}): Promise<{ sent: boolean; mock: boolean }> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[mock email] to=${params.to} subject="${params.subject}"`)
    return { sent: true, mock: true }
  }

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'BookFlow <noreply@bookflow.app>',
    to: params.to,
    subject: params.subject,
    html: params.html,
  })
  return { sent: true, mock: false }
}

export async function pushToGoogleCalendar(params: {
  staffEmail: string
  title: string
  startsAt: string
  endsAt: string
}): Promise<{ pushed: boolean; mock: boolean }> {
  if (!process.env.GOOGLE_CALENDAR_CREDENTIALS) {
    console.log(
      `[mock gcal] ${params.staffEmail}: "${params.title}" ${params.startsAt} → ${params.endsAt}`
    )
    return { pushed: true, mock: true }
  }
  // Real implementation requires a Google service account; see README "Integrations".
  // Kept behind the same interface so swapping in the real client changes nothing upstream.
  return { pushed: false, mock: false }
}

export function bookingConfirmationHtml(params: {
  customerName: string
  serviceName: string
  staffName: string
  startsAt: string
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2 style="color: #0d9488;">Booking confirmed ✓</h2>
      <p>Hi ${params.customerName},</p>
      <p>Your appointment is booked:</p>
      <ul>
        <li><b>Service:</b> ${params.serviceName}</li>
        <li><b>Specialist:</b> ${params.staffName}</li>
        <li><b>When:</b> ${new Date(params.startsAt).toLocaleString()}</li>
      </ul>
      <p>Need to reschedule? Manage your booking in your account.</p>
    </div>`
}
