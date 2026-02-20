// @ts-nocheck
import React, { useState, Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Undo,
  Maximize2,
  Image as ImageIcon,
  Move,
  Check,
  Type,        // ✅ Add these
  Scaling,     // ✅ Add these
  MousePointer2, // ✅ Add these
  ImagePlus,   // ✅ Add these
  Ban,         // ✅ Add these
  Target,      // ✅ Add these
  Expand,      // ✅ Add these
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ============================================================================
// CLIP-ART LIBRARY
// ============================================================================
const CLIPART_LIBRARY = {
  hearts: {
    id: "hearts",
    category: "Romance",
    items: [
      {
        id: "heart-1",
        name: "Heart",
        svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      },
      {
        id: "heart-2",
        name: "Double Hearts",
        svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09M16 4.5c1.74 0 3.41.81 4.5 2.09 1.08 1.28 1.5 2.91 1.5 4.91",
      },
    ],
  },
  rings: {
    id: "rings",
    category: "Wedding",
    items: [
      {
        id: "rings-1",
        name: "Wedding Rings",
        svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M16 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
      },
      {
        id: "rings-2",
        name: "Diamond Ring",
        svg: "M12 2L4 9l8 13 8-13-8-7zm0 3.5L15.5 9h-7L12 5.5z",
      },
    ],
  },
  flowers: {
    id: "flowers",
    category: "Nature",
    items: [
      {
        id: "flower-1",
        name: "Rose",
        svg: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
      },
      {
        id: "flower-2",
        name: "Tulip",
        svg: "M12 2C8.5 2 6 4.5 6 8c0 3 2 5.5 4.5 6.5V22h3v-7.5C16 13.5 18 11 18 8c0-3.5-2.5-6-6-6z",
      },
    ],
  },
  crosses: {
    id: "crosses",
    category: "Religious",
    items: [
      {
        id: "cross-1",
        name: "Simple Cross",
        svg: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z",
      },
      {
        id: "cross-2",
        name: "Ornate Cross",
        svg: "M12 2L10 6h4l-2-4zm0 20l2-4h-4l2 4zM2 12l4-2v4l-4-2zm20 0l-4 2v-4l4 2z M11 7h2v10h-2z M7 11h10v2H7z",
      },
    ],
  },
  stars: {
    id: "stars",
    category: "Decorative",
    items: [
      {
        id: "star-1",
        name: "Star",
        svg: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      },
      {
        id: "star-2",
        name: "Sparkle",
        svg: "M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5L12 1z",
      },
    ],
  },
  doves: {
    id: "doves",
    category: "Birds",
    items: [
      {
        id: "dove-1",
        name: "Dove",
        svg: "M12 3c-4.97 0-9 4.03-9 9 0 3.38 1.87 6.32 4.63 7.87L6 22l6-4 6 4-1.63-2.13C19.13 18.32 21 15.38 21 12c0-4.97-4.03-9-9-9z M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
      },
    ],
  },
  butterflies: {
    id: "butterflies",
    category: "Nature",
    items: [
      {
        id: "butterfly-1",
        name: "Butterfly",
        svg: "M12 2C9.24 2 7 4.24 7 7c0 1.44.62 2.74 1.6 3.65L7 13l5 3 5-3-1.6-2.35C16.38 9.74 17 8.44 17 7c0-2.76-2.24-5-5-5z M12 22l-3-5h6l-3 5z",
      },
    ],
  },
};




async function createImageOnlyTexture(imageSrc, imageMode = "contain") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      try {
        const engravingImage = await applyEngravingEffect(imageSrc, 0.9, "#4c3328");
        const processedImg = new Image();
        processedImg.crossOrigin = "anonymous";

        await new Promise((res, rej) => {
          processedImg.onload = res;
          processedImg.onerror = rej;
          processedImg.src = engravingImage;
        });

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const baseWidth = 1024;
        const baseHeight = 512;
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(baseWidth * dpr);
        canvas.height = Math.floor(baseHeight * dpr);
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        const imgAspect = processedImg.width / processedImg.height;
        const canvasAspect = baseWidth / baseHeight;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imageMode === "cover") {
          if (imgAspect > canvasAspect) {
            drawHeight = baseHeight;
            drawWidth = baseHeight * imgAspect;
            offsetX = (baseWidth - drawWidth) / 2;
            offsetY = 0;
          } else {
            drawWidth = baseWidth;
            drawHeight = baseWidth / imgAspect;
            offsetX = 0;
            offsetY = (baseHeight - drawHeight) / 2;
          }
        } else {
          if (imgAspect > canvasAspect) {
            drawWidth = baseWidth;
            drawHeight = baseWidth / imgAspect;
            offsetX = 0;
            offsetY = (baseHeight - drawHeight) / 2;
          } else {
            drawHeight = baseHeight;
            drawWidth = baseHeight * imgAspect;
            offsetX = (baseWidth - drawWidth) / 2;
            offsetY = 0;
          }
        }

        ctx.drawImage(processedImg, offsetX, offsetY, drawWidth, drawHeight);

        const texture = new THREE.CanvasTexture(canvas);
        texture.generateMipmaps = false;
        texture.anisotropy = 16;
        texture.encoding = THREE.sRGBEncoding;
        texture.needsUpdate = true;
        resolve(texture);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = reject;
    img.src = imageSrc;
  });
}




