from PIL import Image
import numpy as np

# ── Cargar imágenes ──
bg = Image.open(r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\imagenes-landing-maria\seccion-solucion.jpg").convert("RGBA")
bottle_raw = Image.open(r"C:\Users\Usuario\Downloads\sewrum imagen nueva 2.jpg").convert("RGBA")

bg_w, bg_h = bg.size
print(f"Fondo: {bg_w}x{bg_h}")
print(f"Frasco original: {bottle_raw.size}")

# ── Eliminar fondo blanco del frasco con flood fill desde bordes ──
arr = np.array(bottle_raw, dtype=np.uint8)
h, w = arr.shape[:2]

visited = np.zeros((h, w), dtype=bool)
to_visit = []

# Semillas desde los 4 bordes
for x in range(w):
    to_visit += [(0, x), (h-1, x)]
for y in range(h):
    to_visit += [(y, 0), (y, w-1)]

# Umbral DOBLE:
# - zona superior (top 22%): solo elimina blanco PURO 255 → protege el gotero que es gris/crema ~235-245
# - resto: elimina cualquier blanco >= 218
SAFE_TOP = int(h * 0.22)
THRESHOLD_TOP = 253   # muy estricto: solo blanco 100% puro
THRESHOLD_REST = 218  # normal para el cuerpo

while to_visit:
    y, x = to_visit.pop()
    if y < 0 or y >= h or x < 0 or x >= w:
        continue
    if visited[y, x]:
        continue
    r, g, b, a = arr[y, x]
    thr = THRESHOLD_TOP if y < SAFE_TOP else THRESHOLD_REST
    if r >= thr and g >= thr and b >= thr:
        visited[y, x] = True
        arr[y, x, 3] = 0
        to_visit += [(y+1,x),(y-1,x),(y,x+1),(y,x-1)]

bottle_clean = Image.fromarray(arr, "RGBA")

# Recortar al bounding box del alpha
bbox = bottle_clean.getbbox()
if bbox:
    bottle_clean = bottle_clean.crop(bbox)

print(f"Frasco recortado: {bottle_clean.size}")

# ── Escalar frasco: 40% de la altura del fondo (tamaño original sin cambiar) ──
target_h = int(bg_h * 0.40)
ratio = target_h / bottle_clean.height
target_w = int(bottle_clean.width * ratio)
bottle_scaled = bottle_clean.resize((target_w, target_h), Image.LANCZOS)
print(f"Frasco escalado: {bottle_scaled.size}")

# ── Posición: derecha, más abajo para que se vea completo ──
px = bg_w - target_w - 8
py = int(bg_h * 0.30)  # 30% desde arriba → frasco bien visible, no cortado arriba

print(f"Posición: ({px}, {py})")
print(f"Frasco ocupa hasta y={py + target_h} de {bg_h}")

# ── Iluminación natural: tinte cálido + sombra lateral + fade de bordes ──
bottle_arr = np.array(bottle_scaled, dtype=np.float32)
bh, bw = bottle_arr.shape[0], bottle_arr.shape[1]
alpha_mask = bottle_arr[:, :, 3] / 255.0

# 1) Tinte cálido general (luz dorada de la ventana)
bottle_arr[:, :, 0] = np.clip(bottle_arr[:, :, 0] + 12 * alpha_mask, 0, 255)
bottle_arr[:, :, 1] = np.clip(bottle_arr[:, :, 1] + 5 * alpha_mask, 0, 255)
bottle_arr[:, :, 2] = np.clip(bottle_arr[:, :, 2] - 6 * alpha_mask, 0, 255)

# 2) Sombra lateral izquierda (la luz viene de la derecha/ventana)
#    El lado izquierdo del frasco debe estar más oscuro
for x in range(bw):
    shadow_strength = max(0.0, 1.0 - (x / (bw * 0.55)))  # 0=sin sombra, 1=sombra máxima en borde izq
    shadow_amount = shadow_strength * 0.35  # hasta 35% más oscuro
    for ch in range(3):
        bottle_arr[:, x, ch] = np.clip(bottle_arr[:, x, ch] * (1 - shadow_amount), 0, 255)

# 3) Fade suave solo en borde superior e inferior (no en lados para no cortar el frasco)
fade_px = 22
for y in range(bh):
    for x in range(bw):
        d_top = y
        d_bot = bh - 1 - y
        d = min(d_top, d_bot)   # solo fade vertical, NO horizontal
        if d < fade_px:
            factor = d / fade_px
            bottle_arr[y, x, 3] = bottle_arr[y, x, 3] * factor

bottle_scaled = Image.fromarray(bottle_arr.astype(np.uint8), "RGBA")

# ── Sombra suave detrás del frasco (lado izquierdo del frasco) ──
shadow_img = Image.new("RGBA", bg.size, (0, 0, 0, 0))
shadow_arr = np.array(shadow_img)

cx = px + target_w // 2
cy = py + target_h
sw = int(target_w * 0.55)
sh = int(target_h * 0.03)
for dy in range(-sh, sh + 1):
    for dx in range(-sw, sw + 1):
        sx = cx + dx
        sy = cy + dy
        if 0 <= sx < bg_w and 0 <= sy < bg_h:
            dist = (dx / sw) ** 2 + (dy / sh) ** 2
            if dist <= 1:
                alpha_val = int(55 * (1 - dist))
                cur = shadow_arr[sy, sx, 3]
                shadow_arr[sy, sx] = [0, 0, 0, max(cur, alpha_val)]

shadow_img = Image.fromarray(shadow_arr, "RGBA")

# ── Componer: fondo + sombra + frasco ──
result = bg.copy()
result.alpha_composite(shadow_img)
result.alpha_composite(bottle_scaled, dest=(px, py))

# Guardar como JPEG
result_rgb = result.convert("RGB")
out_path = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\imagenes-landing-maria\seccion7-nueva.jpg"
result_rgb.save(out_path, "JPEG", quality=92)
print(f"Guardado: {out_path}")

# Abrir para preview
import subprocess
subprocess.Popen(["mspaint", out_path])
print("Abriendo en Paint...")
