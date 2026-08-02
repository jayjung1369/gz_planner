#!/usr/bin/env python3
import os
from PIL import Image

IMAGE_DIR = "images/places"
QUALITY = 70
MAX_DIMENSION = 1600

def compress_image(filepath):
    """Compress a JPG image for faster loading"""
    try:
        with Image.open(filepath) as img:
            original_size = os.path.getsize(filepath) / 1024 / 1024
            
            # Resize if too large
            if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
                img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
            
            # Save with reduced quality
            img.save(filepath, "JPEG", quality=QUALITY, optimize=True)
            
            new_size = os.path.getsize(filepath) / 1024 / 1024
            compression = ((original_size - new_size) / original_size * 100)
            
            print(f"✓ {os.path.basename(filepath)}: {original_size:.2f}MB → {new_size:.2f}MB (-{compression:.1f}%)")
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")

# Get all JPG files
jpg_files = [f for f in os.listdir(IMAGE_DIR) if f.lower().endswith('.jpg')]

if not jpg_files:
    print("No JPG files found!")
else:
    print(f"Compressing {len(jpg_files)} JPG images...\n")
    for filename in sorted(jpg_files):
        filepath = os.path.join(IMAGE_DIR, filename)
        compress_image(filepath)
    print("\n✓ Image compression complete!")
