
// @ts-nocheck
import React, { useState, Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import {
  ZoomIn,
  ZoomOut,
  Undo,
  Maximize2,
  Image as ImageIcon,
  Move,
  Check,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// ============================================================================
// TEXTURE HELPERS
// ============================================================================
async function applyEngravingEffect(
  imageSrc,
  engraveDepth = 0.7,
  textColor = "#4c3328",
) {
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
        return result
          ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
          : { r: 76, g: 51, b: 40 };
      };
      const baseColor = hexToRgb(textColor);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2],
          alpha = data[i + 3];
        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        const brightness = gray / 255;
        const darkness = 1 - brightness;
        if (brightness > 0.85) {
          data[i + 3] = 0;
        } else if (brightness > 0.5) {
          const intensity = (1 - brightness) * engraveDepth;
          data[i] = Math.floor(Math.min(255, baseColor.r * 1.5));
          data[i + 1] = Math.floor(Math.min(255, baseColor.g * 1.5));
          data[i + 2] = Math.floor(Math.min(255, baseColor.b * 1.5));
          data[i + 3] = Math.floor(alpha * intensity * 0.6);
        } else if (brightness > 0.2) {
          const intensity = darkness * engraveDepth;
          data[i] = Math.floor(baseColor.r * intensity);
          data[i + 1] = Math.floor(baseColor.g * intensity);
          data[i + 2] = Math.floor(baseColor.b * intensity);
          data[i + 3] = Math.floor(alpha * 0.85);
        } else {
          const intensity = darkness * engraveDepth;
          data[i] = Math.floor(baseColor.r * 0.7 * intensity);
          data[i + 1] = Math.floor(baseColor.g * 0.7 * intensity);
          data[i + 2] = Math.floor(baseColor.b * 0.7 * intensity);
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

async function createImageOnlyTexture(imageSrc, imageMode = "contain", transform2D = null, brickType = "2x4-plus") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        const engravingImage = await applyEngravingEffect(
          imageSrc,
          0.9,
          "#4c3328",
        );
        const processedImg = new Image();
        processedImg.crossOrigin = "anonymous";
        await new Promise((res, rej) => {
          processedImg.onload = res;
          processedImg.onerror = rej;
          processedImg.src = engravingImage;
        });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const baseWidth = 1024,
          baseHeight = 512;
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(baseWidth * dpr);
        canvas.height = Math.floor(baseHeight * dpr);
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        const imgAspect = processedImg.width / processedImg.height;
        const canvasAspect = baseWidth / baseHeight;
        let drawWidth, drawHeight;
        if (imageMode === "cover") {
          if (imgAspect > canvasAspect) {
            drawHeight = baseHeight;
            drawWidth = baseHeight * imgAspect;
          } else {
            drawWidth = baseWidth;
            drawHeight = baseWidth / imgAspect;
          }
        } else {
          if (imgAspect > canvasAspect) {
            drawWidth = baseWidth;
            drawHeight = baseWidth / imgAspect;
          } else {
            drawHeight = baseHeight;
            drawWidth = baseHeight * imgAspect;
          }
        }

        // Map preview 2D pixels → canvas pixels
        const previewSurface = {
          "2x4-plus": { w: 300, h: 150 },
          "2x2-plus": { w: 150, h: 150 },
          "2x4-standard": { w: 300, h: 150 },
        }[brickType] || { w: 300, h: 150 };
        const scaleX = baseWidth / previewSurface.w;
        const scaleY = baseHeight / previewSurface.h;
        const tx = (transform2D && transform2D.x) ? transform2D.x * scaleX : 0;
        const ty = (transform2D && transform2D.y) ? transform2D.y * scaleY : 0;
        const appliedScale = (transform2D && transform2D.scale) ? transform2D.scale : 1;

        const centerX = baseWidth / 2 + tx;
        const centerY = baseHeight / 2 + ty;

        // Calculate scaled draw size (don't use ctx.scale, draw at actual pixel size)
        const scaledDrawWidth = drawWidth * appliedScale;
        const scaledDrawHeight = drawHeight * appliedScale;

        // Save, clip to brick area, draw at canvas coordinates, restore
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, baseWidth, baseHeight);
        ctx.clip();
        ctx.drawImage(processedImg, centerX - scaledDrawWidth / 2, centerY - scaledDrawHeight / 2, scaledDrawWidth, scaledDrawHeight);
        ctx.restore();
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

function svgToEngravingDataURL(svgPath) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200"><path fill="#000000" d="${svgPath}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

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
  textColor = "#4c3328",
  transform2D = null,
  brickType = "2x4-plus",
) {
  const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
  try {
    await document.fonts.load(fontSpec);
    await document.fonts.ready;
  } catch (e) { }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const baseWidth = 1024,
    baseHeight = 512;
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(baseWidth * dpr);
  canvas.height = Math.floor(baseHeight * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, baseWidth, baseHeight);

  // Map preview 2D pixels -> canvas pixels so transforms match preview editor
  const previewSurface = {
    "2x4-plus": { w: 300, h: 150 },
    "2x2-plus": { w: 150, h: 150 },
    "2x4-standard": { w: 300, h: 150 },
  }[brickType] || { w: 300, h: 150 };
  const scaleX = baseWidth / previewSurface.w;
  const scaleY = baseHeight / previewSurface.h;

  const tx = (transform2D && transform2D.x) ? transform2D.x * scaleX : 0;
  const ty = (transform2D && transform2D.y) ? transform2D.y * scaleY : 0;
  const appliedScale = (transform2D && transform2D.scale) ? transform2D.scale : 1;

  const centerX = baseWidth / 2 + tx;
  const centerY = baseHeight / 2 + ty;

  // Set font at SCALED size directly (not base size + context.scale)
  const scaledFontSize = Math.max(6, fontSize * appliedScale);
  ctx.font = `${fontStyle} ${fontWeight} ${scaledFontSize}px "${fontFamily}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Wrap at actual (not reduced) width since we're drawing at scaled pixel size
  const maxWidth = baseWidth * 0.95;
  const lines = getLines(ctx, text, maxWidth);
  const lineHeight = scaledFontSize * 1.1;
  const totalHeight = lines.length * lineHeight;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, baseWidth, baseHeight);
  ctx.clip();

  // Draw at actual canvas coordinates (no ctx.scale) — clip rect contains everything
  let startY = centerY - totalHeight / 2 + lineHeight / 2;
  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = textColor;
    ctx.fillText(line, centerX, y);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });

  ctx.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 16;
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
  return texture;
}
const createWoodTexture = (color) => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/wood-texture.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.anisotropy = 16;
  return texture;
};
// ============================================================================
// SIMPLE 3D LAYERS
// ============================================================================
function SimpleTextLayer({ textTexture, position, rotation, planeSize, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
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
  );
}

function SimpleImageLayer({ imageTexture, position, rotation, planeSize, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
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
  );
}

// ============================================================================
// CAMERA CONTROLLER
// ============================================================================
function CameraController({ zoom, reset }) {
  const { camera } = useThree();
  const initialPosition = useRef([8, 5, 8]);
  useEffect(() => {
    if (reset > 0) {
      camera.position.set(...initialPosition.current);
      camera.lookAt(0, 0, 0);
    }
  }, [reset, camera]);
  useEffect(() => {
    const baseDistance = 8.5;
    const newDistance = baseDistance / zoom;
    const direction = camera.position.clone().normalize();
    camera.position.copy(direction.multiplyScalar(newDistance));
  }, [zoom, camera]);
  return null;
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
  textPosition,
  imagePosition,
  textScale,
  imageScale,
  textTransform2D = null,
  imageTransform2D = null,
}) {
  const meshRef = useRef();
  const brickModelPath = objFilePath || "/2X4 Plus Size_UVs.obj";
  const obj = useLoader(OBJLoader, brickModelPath);
  const [textTexture, setTextTexture] = useState(null);
  const [imageTexture, setImageTexture] = useState(null);

  // Plane sizes match exact brick face dimensions in 3D scene units
  // faceHalf z*2 = full width, faceHalf y*2 = full height
  const planeSizes = {
    "2x4-plus": { w: 34, h: 10 },  // z*2=34, y*2=10
    "2x2-plus": { w: 17, h: 10 },  // z*2=17, y*2=10
    "2x4-standard": { w: 13, h: 5.6 }, // z*2=13, y*2=5.6
  };
  const ps = planeSizes[brickType] || planeSizes["2x4-plus"];
  const IMAGE_WIDTH = ps.w;
  const IMAGE_HEIGHT = ps.h;

  const brickDimensions = {
    "2x2-plus": { width: 2, height: 1.2 },
    "2x4-plus": { width: 4, height: 1.2 },
    "2x4-standard": { width: 4, height: 1.2 },
  };
  const dims = brickDimensions[brickType];

  useEffect(() => {
    let mounted = true,
      current = null;
    if (text) {
      createEngravedTextTexture(
        text,
        fontFamily,
        100,
        fontStyle,
        fontWeight,
        textColor,
        textTransform2D,
        brickType,
      )
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
      if (current) current.dispose();
    };
  }, [text, fontFamily, fontStyle, fontWeight, textColor, textTransform2D, brickType]);

  useEffect(() => {
    let mounted = true,
      current = null;
    if (uploadedImage) {
      createImageOnlyTexture(uploadedImage, imageMode, imageTransform2D, brickType)
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
      if (current) current.dispose();
    };
  }, [uploadedImage, imageMode, imageTransform2D, brickType]);

  const defaultTextPos = {
    "2x2-plus": [16, 9.8, 5],
    "2x4-plus": [16, 9.8, 1],
    "2x4-standard": [8, 4.8, 2],
  };
  const defaultImagePos = {
    "2x2-plus": [16, 9.8, 4.8],
    "2x4-plus": [16, 9.8, 2],
    "2x4-standard": [8, 4.8, 2.2],
  };
  const textPlaneSize = {
    "2x2-plus": [ps.w, ps.h],
    "2x4-plus": [ps.w, ps.h],
    "2x4-standard": [ps.w, ps.h],
  };
  const rotation = [0, Math.PI / 2, 0];

  const modelScale = 0.15;
  const scaleMultiplier =
    brickType === "2x4-standard" ? 2.0 * modelScale : modelScale;

  const clonedObj = React.useMemo(() => {
    const cloned = obj.clone();

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#D5C2A6"), // ✅ #D5C2A6 overlay on top of texture
          roughness: 0.85,
          metalness: 0.0,
          envMapIntensity: 0.20,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/wood-texture.png",
      (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        tex.anisotropy = 16;
        tex.needsUpdate = true;

        cloned.traverse((child) => {
          if (child.isMesh) {
            child.material.map = tex;
            child.material.needsUpdate = true;
          }
        });
      },
      undefined,
      (err) => console.error("Texture load failed:", err)
    );

    return cloned;
  }, [obj, woodColor]);


  return (
    <group ref={meshRef} scale={scaleMultiplier} position={[0, -1, 0]}>
      <primitive object={clonedObj} />
      {imageTexture && (
        <SimpleImageLayer
          imageTexture={imageTexture}
          position={imagePosition || defaultImagePos[brickType]}
          rotation={rotation}
          planeSize={[IMAGE_WIDTH, IMAGE_HEIGHT]}
          scale={imageScale}
        />
      )}
      {textTexture && (
        <SimpleTextLayer
          textTexture={textTexture}
          position={textPosition || defaultTextPos[brickType]}
          rotation={rotation}
          planeSize={textPlaneSize[brickType]}
          scale={textScale}
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
  textPosition,
  imagePosition,
  textScale,
  imageScale,
  textTransform2D,
  imageTransform2D,
}) {
  return (
    <>
      <CameraController zoom={zoom} reset={reset} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[-5, 10, 0]}
        intensity={0.5}
        angle={0.3}
        penumbra={1}
        castShadow
      />
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
          textPosition={textPosition}
          imagePosition={imagePosition}
          textScale={textScale}
          imageScale={imageScale}
          textTransform2D={textTransform2D}
          imageTransform2D={imageTransform2D}
        />
      </Suspense>
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={15}
        blur={2}
        far={4}
      />
      <Environment preset="warehouse" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={25}
        enableRotate={false}
      />
    </>
  );
}

// ============================================================================
// 2D PREVIEW EDITOR
// ============================================================================
function CornerHandle({ posStyle, bg, onPointerDown, size = 20, children }) {
  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        zIndex: 20,
        userSelect: "none",
        touchAction: "none",
        cursor: "pointer",
        ...posStyle,
      }}
    >
      {children}
    </div>
  );
}

function Layer2D({
  layerRef,
  transform,
  isActive,
  accentColor,
  onLayerPointerDown,
  onMoveHandle,
  onScaleHandle,
  onDelete,
  children,
}) {
  const H = 22;
  return (
    // Outer wrapper: positioned at centre + offset, NOT scaled — so handles stay inside brick
    <div
      ref={layerRef}
      onPointerDown={onLayerPointerDown}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        // Only translate here — scale is applied to the inner content wrapper
        transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px)`,
        cursor: isActive ? "move" : "pointer",
        zIndex: isActive ? 10 : 5,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Inner content: scaled independently so handles don't scale with it */}
      <div
        style={{
          transform: `scale(${transform.scale})`,
          transformOrigin: "center center",
          outline: isActive ? `2px solid ${accentColor}` : "2px dashed transparent",
          borderRadius: 3,
          padding: 4,
        }}
      >
        {children}
      </div>

      {/* Handles rendered OUTSIDE the scaled inner div so they stay at fixed size */}
      {isActive && (
        <>
          {/* TOP LEFT — Move */}
          <CornerHandle
            posStyle={{ top: -H / 2, left: -H / 2, cursor: "grab" }}
            bg={accentColor}
            onPointerDown={onMoveHandle}
            size={H}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
            </svg>
          </CornerHandle>
          {/* BOTTOM LEFT — Delete */}
          <CornerHandle
            posStyle={{ bottom: -H / 2, left: -H / 2, cursor: "pointer" }}
            bg="#ef4444"
            onPointerDown={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            size={H}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </CornerHandle>
          {/* BOTTOM RIGHT — Scale */}
          <CornerHandle
            posStyle={{ bottom: -H / 2, right: -H / 2, cursor: "nwse-resize" }}
            bg={accentColor}
            onPointerDown={onScaleHandle}
            size={H}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z" />
            </svg>
          </CornerHandle>
        </>
      )}
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  color,
  displayVal,
  onChange,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xs font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
          {displayVal}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
        style={{ accentColor: color }}
      />
    </div>
  );
}

