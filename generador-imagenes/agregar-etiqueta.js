const sharp = require("sharp");
const path = require("path");

const INPUT  = "./imagenes-landing-maria/producto-frasco.jpg";
const OUTPUT = "./imagenes-landing-maria/producto-etiqueta.jpg";

// Tamaño destino
const W = 800;
const H = 1000;

// SVG de la etiqueta — estilo igual al de referencia
const svgEtiqueta = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&amp;display=swap');
    </style>
  </defs>

  <!-- ══ ETIQUETA BLANCA SOBRE EL FRASCO ══ -->
  <!-- Fondo etiqueta -->
  <rect x="160" y="380" width="480" height="420" rx="8" ry="8" fill="white" opacity="0.97"/>

  <!-- Borde superior naranja/dorado -->
  <rect x="160" y="380" width="480" height="10" rx="0" fill="#C8883A"/>

  <!-- ── TEXTO PRINCIPAL ── -->
  <!-- "SÉRUM" grande -->
  <text x="400" y="445" font-family="Arial Black, Arial, sans-serif"
        font-size="52" font-weight="900" fill="#1a1a1a"
        text-anchor="middle" letter-spacing="4">SÉRUM</text>

  <!-- Caja anaranjada con "DESPIGMENTANTE" -->
  <rect x="190" y="458" width="420" height="46" rx="5" fill="#C8883A"/>
  <text x="400" y="491" font-family="Arial Black, Arial, sans-serif"
        font-size="26" font-weight="900" fill="white"
        text-anchor="middle" letter-spacing="2">DESPIGMENTANTE</text>

  <!-- Tagline -->
  <text x="400" y="528" font-family="Arial, sans-serif"
        font-size="14" font-weight="700" fill="#333"
        text-anchor="middle" letter-spacing="1">BORRA LAS MANCHAS EN 4 SEMANAS</text>

  <!-- Línea divisoria -->
  <line x1="190" y1="545" x2="610" y2="545" stroke="#e0d0b8" stroke-width="1"/>

  <!-- Ingredientes activos — 3 columnas -->
  <text x="400" y="568" font-family="Arial, sans-serif"
        font-size="11" font-weight="700" fill="#C8883A"
        text-anchor="middle" letter-spacing="2">EXTRACTO NATURAL · CON VITAMINA C</text>

  <!-- Bloque ingrediente 1 -->
  <rect x="190" y="580" width="140" height="52" rx="4" fill="#fff8f0" stroke="#e8d0a8" stroke-width="1"/>
  <text x="260" y="598" font-family="Arial, sans-serif" font-size="10" font-weight="900"
        fill="#C8883A" text-anchor="middle">NIACINAMIDA</text>
  <text x="260" y="612" font-family="Arial, sans-serif" font-size="9" fill="#555" text-anchor="middle">Unifica el tono</text>
  <text x="260" y="625" font-family="Arial, sans-serif" font-size="9" fill="#555" text-anchor="middle">de la piel</text>

  <!-- Bloque ingrediente 2 -->
  <rect x="340" y="580" width="140" height="52" rx="4" fill="#fff8f0" stroke="#e8d0a8" stroke-width="1"/>
  <text x="410" y="598" font-family="Arial, sans-serif" font-size="10" font-weight="900"
        fill="#C8883A" text-anchor="middle">VIT. C ESTABLE</text>
  <text x="410" y="612" font-family="Arial, sans-serif" font-size="9" fill="#555" text-anchor="middle">Inhibe la</text>
  <text x="410" y="625" font-family="Arial, sans-serif" font-size="9" fill="#555" text-anchor="middle">melanina</text>

  <!-- Bloque ingrediente 3 -->
  <rect x="490" y="580" width="118" height="52" rx="4" fill="#fff8f0" stroke="#e8d0a8" stroke-width="1"/>
  <text x="549" y="598" font-family="Arial, sans-serif" font-size="10" font-weight="900"
        fill="#C8883A" text-anchor="middle">ÁCIDO KÓJICO</text>
  <text x="549" y="612" font-family="Arial, sans-serif" font-size="9" fill="#555" text-anchor="middle">Borra manchas</text>
  <text x="549" y="625" font-family="Arial, sans-serif" font-size="9" fill="#555" text-anchor="middle">de melasma</text>

  <!-- Línea divisoria 2 -->
  <line x1="190" y1="645" x2="610" y2="645" stroke="#e0d0b8" stroke-width="1"/>

  <!-- Cantidad -->
  <text x="400" y="668" font-family="Arial, sans-serif"
        font-size="13" font-weight="700" fill="#888"
        text-anchor="middle" letter-spacing="2">30ml · 1.0 fl.oz</text>

  <!-- Borde inferior dorado -->
  <rect x="160" y="790" width="480" height="10" rx="0" fill="#C8883A"/>

  <!-- ══ BADGE "EXTRACTO NATURAL" arriba izquierda ══ -->
  <rect x="30" y="330" width="120" height="24" rx="12" fill="#C8883A"/>
  <text x="90" y="347" font-family="Arial, sans-serif" font-size="11" font-weight="700"
        fill="white" text-anchor="middle">EXTRACTO NATURAL</text>

  <!-- ══ BADGE "50ml" arriba derecha ══ -->
  <rect x="650" y="330" width="90" height="24" rx="12" fill="#1a1a1a"/>
  <text x="695" y="347" font-family="Arial, sans-serif" font-size="11" font-weight="700"
        fill="white" text-anchor="middle">30 ml</text>
</svg>
`;

async function agregarEtiqueta() {
  console.log("Procesando imagen del producto...");

  // Redimensionar el frasco base
  const base = await sharp(INPUT)
    .resize(W, H, { fit: "cover", position: "center" })
    .toBuffer();

  // Componer el SVG sobre la imagen
  const resultado = await sharp(base)
    .composite([{
      input: Buffer.from(svgEtiqueta),
      top: 0,
      left: 0,
    }])
    .jpeg({ quality: 95 })
    .toFile(OUTPUT);

  console.log("✅ Imagen con etiqueta guardada:", OUTPUT);
  console.log("   Tamaño:", resultado.width, "x", resultado.height);
}

agregarEtiqueta().catch(console.error);