function DraggableTextLayer({
  textTexture,
  position,
  rotation,
  planeSize,
  isEditMode,
  isActive,
  onPositionChange,
  onScaleChange,
  scale = [1, 1, 1],
  transformMode = 'translate',
}) {
  const groupRef = useRef();

  const handleTransformChange = () => {
    if (groupRef.current) {
      if (transformMode === 'translate' && onPositionChange) {
        const newPosition = groupRef.current.position.toArray();
        onPositionChange(newPosition);
      } else if (transformMode === 'scale' && onScaleChange) {
        const newScale = groupRef.current.scale.toArray();
        const clampedScale = newScale.map(s => Math.max(0.1, Math.min(5, s)));
        onScaleChange(clampedScale);
      }
    }
  };

  return (
    <>
      <group
        ref={groupRef}
        position={position}
        scale={scale}
      >
        <mesh rotation={rotation}>
          <planeGeometry args={planeSize} />
          <meshStandardMaterial
            map={textTexture}
            transparent
            alphaTest={0.1}
            roughness={0.8}
            metalness={0.0}
            side={THREE.DoubleSide}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>
      </group>

      {isEditMode && isActive && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={transformMode}
          space={transformMode === 'scale' ? 'local' : 'world'}
          size={`${transformMode === 'scale' ? 2 : 4}`}
          onObjectChange={handleTransformChange}
          translationSnap={0.1}
          scaleSnap={0.1}
          showX={false}
          showY={true}
          showZ={true}
          onMouseEnter={() => {
            document.body.style.cursor = 'grab';
          }}
          onMouseLeave={() => {
            document.body.style.cursor = 'default';
          }}
          onMouseDown={() => {
            document.body.style.cursor = 'grabbing';
          }}
          onMouseUp={() => {
            document.body.style.cursor = 'grab';
          }}
        />
      )}
    </>
  );
}

function DraggableImageLayer({
  imageTexture,
  position,
  rotation,
  planeSize,
  isEditMode,
  isActive,
  onPositionChange,
  onScaleChange,
  scale = [1, 1, 1],
  transformMode = 'translate',
}) {
  const groupRef = useRef();

  const handleTransformChange = () => {
    if (groupRef.current) {
      if (transformMode === 'translate' && onPositionChange) {
        const newPosition = groupRef.current.position.toArray();
        onPositionChange(newPosition);
      } else if (transformMode === 'scale' && onScaleChange) {
        const newScale = groupRef.current.scale.toArray();
        const clampedScale = newScale.map(s => Math.max(0.1, Math.min(5, s)));
        onScaleChange(clampedScale);
      }
    }
  };

  return (
    <>
      <group
        ref={groupRef}
        position={position}
        scale={scale}
      >
        <mesh rotation={rotation}>
          <planeGeometry args={planeSize} />
          <meshStandardMaterial
            map={imageTexture}
            transparent
            alphaTest={0.1}
            roughness={0.8}
            metalness={0.0}
            side={THREE.DoubleSide}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>
      </group>

      {isEditMode && isActive && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={transformMode}
          space={transformMode === 'scale' ? 'local' : 'world'}
          size={`${transformMode === 'scale' ? 2 : 4}`}
          onObjectChange={handleTransformChange}
          translationSnap={0.1}
          scaleSnap={0.1}
          showX={false}
          showY={true}
          showZ={true}
          onMouseEnter={() => {
            document.body.style.cursor = 'grab';
          }}
          onMouseLeave={() => {
            document.body.style.cursor = 'default';
          }}
          onMouseDown={() => {
            document.body.style.cursor = 'grabbing';
          }}
          onMouseUp={() => {
            document.body.style.cursor = 'grab';
          }}
        />
      )}
    </>
  );
}

// ============================================================================
// ENGRAVING EFFECT CONVERTER
// ============================================================================
async function applyEngravingEffect(imageSrc, engraveDepth = 0.7, textColor = "#4c3328") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 76, g: 51, b: 40 };
      };

      const baseColor = hexToRgb(textColor);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        const gray = (r * 0.299 + g * 0.587 + b * 0.114);
        const brightness = gray / 255;
        const darkness = 1 - brightness;

        if (brightness > 0.85) {
          data[i + 3] = 0;
        } else if (brightness > 0.5) {
          const intensity = (1 - brightness) * engraveDepth;
          const lightFactor = 1.5;
          data[i] = Math.floor(Math.min(255, baseColor.r * lightFactor));
          data[i + 1] = Math.floor(Math.min(255, baseColor.g * lightFactor));
          data[i + 2] = Math.floor(Math.min(255, baseColor.b * lightFactor));
          data[i + 3] = Math.floor(alpha * intensity * 0.6);
        } else if (brightness > 0.2) {
          const intensity = darkness * engraveDepth;
          data[i] = Math.floor(baseColor.r * intensity);
          data[i + 1] = Math.floor(baseColor.g * intensity);
          data[i + 2] = Math.floor(baseColor.b * intensity);
          data[i + 3] = Math.floor(alpha * 0.85);
        } else {
          const intensity = darkness * engraveDepth;
          const darkFactor = 0.7;
          data[i] = Math.floor(baseColor.r * darkFactor * intensity);
          data[i + 1] = Math.floor(baseColor.g * darkFactor * intensity);
          data[i + 2] = Math.floor(baseColor.b * darkFactor * intensity);
          data[i + 3] = alpha;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };

    img.onerror = reject;
    img.src = imageSrc;
  });
}

