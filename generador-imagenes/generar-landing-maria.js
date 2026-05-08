const { fal } = require("@fal-ai/client");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = "./imagenes-landing-maria";
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

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

async function generarTodas() {
  console.log("🚀 Generando imágenes para landing — Avatar María\n");

  // 1. HOOK — Mujer con manchas mirando espejo (dolor directo)
  // Sección: Hook 4:5
  await generarImagen(
    "hook-dolor",
    "Close up portrait of a real latina guatemalan woman age 33, dark brown morena skin, visible dark melasma patches and hyperpigmentation on forehead cheeks and upper lip, looking at bathroom mirror with sad concerned expression, natural morning window light, no makeup at all, raw authentic documentary photo, slight tired expression, real person not model, Canon 5D photography",
    "cartoon, anime, smooth perfect skin, heavy makeup, filters, beauty retouch, watermark, text, CGI, white skin, artificial lighting, smiling, happy",
    "portrait_4_3"
  );

  // 2. HOOK — Antes vs después lateral (manchas vs piel clara)
  // Sección: Hook comparativo 1:1
  await generarImagen(
    "hook-antes-despues",
    "Split portrait photo side by side, left side: latina woman 33 years old with visible dark melasma spots on cheeks and forehead, sad expression, dull skin, no makeup, harsh natural light showing imperfections clearly. Right side: same woman, clear even glowing skin, confident warm smile, healthy radiant complexion, soft golden light. Professional beauty transformation photography, authentic real result",
    "cartoon, anime, fake, CGI, heavily edited, unrealistic glow, white skin, text overlay, watermark, models",
    "square_hd"
  );

  // 3. PRODUCTO — Frasco sérum sobre mármol blanco (hero shot)
  // Sección: Zona producto
  await generarImagen(
    "producto-hero",
    "Premium skincare product photography, elegant small amber brown glass dropper serum bottle with gold metallic cap and white rubber dropper, placed on white marble surface, surrounded by fresh lemon slices, vitamin C orange half, small green botanical leaves and white tiny flowers, soft diffused natural studio lighting from left, clean minimalist luxury beauty brand aesthetic, sharp focus product, high resolution commercial photography",
    "dark background, plastic bottle, cheap looking, text overlay, watermark, cartoon, blurry, cluttered, colored bottles other than amber brown",
    "square_hd"
  );

  // 4. PROBLEMA — Mamá guatemalteca viéndose al espejo (identificación total)
  // Sección: Problema 9:16
  await generarImagen(
    "seccion-problema",
    "Emotional candid photo of guatemalan latina mother age 33, standing in modest home bathroom, looking at her reflection in mirror, touching her cheek with one hand, visible dark melasma spots on her face, wearing simple casual home clothes, natural morning daylight from small window, sad resigned expression, real authentic moment of a woman frustrated with her skin, documentary style photography, warm humble home environment",
    "happy expression, perfect skin, heavy makeup, cartoon, text, watermark, staged, luxury bathroom, white skin, CGI, filters",
    "portrait_16_9"
  );

  // 5. SOLUCIÓN — Mujer con rayo de esperanza (transición emocional)
  // Sección: Solución
  await generarImagen(
    "seccion-solucion",
    "Hopeful portrait of latina guatemalan woman age 33, sitting near window with warm golden morning light falling on her face, eyes gently closed or soft gaze upward, slight beginning of a smile, brown morena skin starting to look clearer, casual simple clothing, cozy modest home environment, emotional cinematic warm tones, a woman finding hope after struggle, authentic aspirational beauty moment",
    "dark tones, sad expression, perfect flawless skin already, heavy makeup, cartoon, text, watermark, CGI, staged luxury",
    "portrait_4_3"
  );

  // 6. PRODUCTO CON MAMÁ — CTA sosteniendo frasco (acción)
  // Sección: CTA cada 2 secciones
  await generarImagen(
    "cta-mama-producto",
    "Lifestyle photo of guatemalan latina woman age 33, brown morena skin, clear healthy glowing even complexion, holding small amber brown glass dropper serum bottle near her cheek and smiling genuinely, casual home setting with warm natural light, simple clothing, authentic happiness not model pose, looking at camera with grateful confident expression, real relatable beauty lifestyle photography",
    "cartoon, anime, watermark, text, dark background, heavy professional makeup, fake posed model, CGI, white skin, luxury setting",
    "portrait_4_3"
  );

  // 7. TESTIMONIOS — Dos mujeres guatemaltecas reales (prueba social)
  // Sección: Antes vs después / testimonios
  await generarImagen(
    "testimonios-guatemaltecas",
    "Authentic candid photo of two real guatemalan latina women, one age 33 and one age 42, both with brown morena dark skin, natural hair, simple everyday casual clothing, sitting together at a simple home table drinking coffee, both with clear healthy even skin tone, laughing and talking genuinely, warm natural indoor home lighting, no professional makeup, documentary lifestyle photography, real women not models",
    "cartoon, anime, heavy makeup, overly posed, fake smiles, watermark, text, white skin, blonde, unrealistic, CGI, beauty filters, luxury setting",
    "square_hd"
  );

  // 8. INGREDIENTES — Flat lay vitamina C y botanicals (producto natural)
  // Sección: Ingredientes
  await generarImagen(
    "ingredientes-naturales",
    "Clean minimalist flat lay product photography, small amber glass dropper serum bottle at center, surrounded by natural ingredients: sliced orange showing vitamin C, fresh turmeric root, small white flowers, green botanical leaves, aloe vera leaf cut open, all arranged beautifully on white surface, soft natural daylight from above, premium natural skincare aesthetic, high resolution sharp detail",
    "dark background, cartoon, text overlay, cluttered, cheap, artificial colors, plastic, watermark, blurry",
    "square_hd"
  );

  console.log("\n✅ ¡Todas las imágenes generadas! Carpeta: imagenes-landing-maria/");
}

generarTodas();
