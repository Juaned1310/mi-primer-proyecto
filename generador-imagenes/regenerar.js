const { fal } = require("@fal-ai/client");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = "./imagenes-serum";

function descargarImagen(url, nombreArchivo) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, nombreArchivo);
    const file = fs.createWriteStream(filePath);
    const client = url.startsWith("https") ? https : http;
    client.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`✅ Guardada: ${filePath}`);
        resolve(filePath);
      });
    }).on("error", reject);
  });
}

async function generarImagen(nombre, prompt, negativePrompt = "", ratio = "portrait_4_3") {
  console.log(`\n🎨 Generando: ${nombre}...`);
  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt,
        negative_prompt: negativePrompt,
        image_size: ratio,
        num_inference_steps: 35,
        num_images: 1,
        enable_safety_checker: true,
        guidance_scale: 3.5,
      },
    });
    const imageUrl = result.data.images[0].url;
    const fileName = `${nombre}.jpg`;
    await descargarImagen(imageUrl, fileName);
  } catch (error) {
    console.error(`❌ Error en ${nombre}:`, error.message);
  }
}

async function regenerar() {
  console.log("🔄 Regenerando imágenes con correcciones...\n");

  // 1. HOOK ANTES — manchas más realistas y dramáticas
  await generarImagen(
    "hook-antes-v2",
    "Close up portrait photo of a real latina woman age 38, dark brown skin morena, severe hyperpigmentation and dark melasma patches on cheeks forehead and upper lip area, skin looks dull and uneven, no makeup whatsoever, natural harsh window light revealing all skin imperfections clearly, raw honest documentary photography, authentic real person, slight concern expression, Canon 5D photo",
    "cartoon, anime, smooth perfect skin, makeup, filter, beauty retouch, illustration, watermark, text, CGI, white skin, artificial, studio lighting"
  );

  // 2. TESTIMONIOS — dos mujeres latinas reales y naturales
  await generarImagen(
    "testimonios-v2",
    "Authentic candid photo of two real latina women, one age 35 and one age 48, both with brown morena skin, natural hair, casual everyday clothing, sitting together talking and smiling genuinely, clear healthy glowing skin, warm home indoor lighting, no professional makeup, real people not models, documentary lifestyle photography style",
    "cartoon, anime, heavy makeup, posed, fake smile, watermark, text, white skin, blonde, unrealistic, CGI, filters",
    "square_hd"
  );

  // 3. CTA — modelo latina con botella de sérum ámbar real
  await generarImagen(
    "cta-producto-v2",
    "Lifestyle photo of latina woman age 30, brown morena skin, clear glowing face, holding a small amber brown glass dropper serum bottle with gold metallic cap and white rubber dropper top, she holds it up near her face, smiling confidently, warm natural home lighting, casual white outfit, authentic beauty lifestyle photography, product clearly visible in hand",
    "cartoon, anime, watermark, text, dark background, heavy makeup, fake, CGI, green bottle, pink bottle, plastic bottle",
    "portrait_4_3"
  );

  console.log("\n✅ Regeneración completa. Revisa las imágenes nuevas en: imagenes-serum/");
}

regenerar();