function svgToEngravingDataURL(svgPath) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200">
      <path fill="#000000" d="${svgPath}"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ============================================================================
// TEXT TEXTURE
// ============================================================================
function getLines(ctx, text, maxWidth) {
  const manualLines = text.split("\n");
  const lines = [];

  manualLines.forEach((line) => {
    const words = line.split(" ");

    if (words.length === 0 || line === "") {
      lines.push("");
      return;
    }

    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;

      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
  });

  return lines;
}

async function createEngravedTextTexture(
  text,
  fontFamily,
  fontSize = 140,
  fontStyle = "normal",
  fontWeight = "normal",
  textColor = "#4c3328" // Add textColor parameter back
) {
  const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

  try {
    await document.fonts.load(fontSpec);
    await document.fonts.ready;
  } catch (e) { }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const baseWidth = 1024;
  const baseHeight = 512;
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(baseWidth * dpr);
  canvas.height = Math.floor(baseHeight * dpr);
  const ctx = canvas.getContext("2d");

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, baseWidth, baseHeight);

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = baseWidth * 0.95;
  const lines = getLines(ctx, text, maxWidth);
  const lineHeight = fontSize * 1.1;
  const totalHeight = lines.length * lineHeight;
  let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    const x = baseWidth / 2;

    ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = textColor; // Use the textColor parameter
    ctx.fillText(line, x, y);

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 16;
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
  return texture;
}