function BrickPreviewEditor({
  text,
  uploadedImageUrl,
  fontFamily,
  fontStyle,
  fontWeight,
  textColor,
  woodColor,
  brickType,
  textTransform,
  imageTransform,
  onTextTransformChange,
  onImageTransformChange,
  onClose,
}) {
  const [activeLayer, setActiveLayer] = useState(
    text ? "text" : uploadedImageUrl ? "image" : null,
  );
  const brickRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const ia = useRef({
    type: null,
    layer: null,
    startMX: 0,
    startMY: 0,
    startX: 0,
    startY: 0,
    startScale: 1,
  });

  const brickSurface = {
    "2x4-plus": { w: 300, h: 150 },
    "2x2-plus": { w: 150, h: 150 },
    "2x4-standard": { w: 300, h: 150 },
  }[brickType] || { w: 300, h: 150 };

  const getT = (l) => (l === "text" ? textTransform : imageTransform);
  const setT = (l, v) => {
    if (l === "text") onTextTransformChange?.(v);
    else onImageTransformChange?.(v);
  };

  const onLayerPointerDown = (e, layer) => {
    e.stopPropagation();
    e.preventDefault();
    const t = getT(layer);
    ia.current = {
      type: "drag",
      layer,
      startMX: e.clientX,
      startMY: e.clientY,
      startX: t.x,
      startY: t.y,
      startScale: t.scale,
    };
    setActiveLayer(layer);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onHandlePointerDown = (e, type, layer) => {
    e.stopPropagation();
    e.preventDefault();
    const t = getT(layer);
    ia.current = {
      type,
      layer,
      startMX: e.clientX,
      startMY: e.clientY,
      startX: t.x,
      startY: t.y,
      startScale: t.scale,
    };
    setActiveLayer(layer);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    const i = ia.current;
    if (!i.type || !i.layer) return;
    const t = { ...getT(i.layer) };

    if (i.type === "drag") {
      t.x = i.startX + (e.clientX - i.startMX);
      t.y = i.startY + (e.clientY - i.startMY);
    }

    if (i.type === "scale") {
      const d = (e.clientX - i.startMX + (e.clientY - i.startMY)) / 150;
      t.scale = Math.max(0.1, i.startScale + d);
    }

    setT(i.layer, t);
  };

  const onPointerUp = () => {
    ia.current.type = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const brickFaceStyle = {
    backgroundColor: woodColor || "#d4a574",
    backgroundImage: `repeating-linear-gradient(88deg, transparent 0px, transparent 18px, rgba(0,0,0,0.025) 18px, rgba(0,0,0,0.025) 19px), repeating-linear-gradient(92deg, transparent 0px, transparent 30px, rgba(0,0,0,0.015) 30px, rgba(0,0,0,0.015) 31px)`,
  };

  const hasText = !!text;
  const hasImage = !!uploadedImageUrl;

  return (
    <div
      className="flex flex-col bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <span className="font-semibold text-gray-800 text-sm tracking-tight">
          ✏️ Edit Position
        </span>
        <button
          onClick={onClose}
          className="px-5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-700 transition-colors"
        >
          ✓ OK
        </button>
      </div>

      {/* Layer Toggle */}
      {(hasText || hasImage) && (
        <div className="flex gap-2 px-4 py-3 border-b border-gray-100">
          {hasText && (
            <button
              onClick={() => setActiveLayer("text")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${activeLayer === "text" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              T Text
            </button>
          )}
          {hasImage && (
            <button
              onClick={() => setActiveLayer("image")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${activeLayer === "image" ? "bg-purple-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              🖼 Image
            </button>
          )}
        </div>
      )}

      {/* 2D Brick Canvas */}
      <div
        className="flex items-center justify-center"
        style={{ background: "#f0f0f0", padding: "28px 20px 20px" }}
      >
        <div
          className="relative"
          style={{ width: brickSurface.w + 16, paddingTop: 14 }}
        >
          {/* Brick Face */}
          <div
            ref={brickRef}
            className="relative rounded"
            style={{
              width: brickSurface.w,
              height: brickSurface.h,
              ...brickFaceStyle,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              overflow: "hidden",   /* clip everything to brick size */
            }}
          >
            {/* Image Layer */}
            {hasImage && (
              <Layer2D
                layerRef={imageRef}
                transform={imageTransform}
                isActive={activeLayer === "image"}
                accentColor="#7c3aed"
                onLayerPointerDown={(e) => onLayerPointerDown(e, "image")}
                onMoveHandle={(e) => onHandlePointerDown(e, "drag", "image")}
                onScaleHandle={(e) => onHandlePointerDown(e, "scale", "image")}
                onDelete={() => onImageTransformChange?.({ x: 0, y: 0, scale: 1 })}
              >
                <img
                  src={uploadedImageUrl}
                  alt="layer"
                  draggable={false}
                  style={{
                    width: 70,
                    height: 55,
                    objectFit: "contain",
                    display: "block",
                    filter: "sepia(0.25) contrast(1.1) brightness(0.92)",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </Layer2D>
            )}
            {/* Text Layer */}
            {hasText && (
              <Layer2D
                layerRef={textRef}
                transform={textTransform}
                isActive={activeLayer === "text"}
                accentColor="#2563eb"
                onLayerPointerDown={(e) => onLayerPointerDown(e, "text")}
                onMoveHandle={(e) => onHandlePointerDown(e, "drag", "text")}
                onScaleHandle={(e) => onHandlePointerDown(e, "scale", "text")}
                onDelete={() => onTextTransformChange?.({ x: 0, y: 0, scale: 1 })}
              >
                <span
                  style={{
                    fontFamily: fontFamily || "Georgia, serif",
                    fontStyle: fontStyle || "normal",
                    fontWeight: fontWeight || "normal",
                    color: textColor || "#4c3328",
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    display: "block",
                    pointerEvents: "none",
                    userSelect: "none",
                    textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {text}
                </span>
              </Layer2D>
            )}
            {!hasText && !hasImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-gray-400 italic">
                  Add text or image to position
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sliders + Reset — wide range for free calibration */}
      {activeLayer && (
        <div className="px-4 pb-4 pt-2 space-y-3">
          <>
            <SliderControl
              label="⬅ Left / Right ➡"
              value={getT(activeLayer).x}
              min={-brickSurface.w}
              max={brickSurface.w}
              step={1}
              color={activeLayer === "text" ? "#2563eb" : "#7c3aed"}
              displayVal={Math.round(getT(activeLayer).x)}
              onChange={(v) => setT(activeLayer, { ...getT(activeLayer), x: v })}
            />
            <SliderControl
              label="⬆ Up / Down ⬇"
              value={getT(activeLayer).y}
              min={-brickSurface.h}
              max={brickSurface.h}
              step={1}
              color={activeLayer === "text" ? "#2563eb" : "#7c3aed"}
              displayVal={Math.round(getT(activeLayer).y)}
              onChange={(v) => setT(activeLayer, { ...getT(activeLayer), y: v })}
            />
            <SliderControl
              label="⤡ Size"
              value={getT(activeLayer).scale}
              min={0.1}
              max={5}
              step={0.05}
              color={activeLayer === "text" ? "#2563eb" : "#7c3aed"}
              displayVal={getT(activeLayer).scale.toFixed(2) + "×"}
              onChange={(v) => setT(activeLayer, { ...getT(activeLayer), scale: v })}
            />
          </>
          <button
            onClick={() => setT(activeLayer, { x: 0, y: 0, scale: 1 })}
            className="w-full mt-1 py-2 text-xs text-gray-400 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Reset {activeLayer === "text" ? "Text" : "Image"}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// map 2D editor transform → 3D position/scale
// ============================================================================
function transform2DTo3D(transform2D, brickType, layerType) {
  // 2D preview brick surface dimensions (px)
  const brickSurface = {
    "2x4-plus": { w: 300, h: 150 },
    "2x2-plus": { w: 150, h: 150 },
    "2x4-standard": { w: 300, h: 150 },
  }[brickType] || { w: 300, h: 150 };

  // ── The 3D brick face centre position in scene units
  // X = depth axis (into screen), Y = up/down, Z = left/right
  const faceCenter = {
    "2x4-plus": [16, 9.8, 1],
    "2x2-plus": [16, 9.8, 5],
    "2x4-standard": [8, 4.8, 2],
  }[brickType] || [16, 9.8, 1];

  // ── The 3D brick face half-size in scene units (Y=height, Z=width)
  // These define the hard boundary — content must stay within these
  // Images get more space, text gets tighter bounds
  const faceHalfByType = {
    image: {
      "2x4-plus": { y: 9.0, z: 22.0 },
      "2x2-plus": { y: 5.0, z: 10.5 },
      "2x4-standard": { y: 2.8, z: 8.0 },
    },
    text: {
      "2x4-plus": { y: 5.0, z: 21.0 },
      "2x2-plus": { y: 5.0, z: 8.5 },
      "2x4-standard": { y: 2.8, z: 6.5 },
    }
  };
  const faceHalf = faceHalfByType[layerType]?.[brickType] || { y: 5.0, z: 17.0 };

  // Natural (unscaled) element size in 2D pixels
  const naturalW = layerType === "image" ? 70 : 100;
  const naturalH = layerType === "image" ? 55 : 24;

  // ── Map 2D pixel offset → 3D scene units (linear scale)
  // 2D x → 3D Z (left/right), 2D y → 3D Y (up/down), both inverted
  const pxPerUnitZ = brickSurface.w / (faceHalf.z * 2);
  const pxPerUnitY = brickSurface.h / (faceHalf.y * 2);

  const rawZ = -(transform2D.x / pxPerUnitZ);
  const rawY = -(transform2D.y / pxPerUnitY);

  // ── Determine maximum allowed scale so the element cannot grow beyond the face
  // pxPerUnitZ = pixels per 3D unit along the Z (width) axis, so
  // maxScaleZ where naturalW * maxScaleZ == brickSurface.w  -> maxScaleZ = brickSurface.w / naturalW
  const maxScaleZ = brickSurface.w / naturalW;
  const maxScaleY = brickSurface.h / naturalH;
  const maxAllowedScale = Math.max(0.01, Math.min(maxScaleZ, maxScaleY));

  // clamp the requested scale so the element never visually exceeds the brick face
  const clampedScale = Math.min(transform2D.scale, maxAllowedScale);

  // ── Element half-size in 3D units at clamped scale
  const elemHalfZ = (naturalW * clampedScale) / (2 * pxPerUnitZ);
  const elemHalfY = (naturalH * clampedScale) / (2 * pxPerUnitY);

  // ── Clamp position so element stays within face bounds (taking clamped size into account)
  const maxZ = Math.max(0, faceHalf.z - elemHalfZ);
  const maxY = Math.max(0, faceHalf.y - elemHalfY);
  const clampedZ = Math.max(-maxZ, Math.min(maxZ, rawZ));
  const clampedY = Math.max(-maxY, Math.min(maxY, rawY));

  const position3D = [
    faceCenter[0],
    faceCenter[1] + clampedY,
    faceCenter[2] + clampedZ,
  ];

  const scale3D = [clampedScale, clampedScale, clampedScale];

  // Map clamped 3D back to 2D pixel-space so texture generation uses same bounds
  const clamped2D = {
    x: -clampedZ * pxPerUnitZ,
    y: -clampedY * pxPerUnitY,
    scale: clampedScale,
  };

  console.log(
    `%c[3D Mapping] layer=${layerType} brickType=${brickType}`,
    "color:#10b981;font-weight:bold",
    `\n  2D  → x=${transform2D.x.toFixed(1)} y=${transform2D.y.toFixed(1)} scale=${transform2D.scale.toFixed(3)}`,
    `\n  3D  → X=${position3D[0].toFixed(3)} Y=${position3D[1].toFixed(3)} Z=${position3D[2].toFixed(3)} scale=${scale3D[0].toFixed(3)}`,
    `\n  faceCenter=[${faceCenter}]  faceHalf y=${faceHalf.y} z=${faceHalf.z}`,
    `\n  elemHalf  y=${elemHalfY.toFixed(3)} z=${elemHalfZ.toFixed(3)}  maxY=${maxY.toFixed(3)} maxZ=${maxZ.toFixed(3)} clampedScale=${clampedScale.toFixed(3)}`
  );

  return { position3D, scale3D, clamped2D };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function EngravedBrickCustomizer() {
  const getProductIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("product_id") || "16";
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
  const [showPreviewEditor, setShowPreviewEditor] = useState(false);
  const prevZoomRef = useRef(null);

  // ── 2D editor transforms
  const [textTransform2D, setTextTransform2D] = useState({ x: 0, y: 0, scale: 1 });
  const [imageTransform2D, setImageTransform2D] = useState({ x: 0, y: 0, scale: 1 });

  // ── Derived 3D positions from 2D transforms
  const { position3D: textPosition3D, scale3D: textScale3D, clamped2D: textClamped2D } = transform2DTo3D(
    textTransform2D, brickType, "text",
  );
  const { position3D: imagePosition3D, scale3D: imageScale3D, clamped2D: imageClamped2D } = transform2DTo3D(
    imageTransform2D, brickType, "image",
  );

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/product/${productId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch product data");
        const result = await response.json();
        if (result.success && result.data) {
          setProductData(result.data);
          setTemplateData(result.predefined_template);
        } else throw new Error("Invalid API response");
        setLoading(false);
      } catch (err) {
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
      setUploadedImageUrl(URL.createObjectURL(file));
    }
  };

  const handleClipartSelect = (svgPath) => {
    setUploadedImageUrl(svgToEngravingDataURL(svgPath));
    setUploadedFile("clipart");
    setShowClipart(false);
  };

  const handleTemplateSelect = (templateId) => {
    const template = templateData.find((t) => t.id === templateId);
    if (!template) return;
    setSelectedTemplate(templateId);
    const isCustomTemplate =
      template.category === "Custom" ||
      template.name === "Custom" ||
      template.id === 52 ||
      (template.template.text === "" && template.img_url === "");
    if (isCustomTemplate) {
      setText("");
      clearImage();
    } else {
      setText(template.template.text || "");
      if (template.img_url && template.img_url !== "") {
        setUploadedImageUrl(template.img_url);
        setUploadedFile("template-image");
      } else clearImage();
    }
    setShowTemplates(false);
  };

  const clearImage = () => {
    setUploadedFile(null);
    if (uploadedImageUrl && !uploadedImageUrl.startsWith("data:"))
      URL.revokeObjectURL(uploadedImageUrl);
    setUploadedImageUrl(null);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(2, prev + 0.1));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.1));
  const handleReset = () => {
    clearImage();
    setText("");
    setSelectedTemplate(null);
    setTextTransform2D({ x: 0, y: 0, scale: 1 });
    setImageTransform2D({ x: 0, y: 0, scale: 1 });
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

  const price = productData?.price ? parseFloat(productData.price) : 19.99;
  const total = (price * quantity).toFixed(2);

  const captureScreenshot = async () => {
    return new Promise((resolve) => {
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        resolve(null);
        return;
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            const dataURL = canvas.toDataURL("image/png", 0.95);
            canvas.toBlob(
              (blob) => {
                if (blob) resolve({ blob, dataURL });
                else resolve(null);
              },
              "image/png",
              0.95,
            );
          } catch (error) {
            resolve(null);
          }
        });
      });
    });
  };

  const addToCart = async (event) => {
    event.preventDefault();
    try {
      const button = event.target;
      button.disabled = true;
      button.textContent = "Adding to cart...";
      const loadingToast = toast.loading(
        "Capturing preview and adding to cart...",
      );
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
      formData.append("text_transform_2d", JSON.stringify(textTransform2D));
      formData.append("image_transform_2d", JSON.stringify(imageTransform2D));
      formData.append("brick_screenshot", screenshot.blob, "brick-preview.png");
      if (uploadedImageUrl && uploadedFile !== "clipart") {
        const response = await fetch(uploadedImageUrl);
        const blob = await response.blob();
        formData.append("image", blob, uploadedFile);
        formData.append("image_type", "upload");
      } else if (uploadedFile === "clipart") {
        formData.append("clipart", uploadedImageUrl);
        formData.append("image_type", "clipart");
      }
      const apiResponse = await fetch(
        "https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/submit",
        { method: "POST", body: formData },
      );
      if (!apiResponse.ok)
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      const result = await apiResponse.json();
      if (result.success) {
        toast.update(loadingToast, {
          render: "Successfully added to cart! 🎉",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => {
          if (result?.redirect_url) window.location.href = result.redirect_url;
        }, 2000);
      } else throw new Error(result.message || "Failed to add to cart");
    } catch (error) {
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
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Error Loading Product
          </h2>
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
            <p className="text-gray-600">
              Customize your wooden brick with carved laser engraving
            </p>
            <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
              ✨ All designs automatically converted to 3D carved engraving style
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── CENTER: 3D Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Controls */}
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 flex-wrap">
                  <button
                    onClick={handleZoomIn}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom In</span>
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    <ZoomOut className="w-4 h-4" />
                    <span>Zoom Out</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    <Undo className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  {/* ── Edit Position Button */}
                  <button
                    onClick={() => setShowPreviewEditor(true)}
                    className="flex items-center gap-1 px-4 py-2 border-2 border-blue-600 bg-blue-50 text-blue-700 rounded font-medium text-sm ml-auto hover:bg-blue-100 transition-colors"
                  >
                    <Move className="w-4 h-4" />
                    <span>Edit Position</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>

                {/* 3D Canvas */}
                <div
                  className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
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
                      textPosition={textPosition3D}
                      imagePosition={imagePosition3D}
                      textScale={textScale3D}
                      imageScale={imageScale3D}
                      textTransform2D={textClamped2D}
                      imageTransform2D={imageClamped2D}
                    />
                  </Canvas>
                  {isFullscreen && (
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 left-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100"
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
                      const isCustom =
                        template.category === "Custom" ||
                        template.name === "Custom";
                      return (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${selectedTemplate === template.id ? "border-blue-600 bg-blue-50 shadow-lg" : isCustom ? "border-dashed border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"}`}
                        >
                          {isCustom && (
                            <div className="flex items-center justify-center h-32 mb-3">
                              <div className="text-center text-gray-400">
                                <svg
                                  className="w-12 h-12 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                <div className="text-sm font-medium">
                                  Start from scratch
                                </div>
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
                                  e.target.parentElement.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div className="font-semibold text-sm mb-1">
                            {template.name}
                          </div>
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

            {/* ── RIGHT SIDEBAR */}
            <div className="lg:col-span-1 space-y-4">
              {/* ── 2D Preview Editor Panel */}
              {showPreviewEditor && (
                <BrickPreviewEditor
                  text={text}
                  uploadedImageUrl={uploadedImageUrl}
                  fontFamily={fontFamily}
                  fontStyle={fontStyle}
                  fontWeight={fontWeight}
                  textColor={textColor}
                  woodColor={woodColor}
                  brickType={brickType}
                  textTransform={textTransform2D}
                  imageTransform={imageTransform2D}
                  onTextTransformChange={setTextTransform2D}
                  onImageTransformChange={setImageTransform2D}
                  onClose={() => {
                    setShowPreviewEditor(false);
                    toast.success("Position saved!", {
                      position: "top-right",
                      autoClose: 1500,
                    });
                  }}
                />
              )}

              {/* ── Text Panel */}
              {!showPreviewEditor && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold mb-3 text-lg">
                    Text (Carved Engraving)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Custom Text
                      </label>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {text.length} characters
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Font
                      </label>
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
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Style
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setFontWeight(
                              fontWeight === "bold" ? "normal" : "bold",
                            )
                          }
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm font-bold transition-colors ${fontWeight === "bold" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
                        >
                          B
                        </button>
                        <button
                          onClick={() =>
                            setFontStyle(
                              fontStyle === "italic" ? "normal" : "italic",
                            )
                          }
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm italic transition-colors ${fontStyle === "italic" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
                        >
                          I
                        </button>
                      </div>
                    </div>
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
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
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
                </div>
              )}

              {/* ── Uploaded Image Panel */}
              {uploadedImageUrl && !showPreviewEditor && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Uploaded Image</span>
                    <button
                      onClick={clearImage}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    className="w-full rounded border border-gray-200 mb-3"
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 block">
                      Image Fit Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setImageMode("contain")}
                        className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "contain" ? "border-blue-600 bg-blue-50 font-medium text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
                      >
                        Fit
                      </button>
                      <button
                        onClick={() => setImageMode("cover")}
                        className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "cover" ? "border-blue-600 bg-blue-50 font-medium text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
                      >
                        Fill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Clipart Library */}
              {showClipart && !showPreviewEditor && (
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
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {category.category}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleClipartSelect(item.svg)}
                            className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
                            title={item.name}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="w-full h-12"
                              fill="#000"
                            >
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

          {/* ── Bottom Bar */}
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
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-full sm:w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
                  <div className="text-center sm:text-right">
                    <div className="text-2xl font-bold">${total}</div>
                    <div className="text-xs text-gray-500">
                      {productData?.name || "3D Model"}
                    </div>
                  </div>
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
