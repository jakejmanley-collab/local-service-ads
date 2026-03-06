import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { businessName, trade, email } = body;

  // 1. Save to Supabase (Your existing code)
  // ...

  // 2. Automated Email Trigger
  try {
    await resend.emails.send({
      from: 'Josh | Apex Flyers <hello@yourdomain.com>',
      to: email, // The customer's email from the form
      subject: `🛠️ We’re on it! Order received for ${businessName}`,
      react: OrderConfirmationEmail({ businessName, trade }),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Email failed to send" }, { status: 500 });
  }
}
