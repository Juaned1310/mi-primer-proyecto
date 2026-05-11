import fal_client, os, urllib.request
from PIL import Image, ImageEnhance, ImageDraw
import numpy as np

os.environ["FAL_KEY"] = "830b04f2-1060-4a2c-8311-13d46cc32163:33a681e53606eb98555d028631b88fb9"

PHOTO_PATH  = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\imagenes-landing-maria\cta-mama-producto-original.jpg"
BOTTLE_PATH = r"C:\Users\Usuario\Downloads\serum editado 1.png"
OUT_PATH    = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\imagenes-landing-maria\cta-mama-producto.jpg"
TEMP_PHOTO  = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\cta_photo_temp.jpg"
MASK_PATH   = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\cta_mask.png"
INPAINT_PATH= r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\cta_inpainted.jpg"
BOTTLE_CLEAN= r"C:\Users\Usuario\Downloads\terminal nuevo claude code\generador-imagenes\bottle_cta.png"

# ── 1. Cargar original con brillo mínimo ──
print("Cargando foto original...")
photo = Image.open(PHOTO_PATH).convert("RGB")
photo = ImageEnhance.Brightness(photo).enhance(1.08)
photo = ImageEnhance.Contrast(photo).enhance(1.02)
PW, PH = photo.size
print(f"Foto: {PW}x{PH}")
photo.save(TEMP_PHOTO, "JPEG", quality=95)

# ── 2. Crear máscara sobre el frasco marrón ──
# El frasco marrón con tapa negra está en x:15-105, y:465-725 (imagen 768x1024)
print("Creando máscara sobre el frasco original...")
mask = Image.new("L", (PW, PH), 0)
draw = ImageDraw.Draw(mask)
draw.rectangle([12, 460, 108, 730], fill=255)
mask.save(MASK_PATH)

# ── 3. Subir foto y máscara, borrar el frasco con inpainting ──
print("Subiendo imágenes...")
photo_url = fal_client.upload_file(TEMP_PHOTO)
mask_url  = fal_client.upload_file(MASK_PATH)

print("Borrando frasco original con IA (inpainting)...")
inpaint_result = fal_client.run(
    "fal-ai/flux-pro/v1/fill",
    arguments={
        "image_url": photo_url,
        "mask_url":  mask_url,
        "prompt": (
            "woman's hand in natural relaxed pose, warm skin tones, "
            "soft bokeh indoor background, nothing in hand, no bottle, no object"
        ),
        "num_inference_steps": 28,
        "guidance_scale": 15,
    }
)

inpaint_url = inpaint_result["images"][0]["url"]
urllib.request.urlretrieve(inpaint_url, INPAINT_PATH)
photo_clean = Image.open(INPAINT_PATH).convert("RGB")
print(f"Inpainting listo: {photo_clean.size}")

# ── 4. Quitar fondo del frasco real ──
print("Removiendo fondo del frasco real...")
bottle_url = fal_client.upload_file(BOTTLE_PATH)
rembg = fal_client.run("fal-ai/imageutils/rembg", arguments={"image_url": bottle_url})
urllib.request.urlretrieve(rembg["image"]["url"], BOTTLE_CLEAN)
bottle = Image.open(BOTTLE_CLEAN).convert("RGBA")
print(f"Frasco limpio: {bottle.size}")

# ── 5. Escalar: que coincida con el tamaño del frasco marrón original ──
# El frasco marrón medía aprox 21% del alto de la imagen
PW2, PH2 = photo_clean.size
target_h = int(PH2 * 0.21)
ratio    = target_h / bottle.height
target_w = int(bottle.width * ratio)
bottle_s = bottle.resize((target_w, target_h), Image.LANCZOS)
print(f"Frasco escalado: {target_w}x{target_h}")

# ── 6. Leve rotación (el frasco original estaba casi vertical) ──
bottle_s = bottle_s.rotate(-5, expand=True, resample=Image.BICUBIC)

# ── 7. Posicionar en el centro exacto donde estaba el frasco marrón ──
# Centro del frasco marrón: x≈60px, y top ≈465px
center_x = int(PW2 * 0.082)   # ≈63px
px = max(0, center_x - bottle_s.width // 2)
py = int(PH2 * 0.455)          # ≈466px
print(f"Posición: ({px}, {py})")

# ── 8. Tinte cálido para combinar con la luz ──
b_arr = np.array(bottle_s, dtype=np.float32)
alpha = b_arr[:,:,3] / 255.0
b_arr[:,:,0] = np.clip(b_arr[:,:,0] + 10*alpha, 0, 255)
b_arr[:,:,1] = np.clip(b_arr[:,:,1] + 4*alpha,  0, 255)
b_arr[:,:,2] = np.clip(b_arr[:,:,2] - 5*alpha,  0, 255)
bottle_s = Image.fromarray(b_arr.astype(np.uint8), "RGBA")

# ── 9. Componer y guardar ──
result_img = photo_clean.convert("RGBA")
result_img.alpha_composite(bottle_s, dest=(px, py))
result_img.convert("RGB").save(OUT_PATH, "JPEG", quality=93)
print(f"Guardada: {OUT_PATH}")
subprocess.Popen(["mspaint", OUT_PATH])
