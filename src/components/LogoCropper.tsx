'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface LogoCropperProps {
  src: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

const LogoCropper: React.FC<LogoCropperProps> = ({ src, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 60,
    height: 40,
    x: 20,
    y: 30,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImageLoaded(true);
    setImageInfo({ width, height, naturalWidth, naturalHeight });
    
    // 计算初始缩放比例，确保图片完整显示
    const containerWidth = 800; // 最大容器宽度
    const containerHeight = 600; // 最大容器高度
    const scaleX = containerWidth / naturalWidth;
    const scaleY = containerHeight / naturalHeight;
    const initialScale = Math.min(scaleX, scaleY, 1); // 不超过1（原始尺寸）
    
    setScale(initialScale);
    
    // 设置合理的初始裁剪区域（3:2比例，居中）
    const aspectRatio = 3 / 2; // 3:2比例
    const cropPercentage = 0.6; // 60%的宽度
    const cropWidth = cropPercentage * 100;
    const cropHeight = (cropWidth / aspectRatio); // 根据3:2比例计算高度
    const cropX = (100 - cropWidth) / 2;
    const cropY = (100 - cropHeight) / 2;
    
    const initialCrop: Crop = {
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: cropX,
      y: cropY,
    };
    
    setCrop(initialCrop);
  }, []);

  // 更新预览图
  const updatePreview = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // 预览尺寸：3:2比例
    const previewWidth = 180;
    const previewHeight = 120;
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    // 清除画布并设置白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, previewWidth, previewHeight);

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      previewWidth,
      previewHeight
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(url);
      }
    });
  }, [completedCrop, previewUrl]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // 缩放控制
  const handleScaleChange = (newScale: number) => {
    setScale(Math.max(0.1, Math.min(3, newScale)));
  };

  // 重置到适合屏幕
  const fitToScreen = () => {
    if (!imageInfo.naturalWidth || !imageInfo.naturalHeight) return;
    
    const containerWidth = 800;
    const containerHeight = 600;
    const scaleX = containerWidth / imageInfo.naturalWidth;
    const scaleY = containerHeight / imageInfo.naturalHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    setScale(newScale);
  };

  // 重置裁剪区域
  const resetCrop = () => {
    const aspectRatio = 3 / 2;
    const cropPercentage = 0.6;
    const cropWidth = cropPercentage * 100;
    const cropHeight = (cropWidth / aspectRatio);
    const cropX = (100 - cropWidth) / 2;
    const cropY = (100 - cropHeight) / 2;
    
    setCrop({
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: cropX,
      y: cropY,
    });
  };

  // 最大化裁剪区域
  const maximizeCrop = () => {
    const aspectRatio = 3 / 2;
    const maxWidth = 90; // 90%宽度
    const maxHeight = maxWidth / aspectRatio;
    const cropX = (100 - maxWidth) / 2;
    const cropY = (100 - maxHeight) / 2;
    
    setCrop({
      unit: '%',
      width: maxWidth,
      height: maxHeight,
      x: cropX,
      y: cropY,
    });
  };

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // 输出尺寸：3:2比例，更高质量
    const outputWidth = 300;
    const outputHeight = 200;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // 白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, outputWidth, outputHeight);
    
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/png', 0.95);
    });
  }, [completedCrop]);

  const handleCropComplete = async () => {
    try {
      const croppedImageBlob = await getCroppedImg();
      if (croppedImageBlob) {
        onCropComplete(croppedImageBlob);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-auto">
        <div className="p-6">
          {/* 标题 */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-2">Crop Your Logo</h3>
            <p className="text-sm text-gray-600">
              Adjust the image size and crop area to create a perfect 3:2 landscape logo
            </p>
          </div>

          <div className="flex gap-6">
            {/* 左侧：裁剪区域 */}
            <div className="flex-1">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex justify-center">
                  <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={3/2}
                      minWidth={60}
                      minHeight={40}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={src}
                        style={{ 
                          maxWidth: '800px', 
                          maxHeight: '600px',
                          objectFit: 'contain'
                        }}
                        onLoad={onImageLoad}
                        className="block shadow-lg"
                      />
                    </ReactCrop>
                  </div>
                </div>
              </div>

              {/* 缩放控制 */}
              {imageLoaded && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Zoom Control</span>
                    <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleScaleChange(scale - 0.1)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => handleScaleChange(scale + 0.1)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={fitToScreen}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300"
                    >
                      Fit to Screen
                    </button>
                    <button
                      onClick={() => setScale(1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300"
                    >
                      Original Size
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧：控制面板和预览 */}
            <div className="w-80">
              {/* 图片信息 */}
              {imageLoaded && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Image Information</h4>
                  <div className="text-sm space-y-1">
                    <div>Original: {imageInfo.naturalWidth} × {imageInfo.naturalHeight}px</div>
                    <div>Display: {Math.round(imageInfo.width * scale)} × {Math.round(imageInfo.height * scale)}px</div>
                    <div>Crop Ratio: 3:2 (Landscape)</div>
                    <div>Output Size: 300 × 200px</div>
                  </div>
                </div>
              )}

              {/* 裁剪控制 */}
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3">Crop Controls</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={resetCrop}
                    className="bg-green-200 text-green-800 px-3 py-2 rounded text-sm hover:bg-green-300"
                  >
                    Reset Crop
                  </button>
                  <button
                    onClick={maximizeCrop}
                    className="bg-green-200 text-green-800 px-3 py-2 rounded text-sm hover:bg-green-300"
                  >
                    Maximize
                  </button>
                </div>
              </div>

              {/* 预览 */}
              {completedCrop && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-3">Preview (300×200px)</h4>
                  <div className="flex justify-center">
                    <div className="border-2 border-dashed border-yellow-400 rounded bg-white p-2">
                      <canvas
                        ref={previewCanvasRef}
                        className="block"
                        style={{ width: '180px', height: '120px' }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-2">
                    This is how your logo will appear (3:2 ratio)
                  </p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={handleCropComplete}
                  disabled={!completedCrop}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                >
                  Crop & Upload
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-medium text-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCropper; 