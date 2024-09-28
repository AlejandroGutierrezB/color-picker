import { useCallback, useEffect, useRef, useState } from 'react';

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

export const useImageInCanvasSetup = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelection = useCallback(
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
    [setImageSrc]
  );

  return { canvasRef, containerRef, image, inputRef, handleImageSelection };
};
