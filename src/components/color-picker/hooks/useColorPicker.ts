import { drawMagnifyingGlass, rgbToHex } from '@/components/color-picker/utils';
import React, { useCallback, useEffect, useState } from 'react';

type Point = { x: number; y: number };

export const useColorPicker = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  image: HTMLImageElement | null
) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const getCursorPos = useCallback(
    (e: MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top),
      };
    },
    [canvasRef]
  );

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [canvasRef, image]);

  const moveLens = useCallback(
    (e: MouseEvent) => {
      if (!isActive || !isHovering) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const { x, y } = getCursorPos(e);

      clearCanvas();
      drawMagnifyingGlass(ctx, canvas, x, y);
    },
    [isActive, isHovering, canvasRef, getCursorPos, clearCanvas]
  );

  const handleExitColorPicker = useCallback(() => {
    if (isActive) {
      setIsHovering(false);
      clearCanvas();
    }
  }, [isActive, clearCanvas]);

  const handleEnterColorPicker = useCallback(() => {
    if (isActive) {
      setIsHovering(true);
    }
  }, [isActive]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (isActive && isHovering) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { x, y } = getCursorPos(e);

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
        setSelectedColor(`#${hexColor}`);
      }
    },
    [canvasRef, isActive, isHovering, getCursorPos]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const abortController = new AbortController();
    const { signal } = abortController;

    canvas.addEventListener('mousemove', moveLens, { signal });
    canvas.addEventListener('click', handleClick, { signal });
    canvas.addEventListener('mouseleave', handleExitColorPicker, { signal });
    canvas.addEventListener('mouseenter', handleEnterColorPicker, { signal });

    return () => {
      abortController.abort();
    };
  }, [
    canvasRef,
    isActive,
    isHovering,
    getCursorPos,
    moveLens,
    setSelectedColor,
    handleExitColorPicker,
    handleEnterColorPicker,
    handleClick,
  ]);

  const toggleColorPicke = () => setIsActive((prev) => !prev);

  const scapeColorPicker = () => {
    setIsActive(false);
    handleExitColorPicker();
  };

  return {
    selectedColor,
    isActive,
    toggleColorPicke,
    scapeColorPicker,
  };
};
