import os
from PIL import Image
Image.MAX_IMAGE_PIXELS = None  # Remove the decompression bomb limit

input_dir = r"C:\Users\Hossein\Pictures\New folder"
output_dir = r"C:\Users\Hossein\Pictures\New folder\Resized"

def resize_and_convert_image(input_path, output_path, target_width=2048):
    try:
        with Image.open(input_path) as img:
            # Convert CMYK to RGB if needed
            if img.mode == 'CMYK':
                img = img.convert('RGB')
            
            # Resize
            w_percent = target_width / float(img.size[0])
            target_height = int(float(img.size[1]) * w_percent)
            img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            
            # Save as PNG
            output_path = os.path.splitext(output_path)[0] + '.png'
            img.save(output_path, 'PNG', optimize=True)
            
    except Exception as e:
        print(f"Error processing {input_path}: {str(e)}")

os.makedirs(output_dir, exist_ok=True)

for filename in os.listdir(input_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.gif')):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        resize_and_convert_image(input_path, output_path)

print("Processing complete!")