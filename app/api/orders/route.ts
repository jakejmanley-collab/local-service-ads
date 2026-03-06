import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

// Connect to your Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, email, formData } = body;

    // 1. Save to Supabase (Moved from your frontend)
    const { error: dbError } = await supabase.from('flyer_orders').insert([{
      customer_email: email || `${businessName.replace(/\s/g, '')}@customer.com`,
      stripe_session_id: `wizard_upgrade_${Date.now()}`,
      status: 'needs_generation',
      details: formData
    }]);

    if (dbError) throw dbError;

    // 2. Send the Email via Resend
    // Make sure to replace hello@yourdomain.com with your actual Porkbun email
    if (email) {
      await resend.emails.send({
        from: 'Josh | Apex Flyers <hello@yourdomain.com>',
        to: email,
        subject: `🛠️ We’re on it! Order received for ${businessName}`,
        react: OrderConfirmationEmail({ businessName }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
