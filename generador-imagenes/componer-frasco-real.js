const { fal } = require("@fal-ai/client");
const sharp = require("sharp");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

fal.config({ credentials: process.env.FAL_KEY });

const REFERENCIA   = "C:/Users/Usuario/Downloads/serum imagen 1 neomente.jpeg";
const FONDO        = "./imagenes-landing-maria/producto-sobre-fondo.jpg";
const FRASCO_RECORTADO = "./imagenes-landing-maria/frasco-recortado.png";
const FRASCO_SINBG = "./imagenes-landing-maria/frasco-sinbg.png";
const OUTPUT       = "./imagenes-landing-maria/producto-final.jpg";

function descargar(url, destino) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destino);
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

async function main() {

  // ── PASO 1: Recortar solo el frasco (mitad derecha de la imagen de referencia)
  console.log("1. Recortando el frasco de la imagen de referencia...");
  const meta = await sharp(REFERENCIA).metadata();
  const mitad = Math.floor(meta.width * 0.44); // el frasco empieza ~44% desde la izquierda
  await sharp(REFERENCIA)
    .extract({ left: mitad, top: 0, width: meta.width - mitad, height: meta.height })
    .png()
    .toFile(FRASCO_RECORTADO);
  console.log(`   Recortado: ${meta.width - mitad} x ${meta.height} px`);

  // ── PASO 2: Subir el recorte a fal.ai storage
  console.log("2. Subiendo frasco a fal.ai...");
  const fileBuffer = fs.readFileSync(FRASCO_RECORTADO);
  const blob = new Blob([fileBuffer], { type: "image/png" });
  const uploadedUrl = await fal.storage.upload(blob);
  console.log("   URL subida:", uploadedUrl);

  // ── PASO 3: Remover fondo con rembg
  console.log("3. Removiendo fondo del frasco...");
  const result = await fal.subscribe("fal-ai/imageutils/rembg", {
    input: { image_url: uploadedUrl }
  });
  const urlSinBg = result.data.image.url;
  console.log("   Fondo removido OK");

  // ── PASO 4: Descargar PNG transparente
  console.log("4. Descargando frasco sin fondo...");
  await descargar(urlSinBg, FRASCO_SINBG);

  // ── PASO 5: Obtener dimensiones del fondo y del frasco
  console.log("5. Componiendo imagen final...");
  const fondoMeta  = await sharp(FONDO).metadata();
  const frascoMeta = await sharp(FRASCO_SINBG).metadata();

  const FW = fondoMeta.width;
  const FH = fondoMeta.height;

  // Escalar el frasco al 80% de la altura del fondo
  // Crecer al máximo sin salirse del canvas
  const anchoMax = Math.floor(FW * 0.75);
  const altoMax  = FH;

  const frascoResized = await sharp(FRASCO_SINBG)
    .resize(anchoMax, altoMax, { fit: "inside", background: { r:0,g:0,b:0,alpha:0 } })
    .png()
    .toBuffer();

  const frascoFinal = await sharp(frascoResized).metadata();
  const anchoEscalado = frascoFinal.width;
  const alturaObjetivo = frascoFinal.height;

  // Centrar el frasco en la imagen
  const left = Math.floor((FW - anchoEscalado) / 2);
  const top  = Math.floor((FH - alturaObjetivo) / 2);

  await sharp(FONDO)
    .composite([{ input: frascoResized, left, top }])
    .jpeg({ quality: 95 })
    .toFile(OUTPUT);

  console.log("✅ Imagen final guardada:", OUTPUT);
}

main().catch(console.error);
