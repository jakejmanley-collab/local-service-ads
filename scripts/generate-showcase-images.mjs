import OpenAI from "openai";
import fs from "fs";
import path from "path";
import https from "https";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const outputDir = path.join(process.cwd(), "public", "showcase");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

const images = [
  {
    filename: "hero.jpg",
    prompt: "Professional plumber in uniform working under a kitchen sink, clean modern kitchen background, bright natural lighting, photorealistic, high quality commercial photography style",
  },
  {
    filename: "drain-cleaning.jpg",
    prompt: "Professional plumber using drain cleaning equipment on a bathroom drain, wearing uniform, photorealistic commercial photography, clean and professional",
  },
  {
    filename: "water-heater.jpg",
    prompt: "Professional plumber installing a new water heater in a utility room, wearing uniform and safety gear, photorealistic commercial photography style",
  },
  {
    filename: "emergency-repair.jpg",
    prompt: "Professional plumber fixing a pipe leak under a sink, emergency repair, wearing uniform, photorealistic commercial photography, bright lighting",
  },
  {
    filename: "team.jpg",
    prompt: "Two professional plumbers in matching uniforms standing in front of a branded work van, smiling, outdoor setting, photorealistic commercial photography",
  },
];

async function generateImages() {
  for (const image of images) {
    console.log(`Generating ${image.filename}...`);
    try {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: image.prompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
      });

      const imageUrl = response.data[0].url;
      const filepath = path.join(outputDir, image.filename);
      await downloadImage(imageUrl, filepath);
      console.log(`✓ Saved ${image.filename}`);
    } catch (err) {
      console.error(`✗ Failed ${image.filename}:`, err.message);
    }
  }
  console.log("\nDone! Images saved to public/showcase/");
}

generateImages();
