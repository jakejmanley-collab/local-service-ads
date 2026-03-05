import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// --- DYNAMIC COLOR EXPANSION ENGINE ---
const COLOR_VARIATIONS: Record<string, string[]> = {
  'blue': [
    'Navy Blue, Crisp White, and Charcoal Grey',
    'Bright Electric Blue, Light Steel Grey, and Pure White',
    'Ocean Blue, Midnight Blue, and Silver'
  ],
  'red': [
    'Crimson Red, Crisp White, and Matte Black',
    'Bright Action Red, Light Grey, and Pure White',
    'Deep Dark Red, Brushed Silver, and Charcoal'
  ],
  'green': [
    'Forest Green, Pure White, and Slate Grey',
    'Vibrant Leaf Green, Soft Grey, and Charcoal',
    'Deep Emerald, Mint Green accents, and Crisp White'
  ],
  'gold': [
    'Premium Gold, Deep Navy Blue, and Crisp White',
    'Bright Yellow, Matte Black, and Concrete Grey',
    'Metallic Gold, Ivory, and Charcoal'
  ],
  'orange': [
    'Flame Orange, Deep Navy, and Pure White',
    'Vibrant Orange, Slate Grey, and Crisp White',
    'Burnt Orange, Warm Sand, and Espresso Black'
  ],
  'purple': [
    'Deep Royal Purple, Crisp White, and Silver',
    'Vibrant Violet, Matte Black, and Light Grey',
    'Plum, Champagne Gold, and White'
  ],
  'teal': [
    'Ocean Teal, Sky Blue, and Soft Silver',
    'Dark Aqua, Pure White, and Charcoal Grey',
    'Vibrant Turquoise, Navy Blue, and Crisp White'
  ],
  'black': [
    'Matte Black, Brushed Silver, and Crisp White',
    'Charcoal Grey, Pure White, and Chrome',
    'Deep Black, Ivory, and Subtle Gold Accents'
  ]
};

const STYLE_MAP: Record<string, string> = {
  'style-1': 'A sophisticated layout with sleek, modern sans-serif typography. Clean grid.',
  'style-2': 'A dynamic and active layout featuring high contrast, and a large diagonal hero image.',
  'style-3': 'A luxury editorial magazine layout with lots of negative space, elegant typography, and geometric blocking.',
  'style-4': 'A professional corporate layout utilizing dynamic diagonal color blocks and structured checkmark lists.',
  'style-5': 'A highly structured graphic design featuring overlapping circular photo frames and bright sweeping accent shapes.',
  'style-6': 'A clean B2B minimalist grid using solid colored rectangular blocks and highly legible sans-serif typography.',
  'style-7': 'A modern high-end layout featuring a faded background image and three distinct, colorful rounded columns at the bottom.',
  'style-8': 'An ultra-modern layout featuring sharp diamond and chevron shapes masking the professional photography.'
};

const getPrompts = (details: any) => {
  const { businessName, trade, field, phone, websiteUrl, selectedStyles = [], selectedColors = [], features = [], service1, service2 } = details;
  
  const name = businessName || 'Premium Service';
  const industry = trade || field || 'Service';
  const contact = phone || websiteUrl || '555-555-5555';
  const specialty1 = service1 || 'Quality Service';
  const specialty2 = service2 || 'Professional Support';

  // Map choices (with safe fallbacks if empty)
  const style1 = STYLE_MAP[selectedStyles[0]] || STYLE_MAP['style-4'];
  const style2 = STYLE_MAP[selectedStyles[1]] || STYLE_MAP['style-5'];
  
  // Extract the user's two base colors (fallback to blue and black)
  const baseColor1 = selectedColors[0] || 'blue';
  const baseColor2 = selectedColors[1] || 'black';

  // Pull expanded professional palettes based on their base color choice
  const color1_VarA = COLOR_VARIATIONS[baseColor1]?.[0] || 'Navy, White, and Grey';
  const color1_VarB = COLOR_VARIATIONS[baseColor1]?.[1] || 'Bright Blue, Silver, and White';
  const color2_VarA = COLOR_VARIATIONS[baseColor2]?.[0] || 'Black, Silver, and White';
  const color2_VarB = COLOR_VARIATIONS[baseColor2]?.[1] || 'Charcoal, Chrome, and White';

  const badgesText = features && features.length > 0 ? `Include stylized graphic badges/icons that communicate: ${features.join(', ')}.` : '';

  return [
    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style1} The color palette uses exactly ${color1_VarA}. The flyer includes perfectly spelled typography reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner clearly reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style2} The color palette uses exactly ${color1_VarB}. The flyer includes perfectly spelled typography reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner clearly reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style1} The color palette uses exactly ${color2_VarA}. The flyer includes perfectly spelled typography reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner clearly reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. ${style2} The color palette uses exactly ${color2_VarB}. The flyer includes perfectly spelled typography reading "${name}", "${specialty1}", and "${specialty2}". At the bottom, a bold banner clearly reads "${contact}". ${badgesText} Vector graphic design, agency quality.`,

    `A high-end graphic design business flyer for "${name}", a ${industry} company. A clean, premium layout with professional photography. The color palette uses exactly ${color1_VarA} with accent touches of ${baseColor2}. The flyer includes perfect typography reading "${name}". At the bottom, a bold banner reads "${contact}". ${badgesText} Vector graphic design, agency quality.`
  ];
};

export async function POST(req: Request) {
  let currentOrderId: string | null = null;

  try {
    const body = await req.json();
    const { orderId, details } = body;
    currentOrderId = orderId;

    if (!orderId || !details) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const adminSupabase = getServiceSupabase();
    await adminSupabase.from('flyer_orders').update({ status: 'processing' }).eq('id', orderId);

    const prompts = getPrompts(details);
    const imageUrls = [];

    console.log(`Starting Ideogram generation for wizard order: ${orderId}`);

    for (let i = 0; i < prompts.length; i++) {
      console.log(`Generating Ideogram Image ${i + 1}...`);
      
      const res = await fetch('https://api.ideogram.ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Api-Key': process.env.IDEOGRAM_API_KEY || ''
        },
        body: JSON.stringify({ 
          image_request: {
            prompt: prompts[i],
            aspect_ratio: "ASPECT_RATIO_4_5", 
            model: "V_2", 
            magic_prompt_option: "AUTO" 
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Ideogram failed on image ${i + 1}: ${errText}`);
      }

      const data = await res.json();
      const ideogramUrl = data.data[0].url;

      // Download from Ideogram and upload to your Supabase Storage
      const imgRes = await fetch(ideogramUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const fileName = `premium/${orderId}-img-${i + 1}-${Date.now()}.jpg`;
      
      await adminSupabase.storage
        .from('trades')
        .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });
      
      const publicUrl = adminSupabase.storage.from('trades').getPublicUrl(fileName).data.publicUrl;
      imageUrls.push(publicUrl);
    }

    await adminSupabase.from('flyer_orders').update({
      status: 'delivered',
      image_1: imageUrls[0], image_2: imageUrls[1], image_3: imageUrls[2],
      image_4: imageUrls[3], image_5: imageUrls[4],
    }).eq('id', orderId);

    return NextResponse.json({ success: true, imageUrls });

  } catch (error: any) {
    console.error("Generation Error:", error.message);
    
    if (currentOrderId) {
      const adminSupabase = getServiceSupabase();
      await adminSupabase.from('flyer_orders').update({ status: 'needs_generation' }).eq('id', currentOrderId);
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
