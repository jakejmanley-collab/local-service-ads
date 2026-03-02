import fs from 'fs';
import path from 'path';

// Get your key from fal.ai (starts with "fal_...")
const FAL_API_KEY = 'your_fal_api_key_here'; 

// Safety Limits
const COST_PER_IMAGE = 0.03; // Approximate cost for FLUX on Fal.ai
const MAX_BUDGET_DOLLARS = 5.00; 

const TRADES = [
  'Roofing',
  'Plumbing',
  'Watch Repair',
  'Landscaping'
];

const generateImage = async (prompt) => {
  const response = await fetch('https://fal.run/fal-ai/flux/dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${FAL_API_KEY}`
    },
    body: JSON.stringify({
      prompt: prompt,
      image_size: "square_hd",
      num_inference_steps: 28,
      guidance_scale: 3.5
    })
  });

  const data = await response.json();
  if (!data.images || data.images.length === 0) throw new Error(JSON.stringify(data));
  return data.images[0].url;
};

const downloadImage = async (url, filepath) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
};

const run = async () => {
  // Pre-flight Cost Check
  const totalImages = TRADES.length * 2;
  const projectedCost = totalImages * COST_PER_IMAGE;

  console.log(`Job Size: ${TRADES.length} trades (${totalImages} total images)`);
  console.log(`Projected Cost: ~$${projectedCost.toFixed(2)}`);

  if (projectedCost > MAX_BUDGET_DOLLARS) {
    console.error(`🚨 ABORTING: Projected cost ($${projectedCost.toFixed(2)}) exceeds max budget of $${MAX_BUDGET_DOLLARS}.`);
    process.exit(1);
  }

  console.log('✅ Cost approved. Starting FLUX generation...');

  const dir = path.join(process.cwd(), 'public', 'trades');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const trade of TRADES) {
    const slug = trade.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log(`Generating assets for: ${trade}...`);

    try {
      const prompt1 = `commercial photography of a close-up of hands using tools for ${trade}, bright, clean, high resolution macro detail --ar 1:1`;
      const url1 = await generateImage(prompt1);
      await downloadImage(url1, path.join(dir, `${slug}-1.jpg`));
      console.log(`  -> Saved ${slug}-1.jpg`);

      const prompt2 = `commercial photography of a professional technician performing ${trade} service, bright, professional lighting, clean environment --ar 1:1`;
      const url2 = await generateImage(prompt2);
      await downloadImage(url2, path.join(dir, `${slug}-2.jpg`));
      console.log(`  -> Saved ${slug}-2.jpg`);

    } catch (error) {
      console.error(`❌ Failed to generate for ${trade}:`, error.message);
    }
    
    // 2-second delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 All assets generated successfully!');
};

run();
