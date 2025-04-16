import os
from PIL import Image

# مسیر ورودی
input_dir = r"C:\Users\Hossein\Documents\GitHub\NexoNest\img\Events\Bootcamp\ABMs-IUST-2024\Projects"

output_dir = r"C:\Users\Hossein\Documents\GitHub\NexoNest\img\Events\Bootcamp\ABMs-IUST-2024\Projects_Slides"

def resize_image(input_path, output_path, target_width=1024):
    with Image.open(input_path) as img:
        w_percent = target_width / float(img.size[0])
        target_height = int(float(img.size[1]) * w_percent)
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        img.save(output_path)

for root, dirs, files in os.walk(input_dir):
    for file in files:
        if file.lower().endswith(".png"):
            input_path = os.path.join(root, file)
            relative_path = os.path.relpath(root, input_dir)
            output_folder = os.path.join(output_dir, relative_path)
            os.makedirs(output_folder, exist_ok=True)
            output_path = os.path.join(output_folder, file)
            resize_image(input_path, output_path)

print("All Done!")
