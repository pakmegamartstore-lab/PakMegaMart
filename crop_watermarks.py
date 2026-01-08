from PIL import Image
import os

# Define the folders and files to process
folders = [
    'public/Genuine Leather Bifold Wallet',
    'public/Pebbled Leather Long Wallet',
    'public/Vintage Leather Bifold Wallet'
]

# Process each image
for folder in folders:
    if os.path.exists(folder):
        for file in os.listdir(folder):
            if file.endswith('.jpg'):
                file_path = os.path.join(folder, file)
                img = Image.open(file_path)
                width, height = img.size
                print(f"Processing: {file} - Size: {width}x{height}")
                
                # Crop 8% from the bottom (where watermarks typically are)
                crop_height = int(height * 0.08)
                cropped_img = img.crop((0, 0, width, height - crop_height))
                
                # Save the cropped image
                cropped_img.save(file_path)
                print(f"  Cropped and saved!")

print("\nAll images processed!")
