#!/usr/bin/env python3
"""
이미지 자동 압축 스크립트
새 이미지를 추가하고 커밋하기 전에 이 스크립트를 실행하세요.

사용법:
  python optimize_images.py                 # images/places의 모든 JPG 압축
  python optimize_images.py --staged        # git staging area의 이미지만 압축
  python optimize_images.py images/subfolder  # 특정 폴더의 이미지 압축
"""

import os
import sys
import subprocess
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("❌ Pillow 라이브러리가 설치되지 않았습니다.")
    print("   실행: pip install Pillow")
    sys.exit(1)

QUALITY = 50  # 품질 (낮을수록 파일 작음, 50-65권장)
MAX_DIMENSION = 1200  # 최대 이미지 크기


def compress_image(filepath, quality=QUALITY, max_dim=MAX_DIMENSION):
    """단일 이미지 압축 (Progressive JPEG 지원)"""
    try:
        # 파일 크기 확인
        original_size = os.path.getsize(filepath) / 1024 / 1024
        
        # 100KB 이하면 압축 불필요
        if original_size < 0.1:
            return None
        
        with Image.open(filepath) as img:
            # 너무 큰 이미지 리사이즈
            if img.width > max_dim or img.height > max_dim:
                img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            
            # RGBA → RGB 변환
            if img.mode in ('RGBA', 'LA', 'P'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'RGBA':
                    rgb_img.paste(img, mask=img.split()[-1])
                else:
                    rgb_img.paste(img)
                img = rgb_img
            
            # Progressive JPEG으로 저장 (더 빠른 렌더링)
            img.save(filepath, "JPEG", quality=quality, optimize=True, progressive=True)
        
        new_size = os.path.getsize(filepath) / 1024 / 1024
        reduction = ((original_size - new_size) / original_size * 100)
        
        return {
            'original': original_size,
            'new': new_size,
            'reduction': reduction
        }
    
    except Exception as e:
        print(f"  ❌ 오류: {os.path.basename(filepath)} - {e}")
        return None


def optimize_directory(directory):
    """디렉토리의 모든 JPG 이미지 압축"""
    if not os.path.isdir(directory):
        print(f"❌ 디렉토리 없음: {directory}")
        return 0
    
    jpg_files = list(Path(directory).glob("*.jpg"))
    
    if not jpg_files:
        print(f"ℹ️  JPG 파일 없음: {directory}")
        return 0
    
    print(f"\n🖼️  {len(jpg_files)}개 이미지 압축 중...\n")
    
    total_saved = 0
    compressed_count = 0
    
    for jpg_file in sorted(jpg_files):
        result = compress_image(str(jpg_file))
        if result:
            print(f"  ✓ {jpg_file.name}")
            print(f"    {result['original']:.2f}MB → {result['new']:.2f}MB (-{result['reduction']:.0f}%)")
            total_saved += result['original'] - result['new']
            compressed_count += 1
    
    if compressed_count > 0:
        print(f"\n✅ {compressed_count}개 이미지 압축 완료")
        print(f"   총 절감: {total_saved:.2f}MB")
        return compressed_count
    
    return 0


def optimize_staged():
    """Git staging area의 이미지만 압축"""
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            capture_output=True,
            text=True,
            check=False
        )
        staged_files = result.stdout.strip().split('\n')
    except Exception as e:
        print(f"❌ Git 명령 실행 실패: {e}")
        return 0
    
    jpg_files = [f for f in staged_files if f.lower().endswith('.jpg') and os.path.exists(f)]
    
    if not jpg_files:
        print("ℹ️  Staged JPG 파일 없음")
        return 0
    
    print(f"\n🖼️  {len(jpg_files)}개 staged 이미지 압축 중...\n")
    
    compressed_count = 0
    for jpg_file in sorted(jpg_files):
        result = compress_image(jpg_file)
        if result:
            print(f"  ✓ {os.path.basename(jpg_file)}")
            print(f"    {result['original']:.2f}MB → {result['new']:.2f}MB (-{result['reduction']:.0f}%)")
            compressed_count += 1
            
            # Re-stage 압축된 파일
            try:
                subprocess.run(['git', 'add', jpg_file], check=False)
            except:
                pass
    
    if compressed_count > 0:
        print(f"\n✅ {compressed_count}개 이미지 압축 및 re-stage 완료")
        return compressed_count
    
    return 0


if __name__ == "__main__":
    if "--staged" in sys.argv:
        # Staged 파일만 압축
        optimize_staged()
    elif len(sys.argv) > 1 and not sys.argv[1].startswith("--"):
        # 특정 디렉토리 압축
        optimize_directory(sys.argv[1])
    else:
        # 기본: images/places 디렉토리 압축
        optimize_directory("images/places")
