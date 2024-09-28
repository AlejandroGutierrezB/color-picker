import { Input } from '@/components/ui/input';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const useImageLoad = (imageSrc: string | null) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setImage(img);
    return () => {
      img.onload = null;
    };
  }, [imageSrc]);

  return image;
};

const useCanvasSetup = (imageSrc: string | null) => {
  const image = useImageLoad(imageSrc);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeImage = () => {
      const containerRect = container.getBoundingClientRect();
      const { width: containerWidth, height: containerHeight } = containerRect;

      const imageAspectRatio = image.width / image.height;
      const containerAspectRatio = containerWidth / containerHeight;

      let renderWidth, renderHeight;
      if (imageAspectRatio > containerAspectRatio) {
        renderWidth = containerWidth;
        renderHeight = containerWidth / imageAspectRatio;
      } else {
        renderHeight = containerHeight;
        renderWidth = containerHeight * imageAspectRatio;
      }

      canvas.width = renderWidth;
      canvas.height = renderHeight;

      ctx.drawImage(image, 0, 0, renderWidth, renderHeight);
    };

    resizeImage();

    const resizeObserver = new ResizeObserver(resizeImage);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [image]);

  return { canvasRef, containerRef };
};

const ColorPicker: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { canvasRef, containerRef } = useCanvasSetup(imageSrc);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setImageSrc(e.target?.result as string);
        };
        reader.onerror = (e) => {
          console.error('Error reading file:', e);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <div className="w-full h-full bg-red flex flex-col justify-start gap-6">
      <div className="flex flex-row justify-between items-center flex-wrap">
        <Input
          type="file"
          accept="image/*"
          multiple={false}
          onChange={handleImageUpload}
          className="w-min max-w-64"
          ref={inputRef}
        />
      </div>
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto flex justify-center items-start"
      >
        {imageSrc ? (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-100 dark:bg-gray-600 rounded-lg">
            <p
              className="text-gray-500 dark:text-gray-200 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              Upload an image to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
