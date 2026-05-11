import fal_client
import os, urllib.request

os.environ["FAL_KEY"] = "830b04f2-1060-4a2c-8311-13d46cc32163:33a681e53606eb98555d028631b88fb9"

ANTES_OUT = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\landing-serum\imagenes\hook-antes.jpg"

print("Generando imagen ANTES con melasma del embarazo...")

result = fal_client.run(
    "fal-ai/flux/dev",
    arguments={
        "prompt": (
            "close-up portrait of a 32-year-old Guatemalan Latina woman, "
            "dark brown wavy hair, brown eyes, medium brown warm skin tone, "
            "she is postpartum new mother, tired face, "
            "VERY VISIBLE dark melasma hyperpigmentation spots on cheeks forehead and above lip, "
            "dark brown uneven blotchy patches across face classic pregnancy mask chloasma, "
            "dull uneven skin tone, visible dark spots clearly noticeable, "
            "sad worried embarrassed expression, touching her cheek with hand showing concern, "
            "no makeup to hide the spots, raw natural skin, "
            "soft window light, blurred neutral background, "
            "photorealistic, cinematic 85mm, shallow depth of field, "
            "moody slightly desaturated cool tone"
        ),
        "image_size": {"width": 440, "height": 580},
        "num_inference_steps": 40,
        "guidance_scale": 4.5,
        "num_images": 1,
        "seed": 88,
    }
)

url = result["images"][0]["url"]
urllib.request.urlretrieve(url, ANTES_OUT)
print(f"Guardada: {ANTES_OUT}")

import subprocess
subprocess.Popen(["mspaint", ANTES_OUT])
