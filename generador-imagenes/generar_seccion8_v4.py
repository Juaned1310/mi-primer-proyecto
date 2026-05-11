import fal_client
import os, urllib.request
from PIL import Image, ImageFilter
import numpy as np

os.environ["FAL_KEY"] = "830b04f2-1060-4a2c-8311-13d46ec32163:33a681e53606eb98555d028631b88fb9"
os.environ["FAL_KEY"] = "830b04f2-1060-4a2c-8311-13d46cc32163:33a681e53606eb98555d028631b88fb9"

BOTTLE_PATH = r"C:\Users\Usuario\Downloads\serum editado 1.png"
OUT_PATH    = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\imagenes-landing-maria\ingredientes-naturales.jpg"

# ── PASO 1: Quitar fondo del frasco real con IA ──
print("Paso 1: Removiendo fondo del frasco...")
bottle_url = fal_client.upload_file(BOTTLE_PATH)
rembg = fal_client.run("fal-ai/imageutils/rembg", arguments={"image_url": bottle_url})
bottle_clean_url = rembg["image"]["url"]
bottle_clean_path = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\bottle_clean.png"
urllib.request.urlretrieve(bottle_clean_url, bottle_clean_path)
print("Frasco listo sin fondo.")

# ── PASO 2: Generar fondo con ingredientes ──
print("Paso 2: Generando fondo con ingredientes naturales...")
bg_result = fal_client.run(
    "fal-ai/flux/dev",
    arguments={
        "prompt": (
            "Top-down flat lay skincare scene NO BOTTLE, empty center space for product, "
            "orange slices touching the center area left and right, "
            "aloe vera thick leaves overlapping toward center, "
            "white jasmine flowers close to center bottom, "
            "green leaves and botanicals hugging the empty center, "
            "warm cream peach background, soft diffused light, 4K photorealistic skincare"
        ),
        "image_size": "landscape_4_3",
        "num_inference_steps": 35,
        "guidance_scale": 4.0,
        "num_images": 1,
    }
)
bg_url = bg_result["images"][0]["url"]
bg_path = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\bg_v4.jpg"
urllib.request.urlretrieve(bg_url, bg_path)
print("Fondo generado.")

# ── PASO 3: Componer con mejor blending ──
print("Paso 3: Componiendo...")
bg = Image.open(bg_path).convert("RGBA")
bottle = Image.open(bottle_clean_path).convert("RGBA")
BW, BH = bg.size

# Frasco más arriba (20% desde top) y más grande (78% altura)
target_h = int(BH * 0.78)
ratio    = target_h / bottle.height
target_w = int(bottle.width * ratio)
bottle_s = bottle.resize((target_w, target_h), Image.LANCZOS)

px = (BW - target_w) // 2
py = int(BH * 0.05)   # más arriba — 5% desde el borde superior

# Aplicar tinte cálido al frasco para que combine con el fondo dorado
b_arr = np.array(bottle_s, dtype=np.float32)
alpha = b_arr[:,:,3] / 255.0
b_arr[:,:,0] = np.clip(b_arr[:,:,0] + 15*alpha, 0, 255)  # +rojo/naranja
b_arr[:,:,1] = np.clip(b_arr[:,:,1] + 6*alpha,  0, 255)  # +verde
b_arr[:,:,2] = np.clip(b_arr[:,:,2] - 8*alpha,  0, 255)  # -azul
bottle_s = Image.fromarray(b_arr.astype(np.uint8), "RGBA")

# Sombra más realista — elipse centrada bajo el frasco con difuminado
shadow = Image.new("RGBA", (BW, BH), (0,0,0,0))
sh = np.zeros((BH, BW, 4), dtype=np.float32)
scx = px + target_w//2
scy = py + target_h + 6
srx = int(target_w * 0.42)
sry = int(BH * 0.028)
for dy in range(-sry*2, sry*2+1):
    for dx in range(-srx, srx+1):
        sx, sy = scx+dx, scy+dy
        if 0<=sx<BW and 0<=sy<BH:
            d = (dx/srx)**2 + (dy/sry)**2
            if d<=1:
                falloff = (1-d)**1.5
                sh[sy,sx] = [0,0,0, min(255, 90*falloff)]
# Blur the shadow
shadow = Image.fromarray(sh.astype(np.uint8),"RGBA").filter(ImageFilter.GaussianBlur(4))

result = bg.copy()
result.alpha_composite(shadow)
result.alpha_composite(bottle_s, dest=(px, py))

# ── Guardar composición final directamente ──
result.convert("RGB").save(OUT_PATH, "JPEG", quality=94)
print(f"Guardada: {OUT_PATH}")

import subprocess
subprocess.Popen(["mspaint", OUT_PATH])
