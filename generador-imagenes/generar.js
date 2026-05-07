const { fal } = require("@fal-ai/client");
const https = require("https");
const fs = require("fs");
const path = require("path");

// Configurar API key
fal.config({ credentials: process.env.FAL_KEY });

// Carpeta donde se guardan las imágenes
const OUTPUT_DIR = "./imagenes-serum";
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// Función para descargar imagen
function descargarImagen(url, nombreArchivo) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, nombreArchivo);
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`✅ Guardada: ${filePath}`);
        resolve(filePath);
      });
    }).on("error", reject);
  });
}

// Función principal para generar imagen
async function generarImagen(nombre, prompt, negativePrompt = "", ratio = "portrait_4_3") {
  console.log(`\n🎨 Generando: ${nombre}...`);

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: prompt,
        negative_prompt: negativePrompt,
        image_size: ratio,
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
      },
    });

    const imageUrl = result.data.images[0].url;
    const fileName = `${nombre.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    await descargarImagen(imageUrl, fileName);

  } catch (error) {
    console.error(`❌ Error en ${nombre}:`, error.message);
  }
}

// ========================
// TODAS LAS IMÁGENES DEL LANDING
// ========================
async function generarTodas() {
  console.log("🚀 Iniciando generación de imágenes para el sérum...\n");

  // 1. HOOK - Antes
  await generarImagen(
    "hook-antes",
    "Portrait of latina woman 35 years old, brown morena skin, visible dark spots and hyperpigmentation on cheeks and forehead, concerned expression, natural bathroom lighting, no makeup, authentic real person, professional portrait photography",
    "cartoon, anime, text, watermark, white skin, heavy makeup, CGI, unrealistic"
  );

  // 2. HOOK - Después
  await generarImagen(
    "hook-despues",
    "Portrait of latina woman 35 years old, brown morena skin, clear even glowing radiant skin, confident warm smile, natural dewy complexion, warm golden lighting, no heavy makeup, professional portrait photography, beautiful natural look",
    "cartoon, anime, text, watermark, dark spots, heavy makeup, CGI, unrealistic"
  );

  // 3. PRODUCTO - Hero shot
  await generarImagen(
    "producto-hero",
    "Luxury skincare product photography, elegant glass dropper serum bottle with golden amber liquid, white marble background, fresh lemon slice and green botanical leaves, soft natural studio lighting, premium beauty brand aesthetic, high detail sharp image",
    "cartoon, text overlay, dark background, plastic bottle, cheap looking, blurry",
    "square_hd"
  );

  // 4. PROBLEMA - Imagen dolor
  await generarImagen(
    "seccion-problema",
    "Intimate portrait of latina woman 30-40 years old, looking at bathroom mirror, touching her cheek with concern, visible skin imperfections, natural morning light, no makeup, authentic emotional expression, cinematic soft focus background, real relatable moment",
    "happy expression, perfect skin, heavy makeup, cartoon, text, watermark, staged"
  );

  // 5. SOLUCIÓN - Esperanza
  await generarImagen(
    "seccion-solucion",
    "Hopeful portrait of latina woman in her 30s, gentle beginning smile, touching her face softly, warm golden sunrise light through window, calm peaceful expression, brown morena skin, natural hair, cozy home environment, cinematic warm tones, aspirational beauty",
    "dark tones, sad expression, perfect skin already, heavy makeup, cartoon, text"
  );

  // 6. PRODUCTO - Con ingredientes
  await generarImagen(
    "producto-ingredientes",
    "Premium skincare flat lay, glass serum dropper bottle center, surrounded by vitamin C orange slices, fresh botanical leaves, small white flowers, clean white background, soft daylight, professional product photography, high resolution",
    "dark background, cartoon, text, cluttered, cheap, artificial",
    "square_hd"
  );

  // 7. CTA - Mujer con producto
  await generarImagen(
    "cta-mujer-producto",
    "Latina woman in her 30s holding small glass serum bottle, happy confident expression, clear glowing brown skin, casual home setting, warm natural light, lifestyle product photography, authentic relatable mood, looking at camera soft smile",
    "cartoon, text, dark background, staged, heavy makeup, watermark"
  );

  // 8. TESTIMONIOS - Grupo mujeres
  await generarImagen(
    "testimonios-mujeres",
    "Candid lifestyle photo of two latina women different ages 30-45, laughing together, both with clear healthy glowing skin, casual clothing, warm natural light, authentic friendship moment, real and relatable, brown morena skin tones",
    "cartoon, text, watermark, posed, fake, heavy makeup, dark tones",
    "square_hd"
  );

  console.log("\n✅ ¡Todas las imágenes generadas! Revisa la carpeta: imagenes-serum");
}

generarTodas();
