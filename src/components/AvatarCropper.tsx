'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarCropperProps {
  src: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

const AvatarCropper: React.FC<AvatarCropperProps> = ({ src, onCropComplete, onCancel }) => {
  
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 60,
    height: 60,
    x: 20,
    y: 20,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  // Removed previewUrl state as we're using canvas directly
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImageLoaded(true);
    
    // Calculate initial scale to fit image in container
    const containerWidth = 400;
    const containerHeight = 400;
    const scaleX = containerWidth / naturalWidth;
    const scaleY = containerHeight / naturalHeight;
    const initialScale = Math.min(scaleX, scaleY, 1);
    
    setScale(initialScale);
    
    // Set reasonable initial crop area (1:1 ratio, centered)
    const cropPercentage = 0.6;
    const cropSize = cropPercentage * 100;
    const cropX = (100 - cropSize) / 2;
    const cropY = (100 - cropSize) / 2;
    
    const initialCrop: Crop = {
      unit: '%',
      width: cropSize,
      height: cropSize,
      x: cropX,
      y: cropY,
    };
    
    setCrop(initialCrop);
  }, []);

  // Update preview
  const updatePreview = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preview size: 1:1 ratio
    const previewSize = 120;
    canvas.width = previewSize;
    canvas.height = previewSize;

    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, previewSize, previewSize);

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(previewSize / 2, previewSize / 2, previewSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Draw image using the completed crop coordinates directly
    ctx.drawImage(
      imgRef.current,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      previewSize,
      previewSize
    );

    ctx.restore();
  }, [completedCrop]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output size: 1:1 ratio, high quality
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, outputSize, outputSize);
    
    // Use completed crop coordinates directly (they're already in natural image pixels)
    ctx.drawImage(
      imgRef.current,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      outputSize,
      outputSize
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
    // No need to revoke URLs since we're using canvas directly
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-2">Crop Your Avatar</h3>
            <p className="text-sm text-gray-600">
              Adjust the crop area to create a perfect square avatar
            </p>
          </div>
          
          <div className="flex gap-6">
            {/* Left side: Crop area */}
            <div className="flex-1">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex justify-center">
                  <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
                                         <ReactCrop
                       crop={crop}
                       onChange={(_, percentCrop) => {
                         setCrop(percentCrop);
                         
                         // Convert percent crop to pixel crop immediately
                         if (imgRef.current && percentCrop.width && percentCrop.height) {
                           const pixelCrop = {
                             unit: 'px' as const,
                             x: (percentCrop.x / 100) * imgRef.current.naturalWidth,
                             y: (percentCrop.y / 100) * imgRef.current.naturalHeight,
                             width: (percentCrop.width / 100) * imgRef.current.naturalWidth,
                             height: (percentCrop.height / 100) * imgRef.current.naturalHeight,
                           };
                           setCompletedCrop(pixelCrop);
                         }
                       }}
                       onComplete={() => {
                         // Don't use onComplete data, stick with our manual conversion
                         // This prevents the preview from changing when mouse is released
                       }}
                       aspect={1}
                       minWidth={60}
                       minHeight={60}
                       circularCrop
                     >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={src}
                        style={{ 
                          maxWidth: '400px', 
                          maxHeight: '400px',
                          objectFit: 'contain'
                        }}
                        onLoad={onImageLoad}
                        className="block shadow-lg"
                      />
                    </ReactCrop>
                  </div>
                </div>
              </div>

              {/* Scale control */}
              {imageLoaded && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Zoom</span>
                    <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={() => setScale(Math.min(2, scale + 0.1))}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
            
                          {/* Right side: Preview and controls */}
              <div className="w-80">
                {/* Preview */}
                {completedCrop && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-3">Preview</h4>
                    <div className="flex justify-center">
                      <div className="border-2 border-dashed border-yellow-400 rounded-full bg-white p-2">
                        <canvas
                          ref={previewCanvasRef}
                          className="block rounded-full"
                          style={{ width: '120px', height: '120px' }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-600 mt-2">
                      This is how your avatar will appear
                    </p>
                  </div>
                )}

                             {/* Action buttons */}
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

export default AvatarCropper; 