const LENSE_SIZE = 125;
const ZOOM_LEVEL = 10;
const TAG_PADDING_X = 20;
const TAG_PADDING_Y = 10;
const TAG_MARGIN_Y = 27.5;

export const rgbToHex = (r: number, g: number, b: number): string =>
  ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

const checkColorContrast = (pixelColor: Uint8ClampedArray) => {
  const luminance =
    0.2126 * pixelColor[0] + 0.7152 * pixelColor[1] + 0.0722 * pixelColor[2];
  return luminance > 127 ? 'black' : 'white';
};

const drawZoomedArea = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): number => {
  const sourceX = Math.max(0, Math.floor(x - LENSE_SIZE / (2 * ZOOM_LEVEL)));
  const sourceY = Math.max(0, Math.floor(y - LENSE_SIZE / (2 * ZOOM_LEVEL)));
  const sourceWidth = Math.min(
    Math.floor(LENSE_SIZE / ZOOM_LEVEL),
    canvas.width - sourceX
  );
  const sourceHeight = Math.min(
    Math.floor(LENSE_SIZE / ZOOM_LEVEL),
    canvas.height - sourceY
  );

  ctx.imageSmoothingEnabled = false; // pixelated effect for better selection
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

  return sourceWidth;
};

const drawHighlightedPixel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number,
  pixelColor: Uint8ClampedArray
) => {
  const highlightX = x - pixelSize / 2;
  const highlightY = y - pixelSize / 2;

  ctx.strokeStyle = checkColorContrast(pixelColor);
  ctx.lineWidth = 2;
  ctx.strokeRect(highlightX - 1, highlightY - 1, pixelSize + 2, pixelSize + 2);
};

const drawLenseBorder = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  borderColor: string
) => {
  ctx.beginPath();
  ctx.arc(x, y, LENSE_SIZE / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = LENSE_SIZE / 20;
  ctx.stroke();
};

const drawColorTag = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexColor: string
) => {
  const text = `#${hexColor}`;
  const fontSize = Math.max(18, Math.min(24, LENSE_SIZE / 10));
  ctx.font = `bold ${fontSize}px sans-serif`;
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight =
    textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

  const tagWidth = textWidth + TAG_PADDING_X;
  const tagHeight = textHeight + TAG_PADDING_Y;
  const tagX = x - tagWidth / 2;
  const tagY = y - tagHeight / 2 + TAG_MARGIN_Y;

  // Draw tag background
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

  // Draw text
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + TAG_MARGIN_Y);
};

export const drawMagnifyingGlass = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, LENSE_SIZE / 2, 0, 2 * Math.PI);
  ctx.clip();

  const sourceWidth = drawZoomedArea(ctx, canvas, x, y);

  ctx.restore();

  const pixelColor = ctx.getImageData(x, y, 1, 1).data;
  const pixelSize = LENSE_SIZE / sourceWidth;
  drawHighlightedPixel(ctx, x, y, pixelSize, pixelColor);

  const hexColor = rgbToHex(pixelColor[0], pixelColor[1], pixelColor[2]);
  const borderColor = `rgba(${pixelColor[0]}, ${pixelColor[1]}, ${
    pixelColor[2]
  }, ${pixelColor[3] / 255})`;

  drawLenseBorder(ctx, x, y, borderColor);
  drawColorTag(ctx, x, y, hexColor);
};
