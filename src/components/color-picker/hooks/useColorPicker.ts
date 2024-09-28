import React, { useCallback, useEffect, useState } from 'react';

type Point = { x: number; y: number };

const LENSE_SIZE = 125;
const ZOOM_LEVEL = 10;
const TAG_PADDING_X = 20;
const TAG_PADDING_Y = 10;
const TAG_MARGIN_Y = 27.5;

const rgbToHex = (r: number, g: number, b: number): string =>
  ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

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

  const drawMagnifyingGlass = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, LENSE_SIZE / 2, 0, 2 * Math.PI);
      ctx.clip();

      const sourceX = Math.max(
        0,
        Math.floor(x - LENSE_SIZE / (2 * ZOOM_LEVEL))
      );
      const sourceY = Math.max(
        0,
        Math.floor(y - LENSE_SIZE / (2 * ZOOM_LEVEL))
      );
      const sourceWidth = Math.min(
        Math.floor(LENSE_SIZE / ZOOM_LEVEL),
        canvas.width - sourceX
      );
      const sourceHeight = Math.min(
        Math.floor(LENSE_SIZE / ZOOM_LEVEL),
        canvas.height - sourceY
      );

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        canvas,
        sourceX - 5 / ZOOM_LEVEL,
        sourceY - 5 / ZOOM_LEVEL,
        sourceWidth,
        sourceHeight,
        x - LENSE_SIZE / 2,
        y - LENSE_SIZE / 2,
        LENSE_SIZE,
        LENSE_SIZE
      );

      ctx.restore();

      const pixelSize = LENSE_SIZE / sourceWidth;
      const highlightX = x - pixelSize / 2;
      const highlightY = y - pixelSize / 2;

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        highlightX - 1,
        highlightY - 1,
        pixelSize + 2,
        pixelSize + 2
      );

      ctx.beginPath();
      ctx.arc(x, y, LENSE_SIZE / 2, 0, 2 * Math.PI);

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
      const borderColor = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${
        pixel[3] / 255
      })`;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = LENSE_SIZE / 20;
      ctx.stroke();

      const text = `#${hexColor}`;
      const fontSize = Math.max(18, Math.min(24, LENSE_SIZE / 10));
      ctx.font = `bold ${fontSize}px sans-serif`;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight =
        textMetrics.actualBoundingBoxAscent +
        textMetrics.actualBoundingBoxDescent;

      const tagWidth = textWidth + TAG_PADDING_X;
      const tagHeight = textHeight + TAG_PADDING_Y;
      const tagX = x - tagWidth / 2;
      const tagY = y - tagHeight / 2 + TAG_MARGIN_Y;

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(tagX + 10, tagY);
      ctx.lineTo(tagX + tagWidth - 10, tagY);
      ctx.quadraticCurveTo(tagX + tagWidth, tagY, tagX + tagWidth, tagY + 10);
      ctx.lineTo(tagX + tagWidth, tagY + tagHeight - 10);
      ctx.quadraticCurveTo(
        tagX + tagWidth,
        tagY + tagHeight,
        tagX + tagWidth - 10,
        tagY + tagHeight
      );
      ctx.lineTo(tagX + 10, tagY + tagHeight);
      ctx.quadraticCurveTo(tagX, tagY + tagHeight, tagX, tagY + tagHeight - 10);
      ctx.lineTo(tagX, tagY + 10);
      ctx.quadraticCurveTo(tagX, tagY, tagX + 10, tagY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y + TAG_MARGIN_Y);
    },
    [canvasRef]
  );

  const moveLens = useCallback(
    (e: MouseEvent) => {
      if (!isActive || !isHovering) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const { x, y } = getCursorPos(e);

      clearCanvas();
      drawMagnifyingGlass(ctx, x, y);
    },
    [
      isActive,
      isHovering,
      canvasRef,
      getCursorPos,
      clearCanvas,
      drawMagnifyingGlass,
    ]
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
