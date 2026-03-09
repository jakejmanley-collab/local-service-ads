import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase Admin Client (Bypasses RLS to insert data safely from the backend)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to create clean URLs (e.g., "Bob's Plumbing!" -> "bobs-plumbing")
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, '');   // Remove leading or trailing hyphens
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, phone, industry, city, bullets, sessionId } = body;

    // 1. Verify Payment (Optional but recommended)
    // If you want to strictly enforce this, you would use the Stripe SDK here
    // to check if the sessionId belongs to a successfully paid checkout.
    if (!sessionId) {
      console.warn("No session ID provided. Proceeding anyway for now.");
    }

    // 2. Generate the unique slug
    let baseSlug = generateSlug(businessName);
    let slug = baseSlug;
    let isUnique = false;
    let counter = 1;

    // Check if slug exists in Supabase, append a number if it does
    while (!isUnique) {
      const { data } = await supabaseAdmin
        .from('verified_pros')
        .select('slug')
        .eq('slug', slug)
        .single();
      
      if (!data) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // 3. Generate the Professional Bio with OpenAI
    const prompt = `
      You are an expert copywriter for local service businesses. 
      Write a professional, convincing 2-paragraph "About Us" bio for a ${industry} business.
      
      Business Name: ${businessName}
      Location: ${city}
      Key Selling Points: ${bullets}
      
      Make it sound trustworthy, experienced, and local. Do not use generic filler. 
      Focus on converting readers into customers. Return ONLY the text for the bio.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cost-effective
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiBio = aiResponse.choices[0].message.content?.trim();

    // 4. Save to Supabase
    const { data: insertedData, error: supabaseError } = await supabaseAdmin
      .from('verified_pros')
      .insert([
        {
          slug,
          business_name: businessName,
          phone,
          industry,
          city,
          bullets,
          ai_bio: aiBio,
          // We leave hero_image_url null for now, our frontend will use a default based on the industry
        }
      ])
      .select()
      .single();

    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      throw new Error("Failed to save to database");
    }

    // 5. Send the success response and the slug back to the frontend
    return NextResponse.json({ success: true, slug: insertedData.slug });

  } catch (error) {
    console.error("Generation Error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the page." },
      { status: 500 }
    );
  }
}