async function createCombinedEngravingTexture(
  text,
  fontFamily,
  fontSize = 140,
  fontStyle = "normal",
  fontWeight = "normal",
  imageSrc,
  imageMode = "contain",
  woodColor = "#d4a574",
  textColor = "#4c3328"
) {
  const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

  try {
    await document.fonts.load(fontSpec);
    await document.fonts.ready;
  } catch (e) { }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const baseWidth = 1024;
  const baseHeight = 512;
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(baseWidth * dpr);
  canvas.height = Math.floor(baseHeight * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  if (imageSrc) {
    try {
      const engravingImage = await applyEngravingEffect(imageSrc, 0.9, textColor);
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = engravingImage;
      });

      const imgAspect = img.width / img.height;
      const canvasAspect = baseWidth / baseHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imageMode === "cover") {
        if (imgAspect > canvasAspect) {
          drawHeight = baseHeight;
          drawWidth = baseHeight * imgAspect;
          offsetX = (baseWidth - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = baseWidth;
          drawHeight = baseWidth / imgAspect;
          offsetX = 0;
          offsetY = (baseHeight - drawHeight) / 2;
        }
      } else {
        if (imgAspect > canvasAspect) {
          drawWidth = baseWidth;
          drawHeight = baseWidth / imgAspect;
          offsetX = 0;
          offsetY = (baseHeight - drawHeight) / 2;
        } else {
          drawHeight = baseHeight;
          drawWidth = baseHeight * imgAspect;
          offsetX = (baseWidth - drawWidth) / 2;
          offsetY = 0;
        }
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } catch (e) {
      console.error(e);
    }
  }

  if (text) {
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxWidth = baseWidth * 0.9;
    const lines = getLines(ctx, text, maxWidth);
    const lineHeight = fontSize * 1.1;
    const totalHeight = lines.length * lineHeight;
    let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

    lines.forEach((line, i) => {
      const y = startY + i * lineHeight;
      const x = baseWidth / 2;

      ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 5;

      ctx.fillStyle = textColor;
      ctx.fillText(line, x, y);

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.anisotropy = 16;
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
  return texture;
}

// ============================================================================
// CAMERA CONTROLLER
// ============================================================================
function CameraController({ zoom, rotation, reset }) {
  const { camera } = useThree();
  const initialPosition = useRef([8, 5, 8]);

  useEffect(() => {
    if (reset > 0) {
      camera.position.set(...initialPosition.current);
      camera.lookAt(0, 0, 0);
    }
  }, [reset, camera]);

  useEffect(() => {
    const baseDistance = 10;
    const newDistance = baseDistance / zoom;
    const direction = camera.position.clone().normalize();
    camera.position.copy(direction.multiplyScalar(newDistance));
  }, [zoom, camera]);

  useEffect(() => {
    if (rotation !== 0) {
      const axis = new THREE.Vector3(1, 0, 0);
      camera.position.applyAxisAngle(axis, rotation);
      camera.lookAt(0, 0, 0);
    }
  }, [rotation, camera]);

  return null;
}

// ============================================================================
// WOOD TEXTURE
// ============================================================================
const createWoodTexture = (color) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
    ctx.lineWidth = Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * 512);
    ctx.bezierCurveTo(
      128,
      Math.random() * 512,
      384,
      Math.random() * 512,
      512,
      Math.random() * 512
    );
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

// ============================================================================
// INTERACTIVE TEXT PREVIEW
// ============================================================================
function InteractiveTextPreview({ text, position, onPositionChange, textColor, fontFamily, fontStyle, fontWeight, brickType }) {
  const [isDragging, setIsDragging] = useState(false);
  const [localPosition, setLocalPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef();

  // Get the correct Z value based on brick type
  const getDefaultZ = () => {
    if (brickType === "2x4-standard") return 3;
    return 5; // for 2x2-plus and 2x4-plus
  };

  // Convert 3D position to 2D preview position
  useEffect(() => {
    if (position && position.length === 3) {
      // The brick surface in 3D has these approximate ranges:
      // X: 0 to 32 (center at 16) for 2x4-plus
      // Y: 0 to 19.6 (center at 9.8) for 2x4-plus

      const xRange = brickType === "2x4-standard" ? 16 : 32;
      const yRange = brickType === "2x4-standard" ? 9.6 : 19.6;
      const centerX = xRange / 2;
      const centerY = yRange / 2;

      // Map 3D coordinates to 2D percentage (0-100%)
      // X: center is at 50%, scale to use 20%-80% range
      const normalizedX = ((position[0] - centerX) / (xRange * 0.3)) * 30 + 50;

      // Y: center is at 50%, scale to use 20%-80% range (inverted because Y is flipped)
      const normalizedY = ((centerY - position[1]) / (yRange * 0.3)) * 30 + 50;

      setLocalPosition({
        x: Math.max(20, Math.min(80, normalizedX)),
        y: Math.max(20, Math.min(80, normalizedY))
      });
    }
  }, [position, brickType]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain to safe area (20%-80% to keep text visible)
    const clampedX = Math.max(20, Math.min(80, x));
    const clampedY = Math.max(20, Math.min(80, y));

    setLocalPosition({ x: clampedX, y: clampedY });

    // Convert 2D percentage back to 3D coordinates
    const xRange = brickType === "2x4-standard" ? 16 : 32;
    const yRange = brickType === "2x4-standard" ? 9.6 : 19.6;
    const centerX = xRange / 2;
    const centerY = yRange / 2;

    // Map 2D percentage (20%-80% = ±30% from center) to 3D coords
    const pos3DX = centerX + ((clampedX - 50) / 30) * (xRange * 0.3);
    const pos3DY = centerY - ((clampedY - 50) / 30) * (yRange * 0.3);
    const pos3DZ = getDefaultZ();

    onPositionChange([pos3DX, pos3DY, pos3DZ]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };




  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, localPosition, brickType]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 border-2 border-amber-400 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden"
      style={{ touchAction: 'none' }}
    >
      {/* Brick outline - safe area */}
      <div className="absolute inset-8 border-2 border-amber-600 rounded bg-gradient-to-br from-amber-100 to-amber-200"></div>

      {/* Draggable Text */}
      {text && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${localPosition.x}%`,
            top: `${localPosition.y}%`,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            fontWeight: fontWeight,
            color: textColor,
            fontSize: '20px',
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: 10,
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: isDragging ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
          }}
          onMouseDown={handleMouseDown}
        >
          {text}

          {/* Crosshair on text */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-6 h-0.5 bg-red-500 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-0.5 h-6 bg-red-500 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      )}

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 opacity-50"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 opacity-50"></div>
      </div>

      {/* Instructions */}
      {!isDragging && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs text-gray-700 shadow-sm pointer-events-none">
          Click and drag text to reposition
        </div>
      )}

      {/* Active dragging indicator */}
      {isDragging && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg pointer-events-none">
          Dragging...
        </div>
      )}
    </div>
  );
}




// ============================================================================
// BRICK COMPONENT
// ============================================================================
function Brick({
  text,
  brickType,
  woodColor,
  uploadedImage,
  textColor,
  fontFamily,
  fontStyle,
  fontWeight,
  imageMode,
  objFilePath,
  isEditMode = false,
  textPosition,
  imagePosition,
  onTextPositionChange,
  onImagePositionChange,
  editTarget,
  textScale,  // ✅ Add
  imageScale,  // ✅ Add
  onTextScaleChange,  // ✅ Add
  onImageScaleChange,  // ✅ Add
  transformMode,  // ✅ Add
}) {
  const meshRef = useRef();
  const brickModelPath = objFilePath || "/2X4 Plus Size_UVs.obj";
  const obj = useLoader(OBJLoader, brickModelPath);
  const [textTexture, setTextTexture] = useState(null);
  const [imageTexture, setImageTexture] = useState(null);

  // Create text texture
  useEffect(() => {
    let mounted = true;
    let current = null;

    if (text) {
      createEngravedTextTexture(text, fontFamily, 100, fontStyle, fontWeight, textColor) // Add textColor
        .then((tex) => {
          if (!mounted) {
            tex.dispose();
            return;
          }
          setTextTexture(tex);
          current = tex;
        })
        .catch(() => { });
    } else {
      setTextTexture(null);
    }

    return () => {
      mounted = false;
      if (current) {
        current.dispose();
      }
    };
  }, [text, fontFamily, fontStyle, fontWeight, textColor]); // Add textColor to dependencies


  // Create image texture
  useEffect(() => {
    let mounted = true;
    let current = null;

    if (uploadedImage) {
      createImageOnlyTexture(uploadedImage, imageMode, textColor) // Add textColor
        .then((tex) => {
          if (!mounted) {
            tex.dispose();
            return;
          }
          setImageTexture(tex);
          current = tex;
        })
        .catch(() => { });
    } else {
      setImageTexture(null);
    }

    return () => {
      mounted = false;
      if (current) {
        current.dispose();
      }
    };
  }, [uploadedImage, imageMode, textColor]); // Add textColor to dependencies

  const brickDimensions = {
    "2x2-plus": { width: 2, height: 1.2, depth: 2 },
    "2x4-plus": { width: 4, height: 1.2, depth: 2 },
    "2x4-standard": { width: 4, height: 1.2, depth: 2 },
  };
  const dims = brickDimensions[brickType];

  const textPlaneConfig = {
    "2x2-plus": {
      position: textPosition || [16, 9.8, 5],
      rotation: [0, Math.PI / 2, 0],
      planeSize: [dims.width * 14, dims.height * 14],
    },
    "2x4-plus": {
      position: textPosition || [16, 9.8, 1],
      rotation: [0, Math.PI / 2, 0],
      planeSize: [dims.width * 14, dims.height * 14],
    },
    "2x4-standard": {
      position: textPosition || [8, 4.8, 2],
      rotation: [0, Math.PI / 2, 0],
      planeSize: [dims.width * 7, dims.height * 7],
    },
  };

  const imagePlaneConfig = {
    "2x2-plus": {
      position: imagePosition || [16, 9.8, 4.8], // Slightly behind text
      rotation: [0, Math.PI / 2, 0],
      planeSize: [dims.width * 14, dims.height * 14],
    },
    "2x4-plus": {
      position: imagePosition || [16, 9.8, 2],
      rotation: [0, Math.PI / 2, 0],
      planeSize: [dims.width * 14, dims.height * 14],
    },
    "2x4-standard": {
      position: imagePosition || [8, 4.8, 2.2],
      rotation: [0, Math.PI / 2, 0],
      planeSize: [dims.width * 7, dims.height * 7],
    },
  };

  const textConfig = textPlaneConfig[brickType];
  const imageConfig = imagePlaneConfig[brickType];
  const modelScale = 0.15;
  const scaleMultiplier = brickType === "2x4-standard" ? 2.0 * modelScale : modelScale;

  const clonedObj = React.useMemo(() => {
    const cloned = obj.clone();
    const woodTexture = createWoodTexture(woodColor);

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: woodColor,
          roughness: 0.7,
          metalness: 0.1,
          map: woodTexture,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return cloned;
  }, [obj, woodColor]);

  return (
    <group ref={meshRef} scale={scaleMultiplier} position={[0, -1, 0]}>
      <primitive object={clonedObj} />

      {imageTexture && (
        <DraggableImageLayer
          imageTexture={imageTexture}
          position={imageConfig.position}
          rotation={imageConfig.rotation}
          planeSize={imageConfig.planeSize}
          isEditMode={isEditMode}
          isActive={editTarget === 'image'}
          onPositionChange={onImagePositionChange}
          onScaleChange={onImageScaleChange}  // ✅ Add
          scale={imageScale}  // ✅ Add
          transformMode={transformMode}  // ✅ Add
        />
      )}

      {textTexture && (
        <DraggableTextLayer
          textTexture={textTexture}
          position={textConfig.position}
          rotation={textConfig.rotation}
          planeSize={textConfig.planeSize}
          isEditMode={isEditMode}
          isActive={editTarget === 'text'}
          onPositionChange={onTextPositionChange}
          onScaleChange={onTextScaleChange}  // ✅ Add
          scale={textScale}  // ✅ Add
          transformMode={transformMode}  // ✅ Add
        />
      )}
    </group>
  );
}





// ============================================================================
// SCENE
// ============================================================================
function Scene({
  text,
  brickType,
  woodColor,
  uploadedImage,
  textColor,
  fontFamily,
  fontStyle,
  fontWeight,
  imageMode,
  zoom,
  reset,
  objFilePath,
  isEditMode,
  textPosition,
  imagePosition,
  onTextPositionChange,
  onImagePositionChange,
  textScale,  // ✅ ADD THIS
  imageScale,  // ✅ ADD THIS
  onTextScaleChange,  // ✅ ADD THIS
  onImageScaleChange,  // ✅ ADD THIS
  transformMode,  // ✅ ADD THIS
  editTarget,
}) {
  return (
    <>
      <CameraController zoom={zoom} rotation={0} reset={reset} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight position={[-5, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} castShadow />
      <Suspense fallback={null}>
        <Brick
          text={text}
          brickType={brickType}
          woodColor={woodColor}
          uploadedImage={uploadedImage}
          textColor={textColor}
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          fontWeight={fontWeight}
          imageMode={imageMode}
          objFilePath={objFilePath}
          isEditMode={isEditMode}
          textPosition={textPosition}
          imagePosition={imagePosition}
          onTextPositionChange={onTextPositionChange}
          onImagePositionChange={onImagePositionChange}
          textScale={textScale}  // ✅ Add
          imageScale={imageScale}  // ✅ Add
          onTextScaleChange={onTextScaleChange}  // ✅ CORRECT - use the prop passed to Scene
          onImageScaleChange={onImageScaleChange}
          transformMode={transformMode}  // ✅ Add
          editTarget={editTarget}

        />
      </Suspense>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2} far={4} />
      <Environment preset="warehouse" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={25}
        enableRotate={false} // ✅ Keep rotation disabled always
        enabled={!isEditMode} // ✅ Only disable everything during edit mode
      />
    </>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function EngravedBrickCustomizer() {
  const getProductIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product_id') || '16';
  };

  const [productId] = useState(getProductIdFromUrl());
  const [productData, setProductData] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [brickType, setBrickType] = useState("2x4-plus");
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [woodColor, setWoodColor] = useState("#d4a574");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textColor, setTextColor] = useState("#4c3328");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontFamily, setFontFamily] = useState("Adamina");
  const [imageMode, setImageMode] = useState("contain");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showClipart, setShowClipart] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [textPosition, setTextPosition] = useState(null);
  const [imagePosition, setImagePosition] = useState(null); // Add this
  const [editTarget, setEditTarget] = useState('text'); // Add this: 'text' or 'image'
  const [textScale, setTextScale] = useState([1, 1, 1]);
  const [imageScale, setImageScale] = useState([1, 1, 1]);
  const [transformMode, setTransformMode] = useState('translate');
  const prevZoomRef = useRef(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/product/${productId}`
        );

        if (!response.ok) throw new Error('Failed to fetch product data');
        const result = await response.json();
        console.log("API RESPONSE ❤: ", result);


        if (result.success && result.data) {
          setProductData(result.data);
          setTemplateData(result.predefined_template);
        } else {
          throw new Error('Invalid API response');
        }

        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const fontOptions = {
    Adamina: "Adamina",
    Aladin: "Aladin",
    "Amatic SC": "Amatic SC",
    Amiri: "Amiri",
    Arimo: "Arimo",
    Arizonia: "Arizonia",
    "Berkshire Swash": "Berkshire Swash",
    Cairo: "Cairo",
    Condiment: "Condiment",
    Cookie: "Cookie",
    Damion: "Damion",
    "EB Garamond": "EB Garamond",
    Fondamento: "Fondamento",
    "Gloria Hallelujah": "Gloria Hallelujah",
    "Rock Salt": "Rock Salt",
    Rubik: "Rubik",
    "Shippori Mincho": "Shippori Mincho",
    Tinos: "Tinos",
    "Trail One": "Trail One",
    "ZCOOL XiaoWei": "ZCOOL XiaoWei",
    Roboto: "Roboto",
    "Open Sans": "Open Sans",
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      const imageUrl = URL.createObjectURL(file);
      setUploadedImageUrl(imageUrl);
    }
  };

  const handleClipartSelect = (svgPath) => {
    const dataUrl = svgToEngravingDataURL(svgPath);
    setUploadedImageUrl(dataUrl);
    setUploadedFile("clipart");
    setShowClipart(false);
  };


  const handleTemplateSelect = (templateId) => {
    const template = templateData.find(t => t.id === templateId);

    if (!template) return;

    setSelectedTemplate(templateId);

    // ✅ Check multiple conditions for Custom template
    const isCustomTemplate =
      template.category === "Custom" ||
      template.name === "Custom" ||
      template.id === 52 || // Your Custom template ID
      (template.template.text === "" && template.img_url === "");

    if (isCustomTemplate) {
      // Clear everything for custom template
      setText("");
      clearImage();
      console.log("Custom template selected - cleared all content");
    } else {
      // Set the text from template
      setText(template.template.text || "");

      // If template has an image, load it
      if (template.img_url && template.img_url !== "") {
        setUploadedImageUrl(template.img_url);
        setUploadedFile("template-image");
      } else {
        // Clear image if template doesn't have one
        clearImage();
      }

      console.log("Template applied:", template.name);
    }

    setShowTemplates(false);
  };

  const clearImage = () => {
    setUploadedFile(null);
    if (uploadedImageUrl && !uploadedImageUrl.startsWith('data:')) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl(null);
  };
  const handleZoomIn = () => setZoom((prev) => Math.min(2, prev + 0.1));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.1));
  const handleReset = () => {
    setZoom(1);
    setResetTrigger((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => {
      const entering = !prev;
      if (entering) {
        prevZoomRef.current = zoom;
        setZoom(Math.max(0.5, zoom * 0.7));
      } else {
        if (prevZoomRef.current != null) setZoom(prevZoomRef.current);
      }
      return entering;
    });
  };

  const handleTextPositionChange = (newPosition) => {
    setTextPosition(newPosition);
    console.log("Text position updated:", newPosition);
  };





  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      toast.success("Text position saved!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    else {
      // alert("🎯 Drag text in the preview to reposition");
    }
  };


  const handleImagePositionChange = (newPosition) => {
    setImagePosition(newPosition);
    console.log("Image position updated:", newPosition);
  };




  const handleTextScaleChange = (newScale) => {
    setTextScale(newScale);
    console.log("Text scale updated:", newScale);
  };

  const handleImageScaleChange = (newScale) => {
    setImageScale(newScale);
    console.log("Image scale updated:", newScale);
  };





  const price = productData?.price ? parseFloat(productData.price) : 19.99;
  const total = (price * quantity).toFixed(2);


  const captureScreenshot = async () => {
    return new Promise((resolve) => {
      // Get the canvas element from Three.js
      const canvas = document.querySelector('canvas');

      if (!canvas) {
        console.error('Canvas not found');
        resolve(null);
        return;
      }

      // IMPORTANT: Wait for next frame to ensure scene is fully rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Double requestAnimationFrame ensures rendering is complete

          try {
            // Convert canvas to data URL for debugging
            const dataURL = canvas.toDataURL('image/png', 0.95);

            // Convert data URL to blob for upload
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  console.log('Screenshot captured:', blob.size, 'bytes');
                  resolve({ blob, dataURL });
                } else {
                  console.error('Failed to create blob from canvas');
                  resolve(null);
                }
              },
              'image/png',
              0.95
            );
          } catch (error) {
            console.error('Error capturing screenshot:', error);
            resolve(null);
          }
        });
      });
    });
  };




  const addToCart = async (event) => {
    event.preventDefault();

    const orderDetails = {
      brickType,
      woodColor,
      text: text || "None",
      image: uploadedFile || "None",
      template: selectedTemplate || "custom",
      quantity,
      total,
      engravingStyle: "carved-engraving",
      textPosition: textPosition || "default",
      imagePosition: imagePosition || "default",
    };

    try {
      const button = event.target;
      button.disabled = true;
      button.textContent = "Adding to cart...";

      // Show loading toast
      const loadingToast = toast.loading("Capturing preview and adding to cart...");

      console.log("🚀 Starting cart submission...");
      console.log("Order Details Object:", orderDetails);

      // ✅ CAPTURE SCREENSHOT FROM CANVAS
      const screenshot = await captureScreenshot();

      if (!screenshot) {
        toast.update(loadingToast, {
          render: "Failed to capture screenshot",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        throw new Error("Failed to capture screenshot");
      }

      console.log("📸 Screenshot captured successfully");

      const formData = new FormData();
      formData.append("brick_type", brickType);
      formData.append("wood_color", woodColor);
      formData.append("text", text || "");
      formData.append("template", selectedTemplate || "custom");
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("total", total);
      formData.append("engraving_style", "carved-engraving");
      formData.append("font_family", fontFamily);
      formData.append("font_style", fontStyle);
      formData.append("font_weight", fontWeight);
      formData.append("text_color", textColor);
      formData.append("image_mode", imageMode);
      formData.append("product_id", productId);
      formData.append("text_position", JSON.stringify(textPosition || "default"));
      formData.append("image_position", JSON.stringify(imagePosition || "default"));

      // ✅ APPEND SCREENSHOT
      formData.append("brick_screenshot", screenshot.blob, "brick-preview.png");

      // Uploaded image / clipart handling
      if (uploadedImageUrl && uploadedFile !== "clipart") {
        const response = await fetch(uploadedImageUrl);
        const blob = await response.blob();
        formData.append("image", blob, uploadedFile);
        formData.append("image_type", "upload");
      } else if (uploadedFile === "clipart") {
        formData.append("clipart", uploadedImageUrl);
        formData.append("image_type", "clipart");
      }

      console.log("📦 Submitting FormData");

      const apiResponse = await fetch(
        "https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("📡 API Response Status:", apiResponse.status);

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      console.log("✅ API Response:", result);

      if (result.success) {
        console.log("✅ Successfully added to cart", result.data);

        toast.update(loadingToast, {
          render: "Successfully added to cart! 🎉",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        // Redirect after toast
        setTimeout(() => {
          if (result?.redirect_url) {
            window.location.href = result.redirect_url;
          }
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }

    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error(`Failed to add to cart: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      const button = event?.target;
      if (button) {
        button.disabled = false;
        button.textContent = "Add to cart";
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Loading product data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Product</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && productData && (
        <div className="max-w-7xl mx-auto p-6 pb-32">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Step 2: Upload Artwork</h1>
            <p className="text-gray-600">Customize your wooden brick with carved laser engraving</p>
            <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
              ✨ All designs automatically converted to 3D carved engraving style
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">




            {/* CENTER - 3D Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* CONTROLS ABOVE SCENE */}
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 flex-wrap">
                  <button
                    onClick={handleZoomIn}
                    className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom In</span>
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
                  >
                    <ZoomOut className="w-4 h-4" />
                    <span>Zoom Out</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Undo className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={toggleEditMode}
                    className={`flex items-center justify-center gap-1 px-4 py-2 border-2 rounded font-medium transition-colors text-sm ml-auto ${isEditMode
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                  >
                    {isEditMode ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Done Moving</span>
                      </>
                    ) : (
                      <>
                        <Move className="w-4 h-4" />
                        <span>Move Text Position</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>

                <div
                  className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${isFullscreen ? "fixed inset-0 z-50" : ""
                    }`}
                  style={{ height: isFullscreen ? "100vh" : "600px" }}
                >
                  <Canvas camera={{ position: [1, 0, 0], fov: 70 }} shadows>
                    <Scene
                      text={text}
                      brickType={brickType}
                      woodColor={woodColor}
                      uploadedImage={uploadedImageUrl}
                      textColor={textColor}
                      fontFamily={fontFamily}
                      fontStyle={fontStyle}
                      fontWeight={fontWeight}
                      imageMode={imageMode}
                      zoom={zoom}
                      reset={resetTrigger}
                      objFilePath={productData?.obj_file}
                      isEditMode={isEditMode}
                      textPosition={textPosition}
                      imagePosition={imagePosition}
                      onTextPositionChange={handleTextPositionChange}
                      onImagePositionChange={handleImagePositionChange}
                      textScale={textScale}  // ✅ ADD THIS
                      imageScale={imageScale}  // ✅ ADD THIS
                      onTextScaleChange={handleTextScaleChange}  // ✅ ADD THIS
                      onImageScaleChange={handleImageScaleChange}  // ✅ ADD THIS
                      transformMode={transformMode}  // ✅ ADD THIS
                      editTarget={editTarget}
                    />
                  </Canvas>


                  {isFullscreen && (
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 left-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Maximize2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Templates */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">📋 Predefined Templates</h3>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showTemplates ? "Hide" : "Show"} Templates
                  </button>
                </div>

                {showTemplates && templateData && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {templateData.map((template) => {
                      const isCustom = template.category === "Custom" || template.name === "Custom";

                      return (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${selectedTemplate === template.id
                            ? "border-blue-600 bg-blue-50 shadow-lg"
                            : isCustom
                              ? "border-dashed border-gray-400 bg-gray-50"
                              : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                          {/* Rest of template card */}
                          {isCustom && (
                            <div className="flex items-center justify-center h-32 mb-3">
                              <div className="text-center text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <div className="text-sm font-medium">Start from scratch</div>
                              </div>
                            </div>
                          )}

                          {!isCustom && template.img_url && (
                            <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={template.img_url}
                                alt={template.name}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  e.target.parentElement.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="font-semibold text-sm mb-1">{template.name}</div>
                          <div className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                            {template.category}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-1 space-y-4">
              {/* Text Panel */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">





                <h3 className="font-semibold mb-3 text-lg">Text (Carved Engraving)</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Text</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">{text.length} characters</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Font</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.keys(fontOptions).map((f) => (
                        <option key={f} value={fontOptions[f]}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Style</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm font-bold transition-colors ${fontWeight === "bold"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        B
                      </button>
                      <button
                        onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm italic transition-colors ${fontStyle === "italic"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        I
                      </button>
                    </div>
                  </div>

                  {/* <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Engraving Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {["#4c3328", "#654321", "#000000", "#ffffff", "#8b4513"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setTextColor(color)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            textColor === color ? "border-blue-600 scale-110" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div> */}

                  <div className="space-y-2 pt-2 border-t">
                    <button
                      onClick={() => setText("")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Clear Text
                    </button>
                    <button
                      onClick={() => setShowClipart(!showClipart)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Browse Clip-Art Library
                    </button>
                    <button
                      onClick={() => document.getElementById("fileInput").click()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      ⊕ Upload Custom Image
                    </button>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>


                {isEditMode && (
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 z-10 min-w-[280px]">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Move className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Edit Position</h3>
                      </div>
                      <button
                        onClick={toggleEditMode}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Done
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 mb-4" />

                    {/* Transform Mode Toggle */}
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Transform Mode
                    </p>
                    <div className="mb-4 flex gap-2">
                      <button
                        onClick={() => setTransformMode('translate')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${transformMode === 'translate'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                          }`}
                      >
                        <MousePointer2 className="w-4 h-4" />
                        Move
                      </button>
                      <button
                        onClick={() => setTransformMode('scale')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${transformMode === 'scale'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                          }`}
                      >
                        <Expand className="w-4 h-4" />
                        Scale
                      </button>
                    </div>

                    {/* Target Selection */}
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Edit Target
                    </p>
                    <div className="mb-4 flex gap-2">
                      {/* Text Button */}
                      {text ? (
                        <button
                          onClick={() => setEditTarget('text')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${editTarget === 'text'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                            }`}
                        >
                          <Type className="w-4 h-4" />
                          Text
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-200 text-gray-300 cursor-not-allowed select-none">
                          <Ban className="w-4 h-4" />
                          No Text
                        </div>
                      )}

                      {/* Image Button */}
                      {uploadedImageUrl ? (
                        <button
                          onClick={() => setEditTarget('image')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${editTarget === 'image'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                            }`}
                        >
                          <ImageIcon className="w-4 h-4" />
                          Image
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-200 text-gray-300 cursor-not-allowed select-none">
                          <Ban className="w-4 h-4" />
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Active target badge */}
                    <div className={`mb-3 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${editTarget === 'text'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                      {editTarget === 'text'
                        ? <Type className="w-3.5 h-3.5 flex-shrink-0" />
                        : <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      }
                      Editing: <strong className="ml-0.5">{editTarget === 'text' ? 'Text Layer' : 'Image Layer'}</strong>
                    </div>

                    {/* Instructions */}
                    <div className={`p-3 rounded-lg text-sm flex items-start gap-2.5 ${transformMode === 'translate'
                      ? 'bg-blue-50 border border-blue-200 text-blue-800'
                      : 'bg-purple-50 border border-purple-200 text-purple-800'
                      }`}>
                      {transformMode === 'translate'
                        ? <Target className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        : <Expand className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      }
                      <span>
                        {transformMode === 'translate'
                          ? `Drag the colored arrows in the 3D view to reposition the ${editTarget}.`
                          : `Drag the colored cubes in the 3D view to resize the ${editTarget}.`
                        }
                      </span>
                    </div>

                  </div>
                )}

              </div>

              {uploadedImageUrl && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Uploaded Image</span>
                    <button onClick={clearImage} className="text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                  <img src={uploadedImageUrl} alt="Preview" className="w-full rounded border border-gray-200 mb-3" />

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 block">Image Fit Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setImageMode("contain")}
                        className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "contain"
                          ? "border-blue-600 bg-blue-50 font-medium text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        Fit
                      </button>
                      <button
                        onClick={() => setImageMode("cover")}
                        className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "cover"
                          ? "border-blue-600 bg-blue-50 font-medium text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                          }`}
                      >
                        Fill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showClipart && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">🎨 Clip-Art Library</h3>
                    <button
                      onClick={() => setShowClipart(false)}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  {Object.entries(CLIPART_LIBRARY).map(([key, category]) => (
                    <div key={key} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleClipartSelect(item.svg)}
                            className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
                            title={item.name}
                          >
                            <svg viewBox="0 0 24 24" className="w-full h-12" fill="#000">
                              <path d={item.svg} />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


          </div>

          {/* Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full sm:w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
                    />
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-gray-50">
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
                  <div className="text-center sm:text-right">
                    <div className="text-2xl font-bold">${total}</div>
                    <div className="text-xs text-gray-500">{productData?.name || "3D Model"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
                    <button
                      onClick={addToCart}
                      className="px-8 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 w-full sm:w-auto"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}