"use client";

import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let prepared: any = null;
let lastFontSize: number = 0;
let baseText: string = "WHAT'S ON?  ";

let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let w = 0;
let h = 0;
let dpr = 1;

onmessage = (e: MessageEvent) => {
  const { type, x, y, width, height, dpr: newDpr, canvas: newCanvas, text } = e.data;

  switch (type) {
    case "init":
      canvas = newCanvas;
      ctx = canvas?.getContext("2d") || null;
      if (text) baseText = text;
      dpr = newDpr || 1;
      
      // We don't have width/height yet, resize will follow
      requestAnimationFrame(render);
      break;

    case "resize":
      w = width;
      h = height;
      dpr = newDpr || dpr;
      if (canvas) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      break;

    case "mouseMove":
      targetX = x;
      targetY = y;
      break;
  }
};

const render = (time: number) => {
  if (!ctx || !canvas || w === 0 || h === 0) {
    requestAnimationFrame(render);
    return;
  }

  // 1. Dynamic Font Calculation
  const fontSize = Math.max(80, Math.min(w * 0.15, 250));
  const fontString = `900 ${fontSize}px Inter, "Inter Fallback", ui-sans-serif, sans-serif`;

  if (!prepared || lastFontSize !== fontSize) {
    prepared = prepareWithSegments(baseText, fontString);
    lastFontSize = fontSize;
  }

  // Layout a single instance to get width with extra tracking/buffer
  const layoutData = layoutWithLines(prepared, 8000, fontSize * 1.5);
  const textWidth = (layoutData.lines[0]?.width || w) * 1.2; // 20% horizontal gap

  // 2. Interaction Physics (Lerp)
  currentX += (targetX - currentX) * 0.05;
  currentY += (targetY - currentY) * 0.05;

  const baseScrollSpeed = time * 0.03;
  const numLayers = 2; 
  const layerSpacingY = fontSize * 1.5; // Tighter spacing for a proper interleaved stack
  
  // Clear and Draw
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // Apply global tilt
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-4 * Math.PI / 180);
  ctx.translate(-w / 2, -h / 2);

  const startY = -layerSpacingY * 6;
  const rowsNeeded = Math.ceil(h / layerSpacingY) + 12;

  for (let rowIdx = 0; rowIdx < rowsNeeded; rowIdx++) {
    // Interleave: Each row belongs to a specific layer
    const layerIdx = rowIdx % numLayers;
    const depth = (layerIdx + 1) / numLayers;
    
    // Per-layer styling: Row 0 is green, Row 1 is white
    const isGreen = rowIdx % 2 === 0;
    const baseOpacity = isGreen ? 0.15 : 0.12; // Increased for visibility
    const layerOpacity = baseOpacity * (depth + 0.3);

    ctx.fillStyle = isGreen
      ? `rgba(0, 200, 100, ${layerOpacity})` // Brighter ZRU Green
      : `rgba(255, 255, 255, ${layerOpacity})`; // Pure White (no reduction)

    ctx.font = fontString;
    ctx.textBaseline = "top";

    // Unified Y parallax to keep rows "one below the other"
    // We use a small depth influence but keep it mostly synchronous to prevent row crashes
    const rowY = startY + (currentY * 20) + (rowIdx * layerSpacingY);
    
    // Per-layer horizontal motion
    const mouseXOffset = currentX * (depth * 60);
    const horizontalStride = textWidth * 1.5;
    const scrollAmount = (baseScrollSpeed * depth) % horizontalStride;

    let txStart = mouseXOffset + (isGreen ? -scrollAmount : scrollAmount);
    txStart = ((txStart % horizontalStride) + horizontalStride) % horizontalStride - horizontalStride;

    // Draw enough copies to cover the expanded canvas width plus safety margins
    for (let tx = txStart; tx < w + horizontalStride; tx += horizontalStride) {
      ctx.fillText(baseText, tx, rowY);
    }
  }
  ctx.restore();


  requestAnimationFrame(render);
};

