import fal_client
import os, urllib.request

os.environ["FAL_KEY"] = "830b04f2-1060-4a2c-8311-13d46cc32163:33a681e53606eb98555d028631b88fb9"

ANTES_OUT   = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\landing-serum\imagenes\hook-antes.jpg"
DESPUES_OUT = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\landing-serum\imagenes\hook-despues.jpg"

# Descripción base de la mujer — IGUAL en ambas para que parezca la misma persona
MUJER_BASE = (
    "close-up portrait of a 35-year-old Guatemalan Latino woman, "
    "dark brown wavy hair, brown eyes, medium brown skin tone, "
    "natural indoor soft window light, neutral blurred background, "
    "photorealistic, cinematic, 85mm lens, shallow depth of field"
)

# ── IMAGEN ANTES ──
print("Generando imagen ANTES...")
antes = fal_client.run(
    "fal-ai/flux/dev",
    arguments={
        "prompt": (
            f"{MUJER_BASE}, "
            "BEFORE treatment: visible dark melasma spots on cheeks and forehead, "
            "uneven hyperpigmented skin, dull tired complexion, "
            "sad worried painful expression, slightly looking down, "
            "eyes showing sadness and embarrassment, no makeup, "
            "raw emotional close-up, harsh skin texture visible, "
            "moody cool slightly desaturated tone"
        ),
        "image_size": {"width": 440, "height": 580},
        "num_inference_steps": 35,
        "guidance_scale": 4.0,
        "num_images": 1,
        "seed": 42,
    }
)
url_antes = antes["images"][0]["url"]
urllib.request.urlretrieve(url_antes, ANTES_OUT)
print(f"ANTES guardada: {ANTES_OUT}")

# ── IMAGEN DESPUÉS ──
print("Generando imagen DESPUÉS...")
despues = fal_client.run(
    "fal-ai/flux/dev",
    arguments={
        "prompt": (
            f"{MUJER_BASE}, "
            "AFTER skincare treatment: clear even glowing skin, "
            "no dark spots no blemishes, luminous radiant complexion, "
            "big confident happy smile showing teeth, "
            "eyes sparkling with joy and confidence, healthy skin glow, "
            "warm golden light, vibrant joyful expression, "
            "skin looks transformed healed beautiful, warm saturated tone"
        ),
        "image_size": {"width": 440, "height": 580},
        "num_inference_steps": 35,
        "guidance_scale": 4.0,
        "num_images": 1,
        "seed": 42,
    }
)
url_despues = despues["images"][0]["url"]
urllib.request.urlretrieve(url_despues, DESPUES_OUT)
print(f"DESPUÉS guardada: {DESPUES_OUT}")

# Ver resultados
import subprocess
subprocess.Popen(["mspaint", ANTES_OUT])
subprocess.Popen(["mspaint", DESPUES_OUT])
print("Listo.")
