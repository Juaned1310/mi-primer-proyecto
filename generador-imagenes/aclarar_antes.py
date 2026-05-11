from PIL import Image, ImageEnhance

path = r"C:\Users\Usuario\Downloads\terminal nuevo claude code\landing-serum\imagenes\hook-antes.jpg"

img = Image.open(path)

# Aclarar brillo +25%
img = ImageEnhance.Brightness(img).enhance(1.28)
# Subir contraste levemente para que las manchas sigan viéndose
img = ImageEnhance.Contrast(img).enhance(1.05)

img.save(path, "JPEG", quality=94)
print("Imagen aclarada y guardada.")

import subprocess
subprocess.Popen(["mspaint", path])
