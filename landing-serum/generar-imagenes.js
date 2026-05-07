const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'imagenes');

function toBase64(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  const mime = ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const data = fs.readFileSync(path.join(imageDir, filename));
  return `data:${mime};base64,${data.toString('base64')}`;
}

const i1 = toBase64('ref-imagen1.webp');
const i2 = toBase64('ref-imagen2.webp');
const i3 = toBase64('ref-imagen3.jpg');
const i4 = toBase64('ref-imagen4.jpg');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Imágenes Editadas — Sérum Guatemala</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#1a1a1a; padding:36px 20px; font-family:Arial,sans-serif; }
    #msg { color:#aaa; text-align:center; font-size:14px; margin-bottom:28px; }
    .bloque { text-align:center; margin-bottom:52px; }
    .bloque h3 { color:#E8701A; font-size:14px; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px; }
    canvas { max-width:100%; display:block; margin:0 auto; border-radius:10px; box-shadow:0 8px 32px rgba(0,0,0,0.55); }
    .btn { display:inline-block; margin-top:14px; background:#E8701A; color:#fff; padding:12px 30px;
           border-radius:30px; font-weight:700; font-size:14px; cursor:pointer; border:none; font-family:Arial; }
    .btn:hover { background:#c8601a; }
  </style>
</head>
<body>
  <p id="msg">Cargando fuentes e imágenes... aguarda un momento...</p>

  <div class="bloque">
    <h3>Imagen 1 — Beneficios del producto</h3>
    <canvas id="c1"></canvas><br>
    <button class="btn" onclick="dl('c1','serum-beneficios-es.png')">⬇ Descargar Imagen 1</button>
  </div>

  <div class="bloque">
    <h3>Imagen 2 — Hook principal</h3>
    <canvas id="c2"></canvas><br>
    <button class="btn" onclick="dl('c2','serum-hook-es.png')">⬇ Descargar Imagen 2</button>
  </div>

  <div class="bloque">
    <h3>Imagen 3 — Antes y Después</h3>
    <canvas id="c3"></canvas><br>
    <button class="btn" onclick="dl('c3','serum-antesdespues-es.png')">⬇ Descargar Imagen 3</button>
  </div>

  <div class="bloque">
    <h3>Imagen 4 — Resultados y confianza</h3>
    <canvas id="c4"></canvas><br>
    <button class="btn" onclick="dl('c4','serum-resultados-es.png')">⬇ Descargar Imagen 4</button>
  </div>

<script>
const ORANGE = '#E8701A';
const DARK   = '#2E1800';
const WHITE  = '#FFFFFF';

function dl(id, name) {
  const a = document.createElement('a');
  a.download = name;
  a.href = document.getElementById(id).toDataURL('image/png');
  a.click();
}

/* ─────────────────────────────────────────────
   IMAGEN 1
   Layout: texto izquierda | frasco derecha
   Fondo texto: crema dorado #F2DAAC
   Solo titulos naranjos, sin texto negro chico
───────────────────────────────────────────── */
function procImg1(canvas, img) {
  const W = img.naturalWidth, H = img.naturalHeight;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Tapa toda la columna izquierda de texto con el color de fondo original
  ctx.fillStyle = '#F2DAAC';
  ctx.fillRect(0, 0, Math.round(W * 0.478), H);

  const fs  = Math.round(W * 0.044);
  const lh  = Math.round(fs * 1.2);
  const pad = Math.round(W * 0.038);
  const lw  = Math.round(W * 0.09);
  const lt  = Math.round(H * 0.004);

  ctx.fillStyle    = ORANGE;
  ctx.textBaseline = 'top';
  ctx.font         = '900 ' + fs + 'px Montserrat,"Arial Black",Arial';

  // BLOQUE 1
  const b1 = Math.round(H * 0.05);
  ctx.fillText('ACLARA CODOS',    pad, b1);
  ctx.fillText('Y RODILLAS',      pad, b1 + lh);
  ctx.fillRect(pad, b1 + lh*2 + Math.round(H*0.01), lw, lt);

  // BLOQUE 2
  const b2 = Math.round(H * 0.32);
  ctx.fillText('MEJORA LA PIEL',  pad, b2);
  ctx.fillText('OSCURECIDA',      pad, b2 + lh);
  ctx.fillRect(pad, b2 + lh*2 + Math.round(H*0.01), lw, lt);

  // BLOQUE 3
  const b3 = Math.round(H * 0.60);
  ctx.fillText('NUTRE Y ACLARA',  pad, b3);
  ctx.fillRect(pad, b3 + lh + Math.round(H*0.012), lw, lt);
}

/* ─────────────────────────────────────────────
   IMAGEN 2
   Layout: producto+caja izquierda | titulo derecha
   Fondo texto derecha: blanco
───────────────────────────────────────────── */
function procImg2(canvas, img) {
  const W = img.naturalWidth, H = img.naturalHeight;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Tapa columna derecha (titulo en ingles)
  ctx.fillStyle = WHITE;
  ctx.fillRect(Math.round(W * 0.43), 0, Math.round(W * 0.57), Math.round(H * 0.60));

  const fs  = Math.round(W * 0.052);
  const lh  = Math.round(fs * 1.18);
  const x   = Math.round(W * 0.46);

  ctx.fillStyle    = ORANGE;
  ctx.textBaseline = 'top';
  ctx.font         = '900 ' + fs + 'px Montserrat,"Arial Black",Arial';

  const ty = Math.round(H * 0.06);
  ctx.fillText('SÉRUM ACLARANTE',   x, ty);
  ctx.fillText('PARA NUDILLOS Y',   x, ty + lh);
  ctx.fillText('RODILLAS OSCURAS',  x, ty + lh*2);

  // Subtitulo pequeño
  const fs2 = Math.round(W * 0.022);
  ctx.font      = fs2 + 'px Montserrat,Arial';
  ctx.fillStyle = DARK;
  ctx.fillText('Aclara la melanina y mejora', x, ty + lh*3 + Math.round(H*0.03));
  ctx.fillText('las rodillas oscuras',        x, ty + lh*3 + Math.round(H*0.03) + Math.round(fs2*1.4));
}

/* ─────────────────────────────────────────────
   IMAGEN 3
   Layout: producto izquierda | comparacion derecha + titulo arriba
   Fondo: blanco
───────────────────────────────────────────── */
function procImg3(canvas, img) {
  const W = img.naturalWidth, H = img.naturalHeight;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Tapa franja superior de texto (titulo + descripcion)
  ctx.fillStyle = WHITE;
  ctx.fillRect(Math.round(W * 0.30), 0, Math.round(W * 0.70), Math.round(H * 0.40));

  const fs  = Math.round(W * 0.040);
  const lh  = Math.round(fs * 1.2);
  const x   = Math.round(W * 0.33);

  ctx.fillStyle    = ORANGE;
  ctx.textBaseline = 'top';
  ctx.font         = '900 ' + fs + 'px Montserrat,"Arial Black",Arial';

  ctx.fillText('SÉRUM PARA MANCHAS',    x, Math.round(H * 0.03));
  ctx.fillText('OSCURAS EN CODOS',      x, Math.round(H * 0.03) + lh);
  ctx.fillText('Y RODILLAS',            x, Math.round(H * 0.03) + lh*2);

  // Descripcion
  const fs2 = Math.round(W * 0.019);
  ctx.font      = fs2 + 'px Montserrat,Arial';
  ctx.fillStyle = DARK;
  const desc = ['Exfolia · Elimina la melanina · Mejora el tono opaco y amarillento',
                'Potente acción aclarante · Dejá tu piel pareja, suave y brillante'];
  desc.forEach((line, i) => {
    ctx.fillText(line, x, Math.round(H * 0.03) + lh*3 + Math.round(H*0.02) + i * Math.round(fs2*1.5));
  });

  // Etiquetas Before/After → Antes/Después
  // Tapa las originales y agrega en español
  const lblH  = Math.round(H * 0.055);
  const lblFs = Math.round(W * 0.020);

  // "Before" — posicion aprox columna izquierda de comparacion
  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(Math.round(W * 0.31), Math.round(H * 0.60), Math.round(W * 0.16), lblH);
  ctx.font      = 'bold ' + lblFs + 'px Montserrat,Arial';
  ctx.fillStyle = WHITE;
  ctx.textBaseline = 'middle';
  ctx.fillText('ANTES', Math.round(W * 0.33), Math.round(H * 0.60) + lblH/2);

  // "After" — columna derecha
  ctx.fillStyle = ORANGE;
  ctx.fillRect(Math.round(W * 0.60), Math.round(H * 0.60), Math.round(W * 0.19), lblH);
  ctx.fillStyle = WHITE;
  ctx.fillText('DESPUÉS', Math.round(W * 0.62), Math.round(H * 0.60) + lblH/2);
}

/* ─────────────────────────────────────────────
   IMAGEN 4
   Layout: frasco izquierda | grid fotos derecha + titulo arriba
   Fondo texto: crema claro
───────────────────────────────────────────── */
function procImg4(canvas, img) {
  const W = img.naturalWidth, H = img.naturalHeight;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Tapa zona de titulo y subtitulo
  ctx.fillStyle = '#F5E8D0';
  ctx.fillRect(0, 0, Math.round(W * 0.56), Math.round(H * 0.33));

  const fs  = Math.round(W * 0.043);
  const lh  = Math.round(fs * 1.2);
  const pad = Math.round(W * 0.038);

  ctx.fillStyle    = ORANGE;
  ctx.textBaseline = 'top';
  ctx.font         = '900 ' + fs + 'px Montserrat,"Arial Black",Arial';

  ctx.fillText('ACLARA SUAVE Y',      pad, Math.round(H * 0.04));
  ctx.fillText('REDUCE LA MELANINA',  pad, Math.round(H * 0.04) + lh);

  // Subtitulo
  const fs2 = Math.round(W * 0.023);
  ctx.font      = fs2 + 'px Montserrat,Arial';
  ctx.fillStyle = DARK;
  ctx.fillText('Más belleza, más confianza en vos misma', pad, Math.round(H * 0.04) + lh*2 + Math.round(H*0.016));
}

/* ─── INICIAR ─── */
async function init() {
  await document.fonts.ready;

  const data = {
    c1: '${i1}',
    c2: '${i2}',
    c3: '${i3}',
    c4: '${i4}'
  };

  const fns = { c1: procImg1, c2: procImg2, c3: procImg3, c4: procImg4 };

  for (const [id, src] of Object.entries(data)) {
    const img = new Image();
    img.onload = (function(canvasId, fn) {
      return function() { fn(document.getElementById(canvasId), this); };
    })(id, fns[id]);
    img.src = src;
  }

  document.getElementById('msg').textContent =
    '✅ Listo. Las 4 imágenes ya están editadas. Hacé clic en Descargar para guardar cada una.';
}

init();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'imagenes-editadas.html'), html);
console.log('✅ Archivo generado: imagenes-editadas.html');
console.log('   Abrilo en tu navegador para ver y descargar las 4 imágenes editadas.');
