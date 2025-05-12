#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
from PIL import Image
import argparse

def process_logo(input_path, output_path=None, size=(300, 300), bg_color=(255, 255, 255, 0)):
    """
    处理logo图片，使其适合1:1的正方形显示区域
    
    参数:
        input_path: 输入图片路径
        output_path: 输出图片路径，如果为None则覆盖原图
        size: 输出图片的尺寸，默认为300x300
        bg_color: 背景颜色，默认为透明
    
    返回:
        保存后的图片路径
    """
    try:
        # 打开原始图像
        original_img = Image.open(input_path)
        
        # 确保图像有Alpha通道（透明度）
        if original_img.mode != 'RGBA':
            original_img = original_img.convert('RGBA')
        
        # 创建一个新的1:1比例的正方形图像，背景为透明
        new_img = Image.new('RGBA', size, bg_color)
        
        # 调整原始图像大小，保持比例
        original_width, original_height = original_img.size
        ratio = min(size[0] / original_width, size[1] / original_height)
        new_width = int(original_width * ratio)
        new_height = int(original_height * ratio)
        resized_img = original_img.resize((new_width, new_height), Image.LANCZOS)
        
        # 计算居中位置
        paste_x = (size[0] - new_width) // 2
        paste_y = (size[1] - new_height) // 2
        
        # 将调整大小后的图像粘贴到新图像上
        new_img.paste(resized_img, (paste_x, paste_y), resized_img)
        
        # 保存处理后的图像
        if output_path is None:
            output_path = input_path
        
        # 确保输出路径的目录存在
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # 保存为PNG以保留透明度
        new_img.save(output_path, "PNG")
        
        return output_path
    
    except Exception as e:
        print(f"处理图像时出错: {e}")
        return None

def process_directory(input_dir, output_dir=None, size=(300, 300)):
    """处理目录中的所有图像文件"""
    if not os.path.isdir(input_dir):
        print(f"错误: {input_dir} 不是一个目录")
        return
    
    if output_dir is None:
        output_dir = input_dir
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 支持的图像格式
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    
    # 遍历目录中的所有文件
    processed_count = 0
    for filename in os.listdir(input_dir):
        input_path = os.path.join(input_dir, filename)
        
        # 跳过目录和非图像文件
        if os.path.isdir(input_path):
            continue
        
        ext = os.path.splitext(filename)[1].lower()
        if ext not in image_extensions:
            continue
        
        # 构建输出路径
        output_path = os.path.join(output_dir, filename)
        if ext != '.png':
            # 将所有图像转换为PNG以保留透明度
            output_path = os.path.splitext(output_path)[0] + '.png'
        
        # 处理图像
        result = process_logo(input_path, output_path, size)
        if result:
            processed_count += 1
            print(f"已处理: {filename} -> {os.path.basename(output_path)}")
    
    print(f"总共处理了 {processed_count} 个图像文件")

def main():
    parser = argparse.ArgumentParser(description='处理Logo图像使其适合1:1比例显示')
    
    # 添加参数
    parser.add_argument('input', help='输入图像路径或目录')
    parser.add_argument('-o', '--output', help='输出图像路径或目录')
    parser.add_argument('-s', '--size', type=int, default=300, help='输出图像的尺寸 (默认: 300x300)')
    
    args = parser.parse_args()
    
    size = (args.size, args.size)
    
    if os.path.isdir(args.input):
        # 处理整个目录
        process_directory(args.input, args.output, size)
    else:
        # 处理单个文件
        result = process_logo(args.input, args.output, size)
        if result:
            print(f"图像已处理并保存至: {result}")

if __name__ == "__main__":
    main() 