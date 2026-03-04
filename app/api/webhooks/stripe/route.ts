import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServiceSupabase } from '@/lib/supabase';

// Initialize Stripe (we will add the key to Vercel later)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// Stripe requires the raw body to verify the webhook signature
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!webhookSecret) throw new Error('Missing Stripe Webhook Secret');
    // Verify this message actually came from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the successful checkout event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Grab the customer's email from the checkout session
    const customerEmail = session.customer_details?.email;
    const sessionId = session.id;

    if (customerEmail) {
      const adminSupabase = getServiceSupabase();
      
      // Save the order to Supabase!
      const { error } = await adminSupabase
        .from('flyer_orders')
        .insert([
          {
            customer_email: customerEmail,
            stripe_session_id: sessionId,
            status: 'needs_generation' // Triggers the next step in our workflow
          }
        ]);

      if (error) {
        console.error('Error inserting order to Supabase:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      
      console.log(`Successfully recorded order for: ${customerEmail}`);
    }
  }

  // Tell Stripe "We got the message, thanks!"
  return NextResponse.json({ received: true });
}
