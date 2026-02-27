// // @ts-nocheck
// import React, { useState, Suspense, useRef, useEffect } from "react";
// import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
// import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
// import * as THREE from "three";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
//   Undo,
//   Maximize2,
//   Image as ImageIcon,
// } from "lucide-react";

// // ============================================================================
// // PREDEFINED TEMPLATES
// // ============================================================================
// const TEMPLATES = {
//   businessCard: {
//     id: "business-card",
//     name: "Business Card",
//     category: "Business",
//     template: {
//       text: "JOHN DOE\nCEO & Founder\njohn@company.com\n+1 (555) 123-4567",
//       layout: "centered",
//     },
//   },
//   wedding: {
//     id: "wedding",
//     name: "Wedding Brick",
//     category: "Events",
//     template: {
//       text: "Sarah & Michael\nJune 15, 2024\nForever Starts Today",
//       layout: "centered",
//     },
//   },
//   saveTheDate: {
//     id: "save-the-date",
//     name: "Save The Date",
//     category: "Events",
//     template: {
//       text: "SAVE THE DATE\nEmily & James\nOctober 20, 2024",
//       layout: "centered",
//     },
//   },
//   anniversary: {
//     id: "anniversary",
//     name: "Anniversary",
//     category: "Personal",
//     template: {
//       text: "Celebrating\n25 Years\nTogether Forever",
//       layout: "centered",
//     },
//   },
//   memorial: {
//     id: "memorial",
//     name: "Memorial",
//     category: "Personal",
//     template: {
//       text: "In Loving Memory\nJohn Smith\n1950 - 2024",
//       layout: "centered",
//     },
//   },
//   custom: {
//     id: "custom",
//     name: "Custom Design",
//     category: "Custom",
//     template: {
//       text: "",
//       layout: "centered",
//     },
//   },
// };

// // ============================================================================
// // CLIP-ART LIBRARY
// // ============================================================================
// const CLIPART_LIBRARY = {
//   hearts: {
//     id: "hearts",
//     category: "Romance",
//     items: [
//       {
//         id: "heart-1",
//         name: "Heart",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
//       },
//       {
//         id: "heart-2",
//         name: "Double Hearts",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09M16 4.5c1.74 0 3.41.81 4.5 2.09 1.08 1.28 1.5 2.91 1.5 4.91",
//       },
//     ],
//   },
//   rings: {
//     id: "rings",
//     category: "Wedding",
//     items: [
//       {
//         id: "rings-1",
//         name: "Wedding Rings",
//         svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M16 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
//       },
//       {
//         id: "rings-2",
//         name: "Diamond Ring",
//         svg: "M12 2L4 9l8 13 8-13-8-7zm0 3.5L15.5 9h-7L12 5.5z",
//       },
//     ],
//   },
//   flowers: {
//     id: "flowers",
//     category: "Nature",
//     items: [
//       {
//         id: "flower-1",
//         name: "Rose",
//         svg: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
//       },
//       {
//         id: "flower-2",
//         name: "Tulip",
//         svg: "M12 2C8.5 2 6 4.5 6 8c0 3 2 5.5 4.5 6.5V22h3v-7.5C16 13.5 18 11 18 8c0-3.5-2.5-6-6-6z",
//       },
//     ],
//   },
//   crosses: {
//     id: "crosses",
//     category: "Religious",
//     items: [
//       {
//         id: "cross-1",
//         name: "Simple Cross",
//         svg: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z",
//       },
//       {
//         id: "cross-2",
//         name: "Ornate Cross",
//         svg: "M12 2L10 6h4l-2-4zm0 20l2-4h-4l2 4zM2 12l4-2v4l-4-2zm20 0l-4 2v-4l4 2z M11 7h2v10h-2z M7 11h10v2H7z",
//       },
//     ],
//   },
//   stars: {
//     id: "stars",
//     category: "Decorative",
//     items: [
//       {
//         id: "star-1",
//         name: "Star",
//         svg: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
//       },
//       {
//         id: "star-2",
//         name: "Sparkle",
//         svg: "M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5L12 1z",
//       },
//     ],
//   },
//   doves: {
//     id: "doves",
//     category: "Birds",
//     items: [
//       {
//         id: "dove-1",
//         name: "Dove",
//         svg: "M12 3c-4.97 0-9 4.03-9 9 0 3.38 1.87 6.32 4.63 7.87L6 22l6-4 6 4-1.63-2.13C19.13 18.32 21 15.38 21 12c0-4.97-4.03-9-9-9z M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
//       },
//     ],
//   },
//   butterflies: {
//     id: "butterflies",
//     category: "Nature",
//     items: [
//       {
//         id: "butterfly-1",
//         name: "Butterfly",
//         svg: "M12 2C9.24 2 7 4.24 7 7c0 1.44.62 2.74 1.6 3.65L7 13l5 3 5-3-1.6-2.35C16.38 9.74 17 8.44 17 7c0-2.76-2.24-5-5-5z M12 22l-3-5h6l-3 5z",
//       },
//     ],
//   },
// };

// // ============================================================================
// // BURGUNDY ENGRAVING CONVERTER
// // ============================================================================
// async function applyBurgundyEngravingEffect(imageSrc, textColor = "#4c3328") {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");

//       // Draw original image
//       ctx.drawImage(img, 0, 0);

//       // Get image data
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       // Convert hex color to RGB
//       const hex = textColor.replace("#", "");
//       const burgundyR = parseInt(hex.substring(0, 2), 16);
//       const burgundyG = parseInt(hex.substring(2, 4), 16);
//       const burgundyB = parseInt(hex.substring(4, 6), 16);

//       // Convert to burgundy engraving effect
//       for (let i = 0; i < data.length; i += 4) {
//         const r = data[i];
//         const g = data[i + 1];
//         const b = data[i + 2];
//         const alpha = data[i + 3];

//         // Calculate grayscale value
//         const gray = (r + g + b) / 3;

//         // Invert for engraving effect (darker areas = more engraving)
//         const intensity = 1 - gray / 255;

//         // Apply burgundy color based on intensity
//         data[i] = burgundyR * intensity; // R
//         data[i + 1] = burgundyG * intensity; // G
//         data[i + 2] = burgundyB * intensity; // B
//         data[i + 3] = alpha * intensity; // A
//       }

//       ctx.putImageData(imageData, 0, 0);
//       resolve(canvas.toDataURL());
//     };

//     img.onerror = reject;
//     img.src = imageSrc;
//   });
// }

// // Convert SVG clipart to burgundy engraving
// function svgToBurgundyDataURL(svgPath, textColor = "#4c3328") {
//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200">
//       <path fill="${textColor}" d="${svgPath}"/>
//     </svg>
//   `;
//   return `data:image/svg+xml;base64,${btoa(svg)}`;
// }

// // ============================================================================
// // TEXT TEXTURE WITH BURGUNDY COLOR
// // ============================================================================
// function getLines(ctx, text, maxWidth) {
//   const words = text.split(" ");
//   const lines = [];
//   let currentLine = words[0];

//   for (let i = 1; i < words.length; i++) {
//     const word = words[i];
//     const width = ctx.measureText(currentLine + " " + word).width;
//     if (width < maxWidth) {
//       currentLine += " " + word;
//     } else {
//       lines.push(currentLine);
//       currentLine = word;
//     }
//   }
//   lines.push(currentLine);
//   return lines;
// }

// async function createBurgundyTextTexture(
//   text,
//   fontFamily,
//   fontSize = 140,
//   textColor = "#4c3328",
//   fontStyle = "normal",
//   fontWeight = "normal"
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) {}

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");

//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, baseWidth, baseHeight);

//   ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//   ctx.fillStyle = textColor;
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";

//   const maxWidth = baseWidth * 0.95;
//   const lines = getLines(ctx, text, maxWidth);
//   const lineHeight = fontSize * 1.1;
//   const totalHeight = lines.length * lineHeight;
//   let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//   lines.forEach((line, i) => {
//     ctx.fillText(line, baseWidth / 2, startY + i * lineHeight);
//   });

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.magFilter = THREE.LinearFilter;
//   texture.minFilter = THREE.LinearFilter;
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// async function createCombinedBurgundyTexture(
//   text,
//   fontFamily,
//   fontSize = 140,
//   textColor = "#4c3328",
//   fontStyle = "normal",
//   fontWeight = "normal",
//   imageSrc,
//   imageMode = "contain"
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) {}

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");
//   ctx.scale(dpr, dpr);

//   if (imageSrc) {
//     try {
//       // Apply burgundy engraving effect to image
//       const engravingImage = await applyBurgundyEngravingEffect(
//         imageSrc,
//         textColor
//       );
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       await new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = reject;
//         img.src = engravingImage;
//       });

//       // Calculate aspect ratio and fit/cover image based on mode
//       const imgAspect = img.width / img.height;
//       const canvasAspect = baseWidth / baseHeight;

//       let drawWidth, drawHeight, offsetX, offsetY;

//       if (imageMode === "cover") {
//         // Cover mode - fill entire canvas, may crop image
//         if (imgAspect > canvasAspect) {
//           // Image is wider - fit to height
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         } else {
//           // Image is taller - fit to width
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         }
//       } else {
//         // Contain mode - fit entire image within canvas (default)
//         if (imgAspect > canvasAspect) {
//           // Image is wider than canvas - fit to width
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         } else {
//           // Image is taller than canvas - fit to height
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         }
//       }

//       // Draw image centered and scaled
//       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   if (text) {
//     ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//     ctx.fillStyle = textColor;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     const maxWidth = baseWidth * 0.9;
//     const lines = getLines(ctx, text, maxWidth);
//     const lineHeight = fontSize * 1.1;
//     const totalHeight = lines.length * lineHeight;
//     let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//     lines.forEach((line, i) => {
//       ctx.fillText(line, baseWidth / 2, startY + i * lineHeight);
//     });
//   }

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// // ============================================================================
// // CAMERA CONTROLLER
// // ============================================================================
// function CameraController({ zoom, rotation, reset }) {
//   const { camera } = useThree();
//   const initialPosition = useRef([8, 5, 8]);

//   useEffect(() => {
//     if (reset > 0) {
//       camera.position.set(...initialPosition.current);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [reset, camera]);

//   useEffect(() => {
//     const baseDistance = 13.856;
//     const newDistance = baseDistance / zoom;
//     const direction = camera.position.clone().normalize();
//     camera.position.copy(direction.multiplyScalar(newDistance));
//   }, [zoom, camera]);

//   useEffect(() => {
//     if (rotation !== 0) {
//       const axis = new THREE.Vector3(0, 1, 0);
//       camera.position.applyAxisAngle(axis, rotation);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [rotation, camera]);

//   return null;
// }

// // ============================================================================
// // WOOD TEXTURE CREATOR
// // ============================================================================
// const createWoodTexture = (color) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = 512;
//   canvas.height = 512;
//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = color;
//   ctx.fillRect(0, 0, 512, 512);
//   for (let i = 0; i < 30; i++) {
//     ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
//     ctx.lineWidth = Math.random() * 2;
//     ctx.beginPath();
//     ctx.moveTo(0, Math.random() * 512);
//     ctx.bezierCurveTo(
//       128,
//       Math.random() * 512,
//       384,
//       Math.random() * 512,
//       512,
//       Math.random() * 512
//     );
//     ctx.stroke();
//   }
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(2, 2);
//   return texture;
// };

// // ============================================================================
// // BRICK COMPONENT
// // ============================================================================
// function Brick({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   autoRotate,
// }) {
//   const meshRef = useRef();

//   const brickModelPaths = {
//     "2x2-plus": "/2X2 Plus Size_UVs 1.obj",
//     "2x4-plus": "/2X4 Plus Size_UVs.obj",
//     "2x4-standard": "/2X4 Standard Size_UVs.obj",
//   };

//   const obj = useLoader(OBJLoader, brickModelPaths[brickType]);

//   const [combinedTexture, setCombinedTexture] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     let current = null;

//     if (uploadedImage || text) {
//       createCombinedBurgundyTexture(
//         text || "",
//         fontFamily,
//         150,
//         textColor,
//         fontStyle,
//         fontWeight,
//         uploadedImage,
//         imageMode
//       )
//         .then((tex) => {
//           if (!mounted) {
//             tex.dispose();
//             return;
//           }
//           setCombinedTexture(tex);
//           current = tex;
//         })
//         .catch(() => {});
//     } else {
//       setCombinedTexture(null);
//     }

//     return () => {
//       mounted = false;
//       if (current) {
//         current.dispose();
//       }
//     };
//   }, [
//     uploadedImage,
//     text,
//     fontFamily,
//     textColor,
//     fontStyle,
//     fontWeight,
//     imageMode,
//   ]);

//   useFrame((state) => {
//     if (meshRef.current && autoRotate) {
//       meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
//     }
//   });

//   const brickDimensions = {
//     "2x2-plus": { width: 2, height: 1.2, depth: 2 },
//     "2x4-plus": { width: 4, height: 1.2, depth: 2 },
//     "2x4-standard": { width: 4, height: 1.2, depth: 2 },
//   };
//   const dims = brickDimensions[brickType];

//   const textPlaneConfig = {
//     "2x2-plus": {
//       position: [16, 9.8, dims.depth / 1 + -2],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-plus": {
//       position: [16, 9.8, 0],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-standard": {
//       position: [8, 4.8, dims.depth / 2 + -1],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 7, dims.height * 7],
//     },
//   };
//   const config = textPlaneConfig[brickType];

//   const modelScale = 0.15;
//   const scaleMultiplier =
//     brickType === "2x4-standard" ? 2.0 * modelScale : modelScale;

//   const clonedObj = React.useMemo(() => {
//     const cloned = obj.clone();
//     const woodTexture = createWoodTexture(woodColor);

//     cloned.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: woodColor,
//           roughness: 0.7,
//           metalness: 0.1,
//           map: woodTexture,
//         });
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });

//     return cloned;
//   }, [obj, woodColor]);

//   return (
//     <group ref={meshRef} scale={scaleMultiplier}>
//       <primitive object={clonedObj} />

//       {combinedTexture && (
//         <mesh position={config.position} rotation={config.rotation}>
//           <planeGeometry args={config.planeSize} />
//           <meshStandardMaterial
//             map={combinedTexture}
//             transparent
//             roughness={0.5}
//             metalness={0.0}
//             side={THREE.DoubleSide}
//             depthWrite={false}
//             depthTest={true}
//           />
//         </mesh>
//       )}
//     </group>
//   );
// }

// // ============================================================================
// // SCENE
// // ============================================================================
// function Scene({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   autoRotate,
//   zoom,
//   rotation,
//   reset,
// }) {
//   return (
//     <>
//       <CameraController zoom={zoom} rotation={rotation} reset={reset} />
//       <ambientLight intensity={0.5} />
//       <directionalLight
//         position={[5, 8, 5]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
//       <spotLight
//         position={[-5, 10, 0]}
//         intensity={0.5}
//         angle={0.3}
//         penumbra={1}
//         castShadow
//       />
//       <Suspense fallback={null}>
//         <Brick
//           text={text}
//           brickType={brickType}
//           woodColor={woodColor}
//           uploadedImage={uploadedImage}
//           textColor={textColor}
//           fontFamily={fontFamily}
//           fontStyle={fontStyle}
//           fontWeight={fontWeight}
//           imageMode={imageMode}
//           autoRotate={autoRotate}
//         />
//       </Suspense>
//       <ContactShadows
//         position={[0, -2, 0]}
//         opacity={0.4}
//         scale={15}
//         blur={2}
//         far={4}
//       />
//       <Environment preset="warehouse" />
//       <OrbitControls
//         enablePan={false}
//         enableZoom={true}
//         minDistance={5}
//         maxDistance={25}
//         minPolarAngle={0}
//         maxPolarAngle={Math.PI}
//         minAzimuthAngle={-Infinity}
//         maxAzimuthAngle={Infinity}
//         autoRotate={autoRotate}
//         autoRotateSpeed={0.1}
//         enableRotate={true}
//       />
//     </>
//   );
// }

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================
// export default function EnhancedBrickCustomizer() {
//   const [text, setText] = useState("");
//   const [brickType, setBrickType] = useState("2x4-plus");
//   const [quantity, setQuantity] = useState(1);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//   const [woodColor, setWoodColor] = useState("#d4a574");
//   const [textColor, setTextColor] = useState("#4c3328");
//   const [fontStyle, setFontStyle] = useState("normal");
//   const [fontWeight, setFontWeight] = useState("normal");
//   const [fontFamily, setFontFamily] = useState("Adamina");
//   const [imageMode, setImageMode] = useState("contain"); // "contain" or "cover"
//   const [showTextPanel, setShowTextPanel] = useState(true);
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showClipart, setShowClipart] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [autoRotate, setAutoRotate] = useState(true);
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [resetTrigger, setResetTrigger] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const prevZoomRef = useRef(null);

//   const fontOptions = {
//     Adamina: "Adamina",
//     Aladin: "Aladin",
//     "Amatic SC": "Amatic SC",
//     Amiri: "Amiri",
//     Arimo: "Arimo",
//     Arizonia: "Arizonia",
//     "Berkshire Swash": "Berkshire Swash",
//     Cairo: "Cairo",
//     Condiment: "Condiment",
//     Cookie: "Cookie",
//     Damion: "Damion",
//     "EB Garamond": "EB Garamond",
//     Fondamento: "Fondamento",
//     "Gloria Hallelujah": "Gloria Hallelujah",
//     "Rock Salt": "Rock Salt",
//     Rubik: "Rubik",
//     "Shippori Mincho": "Shippori Mincho",
//     Tinos: "Tinos",
//     "Trail One": "Trail One",
//     "ZCOOL XiaoWei": "ZCOOL XiaoWei",
//     Roboto: "Roboto",
//     "Open Sans": "Open Sans",
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadedFile(file.name);
//       const imageUrl = URL.createObjectURL(file);
//       setUploadedImageUrl(imageUrl);
//     }
//   };

//   const handleClipartSelect = (svgPath) => {
//     const dataUrl = svgToBurgundyDataURL(svgPath, textColor);
//     setUploadedImageUrl(dataUrl);
//     setUploadedFile("clipart");
//     setShowClipart(false);
//   };

//   const handleTemplateSelect = (templateKey) => {
//     const template = TEMPLATES[templateKey];
//     setSelectedTemplate(templateKey);
//     setText(template.template.text);
//     setShowTemplates(false);
//   };

//   const clearImage = () => {
//     setUploadedFile(null);
//     if (uploadedImageUrl) {
//       URL.revokeObjectURL(uploadedImageUrl);
//     }
//     setUploadedImageUrl(null);
//   };

//   const handleZoomIn = () => {
//     setZoom((prev) => Math.max(0.5, prev + 0.1));
//   };

//   const handleZoomOut = () => {
//     setZoom((prev) => Math.min(2, prev - 0.1));
//   };

//   const handleRotateLeft = () => {
//     setRotation((prev) => prev - Math.PI / 4);
//   };

//   const handleRotateRight = () => {
//     setRotation((prev) => prev + Math.PI / 4);
//   };

//   const handleReset = () => {
//     setZoom(1);
//     setRotation(0);
//     setResetTrigger((prev) => prev + 1);
//   };

//   const toggleFullscreen = () => {
//     setIsFullscreen((prev) => {
//       const entering = !prev;
//       if (entering) {
//         prevZoomRef.current = zoom;
//         setZoom(Math.max(0.5, zoom * 0.7));
//       } else {
//         if (prevZoomRef.current != null) setZoom(prevZoomRef.current);
//       }
//       return entering;
//     });
//   };

//   const price = 19.99;
//   const total = (price * quantity).toFixed(2);

//   const addToCart = () => {
//     const orderDetails = {
//       brickType,
//       woodColor,
//       text: text || "None",
//       image: uploadedFile || "None",
//       template: selectedTemplate || "custom",
//       quantity,
//       total: total,
//       engravingStyle: "burgundy",
//     };

//     console.log("Order Details:", orderDetails);
//     alert(
//       `Added to cart!\n\nBrick: ${orderDetails.brickType}\nWood Color: ${orderDetails.woodColor}\nTemplate: ${orderDetails.template}\nText: ${orderDetails.text}\nImage: ${orderDetails.image}\nEngraving: Burgundy Style\nQuantity: ${orderDetails.quantity}\nTotal: $${orderDetails.total}`
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-6 pb-32">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Step 2: Upload Artwork</h1>
//           <p className="text-gray-600">
//             Customize your wooden brick with burgundy laser engraving
//           </p>
//           <div className="mt-2 inline-block bg-burgundy-100 text-burgundy-800 px-3 py-1 rounded-full text-sm">
//             ✨ All designs automatically converted to burgundy engraving style
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
//                 <button
//                   onClick={handleZoomIn}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Zoom In"
//                 >
//                   <ZoomIn className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={handleZoomOut}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Zoom Out"
//                 >
//                   <ZoomOut className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={handleRotateLeft}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Rotate Left"
//                 >
//                   <RotateCw className="w-5 h-5 scale-x-[-1]" />
//                 </button>
//                 <button
//                   onClick={handleRotateRight}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Rotate Right"
//                 >
//                   <RotateCw className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={handleReset}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Reset View"
//                 >
//                   <Undo className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setAutoRotate(!autoRotate)}
//                   className={`px-3 py-2 rounded text-sm transition-colors ${
//                     autoRotate
//                       ? "bg-blue-100 text-blue-700"
//                       : "hover:bg-gray-200"
//                   }`}
//                   title="Toggle Auto-Rotate"
//                 >
//                   Auto
//                 </button>
//                 <div className="ml-auto">
//                   <button
//                     onClick={toggleFullscreen}
//                     className="p-2 hover:bg-gray-200 rounded transition-colors"
//                     title="Fullscreen"
//                   >
//                     <Maximize2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div
//                 className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${
//                   isFullscreen ? "fixed inset-0 z-50" : ""
//                 }`}
//                 style={{ height: isFullscreen ? "100vh" : "500px" }}
//               >
//                 <Canvas camera={{ position: [60, 37.5, 60], fov: 45 }} shadows>
//                   <Scene
//                     text={text}
//                     brickType={brickType}
//                     woodColor={woodColor}
//                     uploadedImage={uploadedImageUrl}
//                     textColor={textColor}
//                     fontFamily={fontFamily}
//                     fontStyle={fontStyle}
//                     fontWeight={fontWeight}
//                     imageMode={imageMode}
//                     autoRotate={autoRotate}
//                     zoom={zoom}
//                     rotation={rotation}
//                     reset={resetTrigger}
//                   />
//                 </Canvas>
//                 {isFullscreen && (
//                   <button
//                     onClick={toggleFullscreen}
//                     className="absolute top-4 right-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <Maximize2 className="w-6 h-6" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* TEMPLATES SECTION */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold">📋 Predefined Templates</h3>
//                 <button
//                   onClick={() => setShowTemplates(!showTemplates)}
//                   className="text-sm text-blue-600 hover:text-blue-700"
//                 >
//                   {showTemplates ? "Hide" : "Show"} Templates
//                 </button>
//               </div>

//               {showTemplates && (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {Object.entries(TEMPLATES).map(([key, template]) => (
//                     <button
//                       key={key}
//                       onClick={() => handleTemplateSelect(key)}
//                       className={`p-3 border-2 rounded-lg text-left transition-all hover:border-gray-400 ${
//                         selectedTemplate === key
//                           ? "border-black bg-gray-50"
//                           : "border-gray-300"
//                       }`}
//                     >
//                       <div className="font-medium text-sm">{template.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {template.category}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//               <h3 className="font-semibold mb-3">Brick Size</h3>
//               <div className="grid grid-cols-3 gap-3">
//                 {[
//                   { value: "2x2-plus", label: "2x2 Plus" },
//                   { value: "2x4-plus", label: "2x4 Plus" },
//                   { value: "2x4-standard", label: "2x4 Standard" },
//                 ].map((type) => (
//                   <button
//                     key={type.value}
//                     onClick={() => setBrickType(type.value)}
//                     className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
//                       brickType === type.value
//                         ? "border-black bg-gray-50"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     {type.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//               <h3 className="font-semibold mb-3">Wood Color</h3>
//               <div className="flex gap-3 items-center">
//                 {["#d4a574", "#8b4513", "#deb887", "#cd853f"].map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setWoodColor(color)}
//                     className={`w-12 h-12 rounded-lg border-2 transition-all ${
//                       woodColor === color
//                         ? "border-black scale-110"
//                         : "border-gray-300"
//                     }`}
//                     style={{ backgroundColor: color }}
//                     title={color}
//                   />
//                 ))}
//                 <input
//                   type="color"
//                   value={woodColor}
//                   onChange={(e) => setWoodColor(e.target.value)}
//                   className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
//                   title="Custom color"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {showTextPanel && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Text (Burgundy Engraving)</h3>
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => setShowTextPanel(false)}
//                       className="p-1 hover:bg-gray-100 rounded text-sm"
//                       title="Close"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-1 block">
//                       Custom Text
//                     </label>
//                     <textarea
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       placeholder="Enter text..."
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
//                     />
//                     <div className="text-xs text-gray-500 mt-1">
//                       {text.length} characters
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-2 block">
//                       Font
//                     </label>
//                     <select
//                       value={fontFamily}
//                       onChange={(e) => setFontFamily(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
//                     >
//                       {Object.keys(fontOptions).map((f) => (
//                         <option key={f} value={fontOptions[f]}>
//                           {f}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-2 block">
//                       Style
//                     </label>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setFontWeight(
//                             fontWeight === "bold" ? "normal" : "bold"
//                           )
//                         }
//                         className={`flex-1 px-3 py-2 border rounded text-sm transition-colors ${
//                           fontWeight === "bold"
//                             ? "border-black bg-gray-50"
//                             : "border-gray-300 hover:border-gray-400"
//                         }`}
//                       >
//                         <span className="font-bold">B</span>
//                       </button>
//                       <button
//                         onClick={() =>
//                           setFontStyle(
//                             fontStyle === "italic" ? "normal" : "italic"
//                           )
//                         }
//                         className={`flex-1 px-3 py-2 border rounded text-sm transition-colors ${
//                           fontStyle === "italic"
//                             ? "border-black bg-gray-50"
//                             : "border-gray-300 hover:border-gray-400"
//                         }`}
//                       >
//                         <span className="italic">I</span>
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-2 block">
//                       Engraving Color
//                     </label>
//                     <div className="flex gap-2 items-center">
//                       <button
//                         onClick={() => setTextColor("#4c3328")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#4c3328"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#4c3328" }}
//                         title="Burgundy"
//                       />
//                       <button
//                         onClick={() => setTextColor("#654321")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#654321"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#654321" }}
//                         title="Brown"
//                       />
//                       <button
//                         onClick={() => setTextColor("#000000")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#000000"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#000000" }}
//                         title="Black"
//                       />
//                       <button
//                         onClick={() => setTextColor("#ffffff")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#ffffff"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#ffffff" }}
//                         title="White"
//                       />
//                       <input
//                         type="color"
//                         value={textColor}
//                         onChange={(e) => setTextColor(e.target.value)}
//                         className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
//                         title="Custom color"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6 space-y-2">
//                   <button
//                     onClick={() => setText("")}
//                     className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     Clear Text
//                   </button>
//                   <button
//                     onClick={() => setShowClipart(!showClipart)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <ImageIcon className="w-4 h-4" />
//                     Browse Clip-Art Library
//                   </button>
//                   <button
//                     onClick={() => document.getElementById("fileInput").click()}
//                     className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     ⊕ Upload Custom Image
//                   </button>
//                   <input
//                     id="fileInput"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                   <p className="text-xs text-gray-500 text-center">
//                     All images auto-converted to burgundy engraving
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* CLIPART LIBRARY */}
//             {showClipart && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-h-96 overflow-y-auto">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-semibold">🎨 Clip-Art Library</h3>
//                   <button
//                     onClick={() => setShowClipart(false)}
//                     className="text-sm text-gray-600 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {Object.entries(CLIPART_LIBRARY).map(([key, category]) => (
//                   <div key={key} className="mb-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">
//                       {category.category}
//                     </h4>
//                     <div className="grid grid-cols-3 gap-2">
//                       {category.items.map((item) => (
//                         <button
//                           key={item.id}
//                           onClick={() => handleClipartSelect(item.svg)}
//                           className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
//                           title={item.name}
//                         >
//                           <svg
//                             viewBox="0 0 24 24"
//                             className="w-full h-12"
//                             fill={textColor}
//                           >
//                             <path d={item.svg} />
//                           </svg>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {!showTextPanel && (
//               <button
//                 onClick={() => setShowTextPanel(true)}
//                 className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:bg-gray-50 transition-colors"
//               >
//                 <span className="font-semibold">+ Add Text Panel</span>
//               </button>
//             )}

//             {uploadedImageUrl && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium">
//                     Uploaded Image (Burgundy Engraving)
//                   </span>
//                   <button
//                     onClick={clearImage}
//                     className="text-sm text-red-600 hover:text-red-700"
//                   >
//                     Remove
//                   </button>
//                 </div>
//                 <img
//                   src={uploadedImageUrl}
//                   alt="Preview"
//                   className="w-full rounded border border-gray-200 mb-3"
//                 />

//                 <div className="space-y-2">
//                   <label className="text-xs font-medium text-gray-600 block">
//                     Image Fit Mode
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     <button
//                       onClick={() => setImageMode("contain")}
//                       className={`px-3 py-2 border-2 rounded text-sm transition-all ${
//                         imageMode === "contain"
//                           ? "border-black bg-gray-50 font-medium"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       Fit
//                     </button>
//                     <button
//                       onClick={() => setImageMode("cover")}
//                       className={`px-3 py-2 border-2 rounded text-sm transition-all ${
//                         imageMode === "cover"
//                           ? "border-black bg-gray-50 font-medium"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       Fill
//                     </button>
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     {imageMode === "contain"
//                       ? "Fit: Shows entire image, may have empty space"
//                       : "Fill: Covers entire brick, may crop image"}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
//               {/* Quantity Selector */}
//               <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                 <label className="text-sm font-medium">Quantity</label>
//                 <div className="flex items-center border border-gray-300 rounded w-full sm:w-auto">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="px-3 py-1 hover:bg-gray-50"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) =>
//                       setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                     }
//                     className="w-full sm:w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
//                   />
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="px-3 py-1 hover:bg-gray-50"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               {/* Total & Actions */}
//               <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
//                 <div className="text-center sm:text-right">
//                   <div className="text-2xl font-bold">${total}</div>
//                   <div className="text-xs text-gray-500">
//                     Burgundy Engraving
//                   </div>
//                 </div>
//                 <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
//                   {/* <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                       />
//                     </svg>
//                   </button>
//                   <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
//                       />
//                     </svg>
//                   </button> */}
//                   <button
//                     onClick={addToCart}
//                     className="px-8 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 w-full sm:w-auto"
//                   >
//                     Add to cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




















// CODE 2

// @ts-nocheck
// import React, { useState, Suspense, useRef, useEffect } from "react";
// import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
// import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
// import * as THREE from "three";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
//   Undo,
//   Maximize2,
//   Image as ImageIcon,
// } from "lucide-react";

// // ============================================================================
// // PREDEFINED TEMPLATES
// // ============================================================================
// const TEMPLATES = {
//   businessCard: {
//     id: "business-card",
//     name: "Business Card",
//     category: "Business",
//     template: {
//       text: "JOHN DOE\nCEO & Founder\njohn@company.com\n+1 (555) 123-4567",
//       layout: "centered",
//     },
//   },
//   wedding: {
//     id: "wedding",
//     name: "Wedding Brick",
//     category: "Events",
//     template: {
//       text: "Sarah & Michael\nJune 15, 2024\nForever Starts Today",
//       layout: "centered",
//     },
//   },
//   saveTheDate: {
//     id: "save-the-date",
//     name: "Save The Date",
//     category: "Events",
//     template: {
//       text: "SAVE THE DATE\nEmily & James\nOctober 20, 2024",
//       layout: "centered",
//     },
//   },
//   anniversary: {
//     id: "anniversary",
//     name: "Anniversary",
//     category: "Personal",
//     template: {
//       text: "Celebrating\n25 Years\nTogether Forever",
//       layout: "centered",
//     },
//   },
//   memorial: {
//     id: "memorial",
//     name: "Memorial",
//     category: "Personal",
//     template: {
//       text: "In Loving Memory\nJohn Smith\n1950 - 2024",
//       layout: "centered",
//     },
//   },
//   custom: {
//     id: "custom",
//     name: "Custom Design",
//     category: "Custom",
//     template: {
//       text: "",
//       layout: "centered",
//     },
//   },
// };

// // ============================================================================
// // CLIP-ART LIBRARY
// // ============================================================================
// const CLIPART_LIBRARY = {
//   hearts: {
//     id: "hearts",
//     category: "Romance",
//     items: [
//       {
//         id: "heart-1",
//         name: "Heart",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
//       },
//       {
//         id: "heart-2",
//         name: "Double Hearts",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09M16 4.5c1.74 0 3.41.81 4.5 2.09 1.08 1.28 1.5 2.91 1.5 4.91",
//       },
//     ],
//   },
//   rings: {
//     id: "rings",
//     category: "Wedding",
//     items: [
//       {
//         id: "rings-1",
//         name: "Wedding Rings",
//         svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M16 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
//       },
//       {
//         id: "rings-2",
//         name: "Diamond Ring",
//         svg: "M12 2L4 9l8 13 8-13-8-7zm0 3.5L15.5 9h-7L12 5.5z",
//       },
//     ],
//   },
//   flowers: {
//     id: "flowers",
//     category: "Nature",
//     items: [
//       {
//         id: "flower-1",
//         name: "Rose",
//         svg: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
//       },
//       {
//         id: "flower-2",
//         name: "Tulip",
//         svg: "M12 2C8.5 2 6 4.5 6 8c0 3 2 5.5 4.5 6.5V22h3v-7.5C16 13.5 18 11 18 8c0-3.5-2.5-6-6-6z",
//       },
//     ],
//   },
//   crosses: {
//     id: "crosses",
//     category: "Religious",
//     items: [
//       {
//         id: "cross-1",
//         name: "Simple Cross",
//         svg: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z",
//       },
//       {
//         id: "cross-2",
//         name: "Ornate Cross",
//         svg: "M12 2L10 6h4l-2-4zm0 20l2-4h-4l2 4zM2 12l4-2v4l-4-2zm20 0l-4 2v-4l4 2z M11 7h2v10h-2z M7 11h10v2H7z",
//       },
//     ],
//   },
//   stars: {
//     id: "stars",
//     category: "Decorative",
//     items: [
//       {
//         id: "star-1",
//         name: "Star",
//         svg: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
//       },
//       {
//         id: "star-2",
//         name: "Sparkle",
//         svg: "M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5L12 1z",
//       },
//     ],
//   },
//   doves: {
//     id: "doves",
//     category: "Birds",
//     items: [
//       {
//         id: "dove-1",
//         name: "Dove",
//         svg: "M12 3c-4.97 0-9 4.03-9 9 0 3.38 1.87 6.32 4.63 7.87L6 22l6-4 6 4-1.63-2.13C19.13 18.32 21 15.38 21 12c0-4.97-4.03-9-9-9z M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
//       },
//     ],
//   },
//   butterflies: {
//     id: "butterflies",
//     category: "Nature",
//     items: [
//       {
//         id: "butterfly-1",
//         name: "Butterfly",
//         svg: "M12 2C9.24 2 7 4.24 7 7c0 1.44.62 2.74 1.6 3.65L7 13l5 3 5-3-1.6-2.35C16.38 9.74 17 8.44 17 7c0-2.76-2.24-5-5-5z M12 22l-3-5h6l-3 5z",
//       },
//     ],
//   },
// };

// // ============================================================================
// // ENGRAVING EFFECT CONVERTER (WOOD-BLENDED LASER ENGRAVING)
// // ============================================================================
// async function applyEngravingEffect(imageSrc, engraveDepth = 0.7) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");

//       // Draw original image
//       ctx.drawImage(img, 0, 0);

//       // Get image data
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       // Create NATURAL wood-blended engraving (like 1st reference image)
//       for (let i = 0; i < data.length; i += 4) {
//         const r = data[i];
//         const g = data[i + 1];
//         const b = data[i + 2];
//         const alpha = data[i + 3];

//         // Calculate grayscale value (luminosity method)
//         const gray = r * 0.299 + g * 0.587 + b * 0.114;

//         // Normalize to 0-1
//         const brightness = gray / 255;

//         // Invert for engraving (dark becomes burned)
//         const darkness = 1 - brightness;

//         // NATURAL WOOD ENGRAVING LOGIC:
//         // - Very light areas (brightness > 0.85) → Fully transparent (wood shows)
//         // - Medium areas (0.3-0.85) → Light brown tones (subtle engraving)
//         // - Dark areas (< 0.3) → Medium brown (deeper engraving)

//         if (brightness > 0.85) {
//           // Very light areas - completely transparent (wood grain visible)
//           data[i + 3] = 0;
//         } else if (brightness > 0.5) {
//           // Light-medium areas - subtle light brown engraving
//           const intensity = (1 - brightness) * engraveDepth;
//           data[i] = Math.floor(160 + darkness * 40); // Light tan/brown
//           data[i + 1] = Math.floor(100 + darkness * 30); //
//           data[i + 2] = Math.floor(90 + darkness * 20); //
//           data[i + 3] = Math.floor(alpha * intensity * 0.6); // Semi-transparent
//         } else if (brightness > 0.2) {
//           // Medium-dark areas - medium brown engraving
//           const intensity = darkness * engraveDepth;
//           data[i] = Math.floor(120 * intensity); // Medium brown
//           data[i + 1] = Math.floor(90 * intensity); //
//           data[i + 2] = Math.floor(30 * intensity); //
//           data[i + 3] = Math.floor(alpha * 0.85); // More visible
//         } else {
//           // Very dark areas - darker brown (deepest engraving)
//           const intensity = darkness * engraveDepth;
//           data[i] = Math.floor(90 * intensity); // Dark brown
//           data[i + 1] = Math.floor(45 * intensity); //
//           data[i + 2] = Math.floor(25 * intensity); //
//           data[i + 3] = alpha; // Fully opaque
//         }
//       }

//       ctx.putImageData(imageData, 0, 0);
//       resolve(canvas.toDataURL());
//     };

//     img.onerror = reject;
//     img.src = imageSrc;
//   });
// }

// // Convert SVG clipart to engraved look
// function svgToEngravingDataURL(svgPath) {
//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200">
//       <path fill="#000000" d="${svgPath}"/>
//     </svg>
//   `;
//   return `data:image/svg+xml;base64,${btoa(svg)}`;
// }

// // ============================================================================
// // TEXT TEXTURE WITH ENGRAVING EFFECT
// // ============================================================================
// function getLines(ctx, text, maxWidth) {
//   const words = text.split(" ");
//   const lines = [];
//   let currentLine = words[0];

//   for (let i = 1; i < words.length; i++) {
//     const word = words[i];
//     const width = ctx.measureText(currentLine + " " + word).width;
//     if (width < maxWidth) {
//       currentLine += " " + word;
//     } else {
//       lines.push(currentLine);
//       currentLine = word;
//     }
//   }
//   lines.push(currentLine);
//   return lines;
// }

// async function createEngravedTextTexture(
//   text,
//   fontFamily,
//   fontSize = 140,
//   fontStyle = "normal",
//   fontWeight = "normal",
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) {}

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");

//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, baseWidth, baseHeight);

//   // Set font
//   ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";

//   const maxWidth = baseWidth * 0.95;
//   const lines = getLines(ctx, text, maxWidth);
//   const lineHeight = fontSize * 1.1;
//   const totalHeight = lines.length * lineHeight;
//   let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//   // CSS-style engraved effect: background-clip text + inverted shadow
//   lines.forEach((line, i) => {
//     const y = startY + i * lineHeight;
//     const x = baseWidth / 2;

//     // CSS text-shadow: 3px 5px 1px rgba(245, 245, 245, 0.5)
//     // This is the HIGHLIGHT/LIGHT shadow (bottom-right)
//     ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
//     ctx.shadowBlur = 1;
//     ctx.shadowOffsetX = 3;
//     ctx.shadowOffsetY = 5;

//     // CSS background-color: #666666 (gray text fill)
//     ctx.fillStyle = "#666666";
//     ctx.fillText(line, x, y);

//     // Reset shadow
//     ctx.shadowColor = "transparent";
//     ctx.shadowBlur = 0;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
//   });

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.magFilter = THREE.LinearFilter;
//   texture.minFilter = THREE.LinearFilter;
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// async function createCombinedEngravingTexture(
//   text,
//   fontFamily,
//   fontSize = 140,
//   fontStyle = "normal",
//   fontWeight = "normal",
//   imageSrc,
//   imageMode = "contain",
//   woodColor = "#d4a574", // Wood color for matching
//   textColor = "#4c3328", // ADDED: User-selected text color
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) {}

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");
//   ctx.scale(dpr, dpr);

//   if (imageSrc) {
//     try {
//       // Apply engraving effect to image
//       const engravingImage = await applyEngravingEffect(imageSrc, 0.9);
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       await new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = reject;
//         img.src = engravingImage;
//       });

//       // Calculate aspect ratio and fit/cover image based on mode
//       const imgAspect = img.width / img.height;
//       const canvasAspect = baseWidth / baseHeight;

//       let drawWidth, drawHeight, offsetX, offsetY;

//       if (imageMode === "cover") {
//         if (imgAspect > canvasAspect) {
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         } else {
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         }
//       } else {
//         if (imgAspect > canvasAspect) {
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         } else {
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         }
//       }

//       // Draw engraved image
//       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   if (text) {
//     ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     const maxWidth = baseWidth * 0.9;
//     const lines = getLines(ctx, text, maxWidth);
//     const lineHeight = fontSize * 1.1;
//     const totalHeight = lines.length * lineHeight;
//     let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//     lines.forEach((line, i) => {
//       const y = startY + i * lineHeight;
//       const x = baseWidth / 2;

//       // Light highlight shadow
//       ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
//       ctx.shadowBlur = 1;
//       ctx.shadowOffsetX = 3;
//       ctx.shadowOffsetY = 5;

//       // USER-SELECTED TEXT COLOR (directly applied)
//       ctx.fillStyle = textColor;
//       ctx.fillText(line, x, y);

//       // Reset shadow
//       ctx.shadowColor = "transparent";
//       ctx.shadowBlur = 0;
//       ctx.shadowOffsetX = 0;
//       ctx.shadowOffsetY = 0;
//     });
//   }

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// // ============================================================================
// // CAMERA CONTROLLER
// // ============================================================================
// function CameraController({ zoom, rotation, reset }) {
//   const { camera } = useThree();
//   const initialPosition = useRef([8, 5, 8]);

//   useEffect(() => {
//     if (reset > 0) {
//       camera.position.set(...initialPosition.current);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [reset, camera]);

//   useEffect(() => {
//     const baseDistance = 13.856;
//     const newDistance = baseDistance / zoom;
//     const direction = camera.position.clone().normalize();
//     camera.position.copy(direction.multiplyScalar(newDistance));
//   }, [zoom, camera]);

//   useEffect(() => {
//     if (rotation !== 0) {
//       const axis = new THREE.Vector3(0, 1, 0);
//       camera.position.applyAxisAngle(axis, rotation);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [rotation, camera]);

//   return null;
// }

// // ============================================================================
// // WOOD TEXTURE CREATOR
// // ============================================================================
// const createWoodTexture = (color) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = 512;
//   canvas.height = 512;
//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = color;
//   ctx.fillRect(0, 0, 512, 512);
//   for (let i = 0; i < 30; i++) {
//     ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
//     ctx.lineWidth = Math.random() * 2;
//     ctx.beginPath();
//     ctx.moveTo(0, Math.random() * 512);
//     ctx.bezierCurveTo(
//       128,
//       Math.random() * 512,
//       384,
//       Math.random() * 512,
//       512,
//       Math.random() * 512,
//     );
//     ctx.stroke();
//   }
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(2, 2);
//   return texture;
// };

// // ============================================================================
// // BRICK COMPONENT
// // ============================================================================
// function Brick({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor, // ADDED: textColor prop
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   autoRotate,
// }) {
//   const meshRef = useRef();

//   const brickModelPaths = {
//     "2x2-plus": "/2X2 Plus Size_UVs 1.obj",
//     "2x4-plus": "/2X4 Plus Size_UVs.obj",
//     "2x4-standard": "/2X4 Standard Size_UVs.obj",
//   };

//   const obj = useLoader(OBJLoader, brickModelPaths[brickType]);

//   const [combinedTexture, setCombinedTexture] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     let current = null;

//     if (uploadedImage || text) {
//       createCombinedEngravingTexture(
//         text || "",
//         fontFamily,
//         150,
//         fontStyle,
//         fontWeight,
//         uploadedImage,
//         imageMode,
//         woodColor, // Wood color
//         textColor, // ADDED: User-selected text color
//       )
//         .then((tex) => {
//           if (!mounted) {
//             tex.dispose();
//             return;
//           }
//           setCombinedTexture(tex);
//           current = tex;
//         })
//         .catch(() => {});
//     } else {
//       setCombinedTexture(null);
//     }

//     return () => {
//       mounted = false;
//       if (current) {
//         current.dispose();
//       }
//     };
//   }, [
//     uploadedImage,
//     text,
//     fontFamily,
//     fontStyle,
//     fontWeight,
//     imageMode,
//     woodColor,
//     textColor, // ADDED: Add to dependencies
//   ]);

//   useFrame((state) => {
//     if (meshRef.current && autoRotate) {
//       meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
//     }
//   });

//   const brickDimensions = {
//     "2x2-plus": { width: 2, height: 1.2, depth: 2 },
//     "2x4-plus": { width: 4, height: 1.2, depth: 2 },
//     "2x4-standard": { width: 4, height: 1.2, depth: 2 },
//   };
//   const dims = brickDimensions[brickType];

//   const textPlaneConfig = {
//     "2x2-plus": {
//       position: [16, 9.8, dims.depth / 1 + -2],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-plus": {
//       position: [16, 9.8, 0],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-standard": {
//       position: [8, 4.8, dims.depth / 2 + -1],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 7, dims.height * 7],
//     },
//   };
//   const config = textPlaneConfig[brickType];

//   const modelScale = 0.15;
//   const scaleMultiplier =
//     brickType === "2x4-standard" ? 2.0 * modelScale : modelScale;

//   const clonedObj = React.useMemo(() => {
//     const cloned = obj.clone();
//     const woodTexture = createWoodTexture(woodColor);

//     cloned.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: woodColor,
//           roughness: 0.7,
//           metalness: 0.1,
//           map: woodTexture,
//         });
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });

//     return cloned;
//   }, [obj, woodColor]);

//   return (
//     <group ref={meshRef} scale={scaleMultiplier}>
//       <primitive object={clonedObj} />

//       {combinedTexture && (
//         <mesh position={config.position} rotation={config.rotation}>
//           <planeGeometry args={config.planeSize} />
//           <meshStandardMaterial
//             map={combinedTexture}
//             transparent
//             alphaTest={0.1}
//             roughness={0.8}
//             metalness={0.0}
//             side={THREE.DoubleSide}
//             depthWrite={true}
//             depthTest={true}
//           />
//         </mesh>
//       )}
//     </group>
//   );
// }

// // ============================================================================
// // SCENE
// // ============================================================================
// function Scene({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor, // ADDED: textColor prop
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   autoRotate,
//   zoom,
//   rotation,
//   reset,
// }) {
//   return (
//     <>
//       <CameraController zoom={zoom} rotation={rotation} reset={reset} />
//       <ambientLight intensity={0.5} />
//       <directionalLight
//         position={[5, 8, 5]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
//       <spotLight
//         position={[-5, 10, 0]}
//         intensity={0.5}
//         angle={0.3}
//         penumbra={1}
//         castShadow
//       />
//       <Suspense fallback={null}>
//         <Brick
//           text={text}
//           brickType={brickType}
//           woodColor={woodColor}
//           uploadedImage={uploadedImage}
//           textColor={textColor} // ADDED: Pass textColor
//           fontFamily={fontFamily}
//           fontStyle={fontStyle}
//           fontWeight={fontWeight}
//           imageMode={imageMode}
//           autoRotate={autoRotate}
//         />
//       </Suspense>
//       <ContactShadows
//         position={[0, -2, 0]}
//         opacity={0.4}
//         scale={15}
//         blur={2}
//         far={4}
//       />
//       <Environment preset="warehouse" />
//       <OrbitControls
//         enablePan={false}
//         enableZoom={true}
//         minDistance={5}
//         maxDistance={25}
//         minPolarAngle={0}
//         maxPolarAngle={Math.PI}
//         minAzimuthAngle={-Infinity}
//         maxAzimuthAngle={Infinity}
//         autoRotate={autoRotate}
//         autoRotateSpeed={0.1}
//         enableRotate={true}
//       />
//     </>
//   );
// }

// // ============================================================================
// // MAIN COMPONENT (UI remains the same, only engraving logic changed)
// // ============================================================================
// export default function EngravedBrickCustomizer() {
//   const [text, setText] = useState("");
//   const [brickType, setBrickType] = useState("2x4-plus");
//   const [quantity, setQuantity] = useState(1);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//   const [woodColor, setWoodColor] = useState("#d4a574");
//   const [fontStyle, setFontStyle] = useState("normal");
//   const [textColor, setTextColor] = useState("#4c3328");
//   const [fontWeight, setFontWeight] = useState("bold");
//   const [fontFamily, setFontFamily] = useState("Adamina");
//   const [imageMode, setImageMode] = useState("contain");
//   const [showTextPanel, setShowTextPanel] = useState(true);
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showClipart, setShowClipart] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [autoRotate, setAutoRotate] = useState(true);
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [resetTrigger, setResetTrigger] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const prevZoomRef = useRef(null);

//   const fontOptions = {
//     Adamina: "Adamina",
//     Aladin: "Aladin",
//     "Amatic SC": "Amatic SC",
//     Amiri: "Amiri",
//     Arimo: "Arimo",
//     Arizonia: "Arizonia",
//     "Berkshire Swash": "Berkshire Swash",
//     Cairo: "Cairo",
//     Condiment: "Condiment",
//     Cookie: "Cookie",
//     Damion: "Damion",
//     "EB Garamond": "EB Garamond",
//     Fondamento: "Fondamento",
//     "Gloria Hallelujah": "Gloria Hallelujah",
//     "Rock Salt": "Rock Salt",
//     Rubik: "Rubik",
//     "Shippori Mincho": "Shippori Mincho",
//     Tinos: "Tinos",
//     "Trail One": "Trail One",
//     "ZCOOL XiaoWei": "ZCOOL XiaoWei",
//     Roboto: "Roboto",
//     "Open Sans": "Open Sans",
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadedFile(file.name);
//       const imageUrl = URL.createObjectURL(file);
//       setUploadedImageUrl(imageUrl);
//     }
//   };

//   const handleClipartSelect = (svgPath) => {
//     const dataUrl = svgToEngravingDataURL(svgPath);
//     setUploadedImageUrl(dataUrl);
//     setUploadedFile("clipart");
//     setShowClipart(false);
//   };

//   const handleTemplateSelect = (templateKey) => {
//     const template = TEMPLATES[templateKey];
//     setSelectedTemplate(templateKey);
//     setText(template.template.text);
//     setShowTemplates(false);
//   };

//   const clearImage = () => {
//     setUploadedFile(null);
//     if (uploadedImageUrl) {
//       URL.revokeObjectURL(uploadedImageUrl);
//     }
//     setUploadedImageUrl(null);
//   };

//   const handleZoomIn = () => {
//     setZoom((prev) => Math.max(0.5, prev + 0.1));
//   };

//   const handleZoomOut = () => {
//     setZoom((prev) => Math.min(2, prev - 0.1));
//   };

//   const handleRotateLeft = () => {
//     setRotation((prev) => prev - Math.PI / 4);
//   };

//   const handleRotateRight = () => {
//     setRotation((prev) => prev + Math.PI / 4);
//   };

//   const handleReset = () => {
//     setZoom(1);
//     setRotation(0);
//     setResetTrigger((prev) => prev + 1);
//   };

//   const toggleFullscreen = () => {
//     setIsFullscreen((prev) => {
//       const entering = !prev;
//       if (entering) {
//         prevZoomRef.current = zoom;
//         setZoom(Math.max(0.5, zoom * 0.7));
//       } else {
//         if (prevZoomRef.current != null) setZoom(prevZoomRef.current);
//       }
//       return entering;
//     });
//   };

//   const price = 19.99;
//   const total = (price * quantity).toFixed(2);

//   const addToCart = () => {
//     const orderDetails = {
//       brickType,
//       woodColor,
//       text: text || "None",
//       image: uploadedFile || "None",
//       template: selectedTemplate || "custom",
//       quantity,
//       total: total,
//       engravingStyle: "carved-engraving",
//     };

//     console.log("Order Details:", orderDetails);
//     alert(
//       `Added to cart!\n\nBrick: ${orderDetails.brickType}\nWood Color: ${orderDetails.woodColor}\nTemplate: ${orderDetails.template}\nText: ${orderDetails.text}\nImage: ${orderDetails.image}\nEngraving: Carved Style\nQuantity: ${orderDetails.quantity}\nTotal: $${orderDetails.total}`,
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-6 pb-32">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Step 2: Upload Artwork</h1>
//           <p className="text-gray-600">
//             Customize your wooden brick with carved laser engraving
//           </p>
//           <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
//             ✨ All designs automatically converted to 3D carved engraving style
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
//                 <button
//                   onClick={handleZoomIn}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Zoom In"
//                 >
//                   <ZoomIn className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={handleZoomOut}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Zoom Out"
//                 >
//                   <ZoomOut className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={handleRotateLeft}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Rotate Left"
//                 >
//                   <RotateCw className="w-5 h-5 scale-x-[-1]" />
//                 </button>
//                 <button
//                   onClick={handleRotateRight}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Rotate Right"
//                 >
//                   <RotateCw className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={handleReset}
//                   className="p-2 hover:bg-gray-200 rounded transition-colors"
//                   title="Reset View"
//                 >
//                   <Undo className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setAutoRotate(!autoRotate)}
//                   className={`px-3 py-2 rounded text-sm transition-colors ${
//                     autoRotate
//                       ? "bg-blue-100 text-blue-700"
//                       : "hover:bg-gray-200"
//                   }`}
//                   title="Toggle Auto-Rotate"
//                 >
//                   Auto
//                 </button>
//                 <div className="ml-auto">
//                   <button
//                     onClick={toggleFullscreen}
//                     className="p-2 hover:bg-gray-200 rounded transition-colors"
//                     title="Fullscreen"
//                   >
//                     <Maximize2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div
//                 className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${
//                   isFullscreen ? "fixed inset-0 z-50" : ""
//                 }`}
//                 style={{ height: isFullscreen ? "100vh" : "500px" }}
//               >
//                 <Canvas camera={{ position: [60, 37.5, 60], fov: 45 }} shadows>
//                   <Scene
//                     text={text}
//                     brickType={brickType}
//                     woodColor={woodColor}
//                     uploadedImage={uploadedImageUrl}
//                     textColor={textColor} // ADDED: Pass textColor
//                     fontFamily={fontFamily}
//                     fontStyle={fontStyle}
//                     fontWeight={fontWeight}
//                     imageMode={imageMode}
//                     autoRotate={autoRotate}
//                     zoom={zoom}
//                     rotation={rotation}
//                     reset={resetTrigger}
//                   />
//                 </Canvas>
//                 {isFullscreen && (
//                   <button
//                     onClick={toggleFullscreen}
//                     className="absolute top-4 right-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <Maximize2 className="w-6 h-6" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* TEMPLATES SECTION */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold">📋 Predefined Templates</h3>
//                 <button
//                   onClick={() => setShowTemplates(!showTemplates)}
//                   className="text-sm text-blue-600 hover:text-blue-700"
//                 >
//                   {showTemplates ? "Hide" : "Show"} Templates
//                 </button>
//               </div>

//               {showTemplates && (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {Object.entries(TEMPLATES).map(([key, template]) => (
//                     <button
//                       key={key}
//                       onClick={() => handleTemplateSelect(key)}
//                       className={`p-3 border-2 rounded-lg text-left transition-all hover:border-gray-400 ${
//                         selectedTemplate === key
//                           ? "border-black bg-gray-50"
//                           : "border-gray-300"
//                       }`}
//                     >
//                       <div className="font-medium text-sm">{template.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {template.category}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//               <h3 className="font-semibold mb-3">Brick Size</h3>
//               <div className="grid grid-cols-3 gap-3">
//                 {[
//                   { value: "2x2-plus", label: "2x2 Plus" },
//                   { value: "2x4-plus", label: "2x4 Plus" },
//                   { value: "2x4-standard", label: "2x4 Standard" },
//                 ].map((type) => (
//                   <button
//                     key={type.value}
//                     onClick={() => setBrickType(type.value)}
//                     className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
//                       brickType === type.value
//                         ? "border-black bg-gray-50"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     {type.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//               <h3 className="font-semibold mb-3">Wood Color</h3>
//               <div className="flex gap-3 items-center">
//                 {["#d4a574", "#8b4513", "#deb887", "#cd853f"].map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setWoodColor(color)}
//                     className={`w-12 h-12 rounded-lg border-2 transition-all ${
//                       woodColor === color
//                         ? "border-black scale-110"
//                         : "border-gray-300"
//                     }`}
//                     style={{ backgroundColor: color }}
//                     title={color}
//                   />
//                 ))}
//                 <input
//                   type="color"
//                   value={woodColor}
//                   onChange={(e) => setWoodColor(e.target.value)}
//                   className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
//                   title="Custom color"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4">
//             {showTextPanel && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold">Text (Carved Engraving)</h3>
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => setShowTextPanel(false)}
//                       className="p-1 hover:bg-gray-100 rounded text-sm"
//                       title="Close"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-1 block">
//                       Custom Text
//                     </label>
//                     <textarea
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       placeholder="Enter text..."
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
//                     />
//                     <div className="text-xs text-gray-500 mt-1">
//                       {text.length} characters
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-2 block">
//                       Font
//                     </label>
//                     <select
//                       value={fontFamily}
//                       onChange={(e) => setFontFamily(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
//                     >
//                       {Object.keys(fontOptions).map((f) => (
//                         <option key={f} value={fontOptions[f]}>
//                           {f}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-2 block">
//                       Style
//                     </label>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setFontWeight(
//                             fontWeight === "bold" ? "normal" : "bold",
//                           )
//                         }
//                         className={`flex-1 px-3 py-2 border rounded text-sm transition-colors ${
//                           fontWeight === "bold"
//                             ? "border-black bg-gray-50"
//                             : "border-gray-300 hover:border-gray-400"
//                         }`}
//                       >
//                         <span className="font-bold">B</span>
//                       </button>
//                       <button
//                         onClick={() =>
//                           setFontStyle(
//                             fontStyle === "italic" ? "normal" : "italic",
//                           )
//                         }
//                         className={`flex-1 px-3 py-2 border rounded text-sm transition-colors ${
//                           fontStyle === "italic"
//                             ? "border-black bg-gray-50"
//                             : "border-gray-300 hover:border-gray-400"
//                         }`}
//                       >
//                         <span className="italic">I</span>
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-xs font-medium text-gray-600 mb-2 block">
//                       Engraving Color
//                     </label>
//                     <div className="flex gap-2 items-center">
//                       <button
//                         onClick={() => setTextColor("#4c3328")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#4c3328"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#4c3328" }}
//                         title="Dark Brown"
//                       />
//                       <button
//                         onClick={() => setTextColor("#654321")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#654321"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#654321" }}
//                         title="Medium Brown"
//                       />
//                       <button
//                         onClick={() => setTextColor("#000000")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#000000"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#000000" }}
//                         title="Black"
//                       />
//                       <button
//                         onClick={() => setTextColor("#ffffff")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#ffffff"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#ffffff" }}
//                         title="White"
//                       />
//                       <button
//                         onClick={() => setTextColor("#8b4513")}
//                         className={`w-10 h-10 rounded border-2 transition-all ${
//                           textColor === "#8b4513"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                         }`}
//                         style={{ backgroundColor: "#8b4513" }}
//                         title="Saddle Brown"
//                       />
//                       <input
//                         type="color"
//                         value={textColor}
//                         onChange={(e) => setTextColor(e.target.value)}
//                         className="w-10 h-10 rounded border-2  cursor-pointer"
//                         title="Custom color"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6 space-y-2">
//                   <button
//                     onClick={() => setText("")}
//                     className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     Clear Text
//                   </button>
//                   <button
//                     onClick={() => setShowClipart(!showClipart)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <ImageIcon className="w-4 h-4" />
//                     Browse Clip-Art Library
//                   </button>
//                   <button
//                     onClick={() => document.getElementById("fileInput").click()}
//                     className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
//                   >
//                     ⊕ Upload Custom Image
//                   </button>
//                   <input
//                     id="fileInput"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                   <p className="text-xs text-gray-500 text-center">
//                     All images auto-converted to carved engraving
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* CLIPART LIBRARY */}
//             {showClipart && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-h-96 overflow-y-auto">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-semibold">🎨 Clip-Art Library</h3>
//                   <button
//                     onClick={() => setShowClipart(false)}
//                     className="text-sm text-gray-600 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {Object.entries(CLIPART_LIBRARY).map(([key, category]) => (
//                   <div key={key} className="mb-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">
//                       {category.category}
//                     </h4>
//                     <div className="grid grid-cols-3 gap-2">
//                       {category.items.map((item) => (
//                         <button
//                           key={item.id}
//                           onClick={() => handleClipartSelect(item.svg)}
//                           className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
//                           title={item.name}
//                         >
//                           <svg
//                             viewBox="0 0 24 24"
//                             className="w-full h-12"
//                             fill="#000"
//                           >
//                             <path d={item.svg} />
//                           </svg>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {!showTextPanel && (
//               <button
//                 onClick={() => setShowTextPanel(true)}
//                 className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:bg-gray-50 transition-colors"
//               >
//                 <span className="font-semibold">+ Add Text Panel</span>
//               </button>
//             )}

//             {uploadedImageUrl && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium">
//                     Uploaded Image (Carved Engraving)
//                   </span>
//                   <button
//                     onClick={clearImage}
//                     className="text-sm text-red-600 hover:text-red-700"
//                   >
//                     Remove
//                   </button>
//                 </div>
//                 <img
//                   src={uploadedImageUrl}
//                   alt="Preview"
//                   className="w-full rounded border border-gray-200 mb-3"
//                 />

//                 <div className="space-y-2">
//                   <label className="text-xs font-medium text-gray-600 block">
//                     Image Fit Mode
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     <button
//                       onClick={() => setImageMode("contain")}
//                       className={`px-3 py-2 border-2 rounded text-sm transition-all ${
//                         imageMode === "contain"
//                           ? "border-black bg-gray-50 font-medium"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       Fit
//                     </button>
//                     <button
//                       onClick={() => setImageMode("cover")}
//                       className={`px-3 py-2 border-2 rounded text-sm transition-all ${
//                         imageMode === "cover"
//                           ? "border-black bg-gray-50 font-medium"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       Fill
//                     </button>
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     {imageMode === "contain"
//                       ? "Fit: Shows entire image, may have empty space"
//                       : "Fill: Covers entire brick, may crop image"}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
//               <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                 <label className="text-sm font-medium">Quantity</label>
//                 <div className="flex items-center border border-gray-300 rounded w-full sm:w-auto">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="px-3 py-1 hover:bg-gray-50"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) =>
//                       setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                     }
//                     className="w-full sm:w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
//                   />
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="px-3 py-1 hover:bg-gray-50"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
//                 <div className="text-center sm:text-right">
//                   <div className="text-2xl font-bold">${total}</div>
//                   <div className="text-xs text-gray-500">Carved Engraving</div>
//                 </div>
//                 <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
//                   <button
//                     onClick={addToCart}
//                     className="px-8 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 w-full sm:w-auto"
//                   >
//                     Add to cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








// ============================================================================
// PREDEFINED TEMPLATES
// ============================================================================
// const TEMPLATES = {
//   businessCard: {
//     id: "business-card",
//     name: "Business Card",
//     category: "Business",
//     template: {
//       text: "JOHN DOE\nCEO & Founder\njohn@company.com\n+1 (555) 123-4567",
//       layout: "centered",
//     },
//   },
//   wedding: {
//     id: "wedding",
//     name: "Wedding Brick",
//     category: "Events",
//     template: {
//       text: "Sarah & Michael\nJune 15, 2024\nForever Starts Today",
//       layout: "centered",
//     },
//   },
//   saveTheDate: {
//     id: "save-the-date",
//     name: "Save The Date",
//     category: "Events",
//     template: {
//       text: "SAVE THE DATE\nEmily & James\nOctober 20, 2024",
//       layout: "centered",
//     },
//   },
//   anniversary: {
//     id: "anniversary",
//     name: "Anniversary",
//     category: "Personal",
//     template: {
//       text: "Celebrating\n25 Years\nTogether Forever",
//       layout: "centered",
//     },
//   },
//   memorial: {
//     id: "memorial",
//     name: "Memorial",
//     category: "Personal",
//     template: {
//       text: "In Loving Memory\nJohn Smith\n1950 - 2024",
//       layout: "centered",
//     },
//   },
//   custom: {
//     id: "custom",
//     name: "Custom Design",
//     category: "Custom",
//     template: {
//       text: "",
//       layout: "centered",
//     },
//   },
// };
















// CODE 3 ////////////////////////////////////////////////////////////




// @ts-nocheck
// import React, { useState, Suspense, useRef, useEffect } from "react";
// import toast, { Toaster } from 'react-hot-toast';
// import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
// import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
// import * as THREE from "three";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
//   Undo,
//   Maximize2,
//   Image as ImageIcon,
// } from "lucide-react";


// // ============================================================================
// // CLIP-ART LIBRARY
// // ============================================================================
// const CLIPART_LIBRARY = {
//   hearts: {
//     id: "hearts",
//     category: "Romance",
//     items: [
//       {
//         id: "heart-1",
//         name: "Heart",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
//       },
//       {
//         id: "heart-2",
//         name: "Double Hearts",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09M16 4.5c1.74 0 3.41.81 4.5 2.09 1.08 1.28 1.5 2.91 1.5 4.91",
//       },
//     ],
//   },
//   rings: {
//     id: "rings",
//     category: "Wedding",
//     items: [
//       {
//         id: "rings-1",
//         name: "Wedding Rings",
//         svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M16 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
//       },
//       {
//         id: "rings-2",
//         name: "Diamond Ring",
//         svg: "M12 2L4 9l8 13 8-13-8-7zm0 3.5L15.5 9h-7L12 5.5z",
//       },
//     ],
//   },
//   flowers: {
//     id: "flowers",
//     category: "Nature",
//     items: [
//       {
//         id: "flower-1",
//         name: "Rose",
//         svg: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
//       },
//       {
//         id: "flower-2",
//         name: "Tulip",
//         svg: "M12 2C8.5 2 6 4.5 6 8c0 3 2 5.5 4.5 6.5V22h3v-7.5C16 13.5 18 11 18 8c0-3.5-2.5-6-6-6z",
//       },
//     ],
//   },
//   crosses: {
//     id: "crosses",
//     category: "Religious",
//     items: [
//       {
//         id: "cross-1",
//         name: "Simple Cross",
//         svg: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z",
//       },
//       {
//         id: "cross-2",
//         name: "Ornate Cross",
//         svg: "M12 2L10 6h4l-2-4zm0 20l2-4h-4l2 4zM2 12l4-2v4l-4-2zm20 0l-4 2v-4l4 2z M11 7h2v10h-2z M7 11h10v2H7z",
//       },
//     ],
//   },
//   stars: {
//     id: "stars",
//     category: "Decorative",
//     items: [
//       {
//         id: "star-1",
//         name: "Star",
//         svg: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
//       },
//       {
//         id: "star-2",
//         name: "Sparkle",
//         svg: "M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5L12 1z",
//       },
//     ],
//   },
//   doves: {
//     id: "doves",
//     category: "Birds",
//     items: [
//       {
//         id: "dove-1",
//         name: "Dove",
//         svg: "M12 3c-4.97 0-9 4.03-9 9 0 3.38 1.87 6.32 4.63 7.87L6 22l6-4 6 4-1.63-2.13C19.13 18.32 21 15.38 21 12c0-4.97-4.03-9-9-9z M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
//       },
//     ],
//   },
//   butterflies: {
//     id: "butterflies",
//     category: "Nature",
//     items: [
//       {
//         id: "butterfly-1",
//         name: "Butterfly",
//         svg: "M12 2C9.24 2 7 4.24 7 7c0 1.44.62 2.74 1.6 3.65L7 13l5 3 5-3-1.6-2.35C16.38 9.74 17 8.44 17 7c0-2.76-2.24-5-5-5z M12 22l-3-5h6l-3 5z",
//       },
//     ],
//   },
// };

// // ============================================================================
// // ENGRAVING EFFECT CONVERTER (WOOD-BLENDED LASER ENGRAVING)
// // ============================================================================
// async function applyEngravingEffect(imageSrc, engraveDepth = 0.7, textColor = "#4c3328") {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");

//       // Draw original image
//       ctx.drawImage(img, 0, 0);

//       // Get image data
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       // Convert textColor to RGB
//       const hexToRgb = (hex) => {
//         const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//         return result ? {
//           r: parseInt(result[1], 16),
//           g: parseInt(result[2], 16),
//           b: parseInt(result[3], 16)
//         } : { r: 76, g: 51, b: 40 }; // default burgundy
//       };

//       const baseColor = hexToRgb(textColor);

//       // Create NATURAL wood-blended engraving (like 1st reference image)
//       for (let i = 0; i < data.length; i += 4) {
//         const r = data[i];
//         const g = data[i + 1];
//         const b = data[i + 2];
//         const alpha = data[i + 3];

//         // Calculate grayscale value (luminosity method)
//         const gray = (r * 0.299 + g * 0.587 + b * 0.114);

//         // Normalize to 0-1
//         const brightness = gray / 255;

//         // Invert for engraving (dark becomes burned)
//         const darkness = 1 - brightness;

//         // NATURAL WOOD ENGRAVING LOGIC WITH USER COLOR:

//         if (brightness > 0.85) {
//           // Very light areas - completely transparent (wood grain visible)
//           data[i + 3] = 0;
//         } else if (brightness > 0.5) {
//           // Light-medium areas - subtle engraving with user color (lighter)
//           const intensity = (1 - brightness) * engraveDepth;
//           const lightFactor = 1.5; // Make it lighter
//           data[i] = Math.floor(Math.min(255, baseColor.r * lightFactor));
//           data[i + 1] = Math.floor(Math.min(255, baseColor.g * lightFactor));
//           data[i + 2] = Math.floor(Math.min(255, baseColor.b * lightFactor));
//           data[i + 3] = Math.floor(alpha * intensity * 0.6); // Semi-transparent
//         } else if (brightness > 0.2) {
//           // Medium-dark areas - medium engraving with user color
//           const intensity = darkness * engraveDepth;
//           data[i] = Math.floor(baseColor.r * intensity);
//           data[i + 1] = Math.floor(baseColor.g * intensity);
//           data[i + 2] = Math.floor(baseColor.b * intensity);
//           data[i + 3] = Math.floor(alpha * 0.85); // More visible
//         } else {
//           // Very dark areas - darker engraving with user color (darker)
//           const intensity = darkness * engraveDepth;
//           const darkFactor = 0.7; // Make it darker
//           data[i] = Math.floor(baseColor.r * darkFactor * intensity);
//           data[i + 1] = Math.floor(baseColor.g * darkFactor * intensity);
//           data[i + 2] = Math.floor(baseColor.b * darkFactor * intensity);
//           data[i + 3] = alpha; // Fully opaque
//         }
//       }

//       ctx.putImageData(imageData, 0, 0);
//       resolve(canvas.toDataURL());
//     };

//     img.onerror = reject;
//     img.src = imageSrc;
//   });
// }

// // Convert SVG clipart to engraved look
// function svgToEngravingDataURL(svgPath) {
//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200">
//       <path fill="#000000" d="${svgPath}"/>
//     </svg>
//   `;
//   return `data:image/svg+xml;base64,${btoa(svg)}`;
// }

// // ============================================================================
// // TEXT TEXTURE WITH ENGRAVING EFFECT
// // ============================================================================
// function getLines(ctx, text, maxWidth) {
//   // First split by manual line breaks (\n)
//   const manualLines = text.split("\n");
//   const lines = [];

//   // Then handle word wrapping for each manual line
//   manualLines.forEach((line) => {
//     const words = line.split(" ");

//     if (words.length === 0 || line === "") {
//       // Preserve empty lines (when user just presses Enter)
//       lines.push("");
//       return;
//     }

//     let currentLine = words[0];

//     for (let i = 1; i < words.length; i++) {
//       const word = words[i];
//       const width = ctx.measureText(currentLine + " " + word).width;

//       if (width < maxWidth) {
//         currentLine += " " + word;
//       } else {
//         lines.push(currentLine);
//         currentLine = word;
//       }
//     }
//     lines.push(currentLine);
//   });

//   return lines;
// }

// async function createEngravedTextTexture(
//   text,
//   fontFamily,
//   fontSize = 120,
//   fontStyle = "normal",
//   fontWeight = "normal"
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) { }

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");

//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, baseWidth, baseHeight);

//   // Set font
//   ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";

//   const maxWidth = baseWidth * 0.95;
//   const lines = getLines(ctx, text, maxWidth);
//   const lineHeight = fontSize * 1.1;
//   const totalHeight = lines.length * lineHeight;
//   let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//   // CSS-style engraved effect: background-clip text + inverted shadow
//   lines.forEach((line, i) => {
//     const y = startY + i * lineHeight;
//     const x = baseWidth / 2;

//     // CSS text-shadow: 3px 5px 1px rgba(245, 245, 245, 0.5)
//     // This is the HIGHLIGHT/LIGHT shadow (bottom-right)
//     ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
//     ctx.shadowBlur = 1;
//     ctx.shadowOffsetX = 3;
//     ctx.shadowOffsetY = 5;

//     // CSS background-color: #666666 (gray text fill)
//     ctx.fillStyle = "#666666";
//     ctx.fillText(line, x, y);

//     // Reset shadow
//     ctx.shadowColor = "transparent";
//     ctx.shadowBlur = 0;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
//   });

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.magFilter = THREE.LinearFilter;
//   texture.minFilter = THREE.LinearFilter;
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// async function createCombinedEngravingTexture(
//   text,
//   fontFamily,
//   fontSize = 120,
//   fontStyle = "normal",
//   fontWeight = "normal",
//   imageSrc,
//   imageMode = "contain",
//   woodColor = "#d4a574",  // Wood color for matching
//   textColor = "#4c3328"   // ADDED: User-selected text color
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) { }

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");
//   ctx.scale(dpr, dpr);

//   if (imageSrc) {
//     try {
//       // Apply engraving effect to image
//       const engravingImage = await applyEngravingEffect(imageSrc, 0.9);
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       await new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = reject;
//         img.src = engravingImage;
//       });

//       // Calculate aspect ratio and fit/cover image based on mode
//       const imgAspect = img.width / img.height;
//       const canvasAspect = baseWidth / baseHeight;

//       let drawWidth, drawHeight, offsetX, offsetY;

//       if (imageMode === "cover") {
//         if (imgAspect > canvasAspect) {
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         } else {
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         }
//       } else {
//         if (imgAspect > canvasAspect) {
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         } else {
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         }
//       }

//       // Draw engraved image
//       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   if (text) {
//     ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     const maxWidth = baseWidth * 0.9;
//     const lines = getLines(ctx, text, maxWidth);
//     const lineHeight = fontSize * 1.1;
//     const totalHeight = lines.length * lineHeight;
//     let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//     lines.forEach((line, i) => {
//       const y = startY + i * lineHeight;
//       const x = baseWidth / 2;

//       // Light highlight shadow
//       ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
//       ctx.shadowBlur = 1;
//       ctx.shadowOffsetX = 3;
//       ctx.shadowOffsetY = 5;

//       // USER-SELECTED TEXT COLOR (directly applied)
//       ctx.fillStyle = textColor;
//       ctx.fillText(line, x, y);

//       // Reset shadow
//       ctx.shadowColor = "transparent";
//       ctx.shadowBlur = 0;
//       ctx.shadowOffsetX = 0;
//       ctx.shadowOffsetY = 0;
//     });
//   }

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// // ============================================================================
// // CAMERA CONTROLLER
// // ============================================================================
// function CameraController({ zoom, rotation, reset }) {
//   const { camera } = useThree();
//   const initialPosition = useRef([8, 5, 8]);

//   useEffect(() => {
//     if (reset > 0) {
//       camera.position.set(...initialPosition.current);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [reset, camera]);

//   useEffect(() => {
//     const baseDistance = 13.856;
//     const newDistance = baseDistance / zoom;
//     const direction = camera.position.clone().normalize();
//     camera.position.copy(direction.multiplyScalar(newDistance));
//   }, [zoom, camera]);

//   useEffect(() => {
//     if (rotation !== 0) {
//       // Change Y-axis to X-axis for left/right tilt
//       const axis = new THREE.Vector3(1, 0, 0); // ✅ Changed from (0, 1, 0) to (1, 0, 0)
//       camera.position.applyAxisAngle(axis, rotation);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [rotation, camera]);
//   return null;
// }

// // ============================================================================
// // WOOD TEXTURE CREATOR
// // ============================================================================
// const createWoodTexture = (color) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = 512;
//   canvas.height = 512;
//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = color;
//   ctx.fillRect(0, 0, 512, 512);
//   for (let i = 0; i < 30; i++) {
//     ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
//     ctx.lineWidth = Math.random() * 2;
//     ctx.beginPath();
//     ctx.moveTo(0, Math.random() * 512);
//     ctx.bezierCurveTo(
//       128,
//       Math.random() * 512,
//       384,
//       Math.random() * 512,
//       512,
//       Math.random() * 512
//     );
//     ctx.stroke();
//   }
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(2, 2);
//   return texture;
// };

// // ============================================================================
// // BRICK COMPONENT
// // ============================================================================
// function Brick({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,      // ADDED: textColor prop
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   autoRotate,
//   objFilePath,    // ADDED: Dynamic OBJ file path from API
// }) {
//   const meshRef = useRef();

//   // Use dynamic OBJ path from API or fallback to default
//   const brickModelPath = objFilePath || "/2X4 Plus Size_UVs.obj";

//   const obj = useLoader(OBJLoader, brickModelPath);

//   const [combinedTexture, setCombinedTexture] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     let current = null;

//     if (uploadedImage || text) {
//       createCombinedEngravingTexture(
//         text || "",
//         fontFamily,
//         100,
//         fontStyle,
//         fontWeight,
//         uploadedImage,
//         imageMode,
//         woodColor,  // Wood color
//         textColor   // ADDED: User-selected text color
//       )
//         .then((tex) => {
//           if (!mounted) {
//             tex.dispose();
//             return;
//           }
//           setCombinedTexture(tex);
//           current = tex;
//         })
//         .catch(() => { });
//     } else {
//       setCombinedTexture(null);
//     }

//     return () => {
//       mounted = false;
//       if (current) {
//         current.dispose();
//       }
//     };
//   }, [
//     uploadedImage,
//     text,
//     fontFamily,
//     fontStyle,
//     fontWeight,
//     imageMode,
//     woodColor,
//     textColor,  // ADDED: Add to dependencies
//   ]);

//   useFrame((state) => {
//     if (meshRef.current && autoRotate) {
//       meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
//     }
//   });

//   const brickDimensions = {
//     "2x2-plus": { width: 2, height: 1.2, depth: 2 },
//     "2x4-plus": { width: 4, height: 1.2, depth: 2 },
//     "2x4-standard": { width: 4, height: 1.2, depth: 2 },
//   };
//   const dims = brickDimensions[brickType];

//   const textPlaneConfig = {
//     "2x2-plus": {
//       position: [16, 9.8, dims.depth / 1 + -2],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-plus": {
//       position: [16, 9.8, 0],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-standard": {
//       position: [8, 4.8, dims.depth / 2 + -1],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 7, dims.height * 7],
//     },
//   };
//   const config = textPlaneConfig[brickType];

//   const modelScale = 0.15;
//   const scaleMultiplier =
//     brickType === "2x4-standard" ? 2.0 * modelScale : modelScale;

//   const clonedObj = React.useMemo(() => {
//     const cloned = obj.clone();
//     const woodTexture = createWoodTexture(woodColor);

//     cloned.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: woodColor,
//           roughness: 0.7,
//           metalness: 0.1,
//           map: woodTexture,
//         });
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });

//     return cloned;
//   }, [obj, woodColor]);

//   return (
//     <group ref={meshRef} scale={scaleMultiplier} position={[0, -1, 0]}>
//       <primitive object={clonedObj} />

//       {combinedTexture && (
//         <mesh position={config.position} rotation={config.rotation}>
//           <planeGeometry args={config.planeSize} />
//           <meshStandardMaterial
//             map={combinedTexture}
//             transparent
//             alphaTest={0.1}
//             roughness={0.8}
//             metalness={0.0}
//             side={THREE.DoubleSide}
//             depthWrite={true}
//             depthTest={true}
//           />
//         </mesh>
//       )}
//     </group>
//   );
// }

// // ============================================================================
// // SCENE
// // ============================================================================
// function Scene({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,      // ADDED: textColor prop
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   autoRotate,
//   zoom,
//   rotation,
//   reset,
//   objFilePath,    // ADDED: Dynamic OBJ path
// }) {
//   return (
//     <>
//       <CameraController zoom={zoom} rotation={rotation} reset={reset} />
//       <ambientLight intensity={0.5} />
//       <directionalLight
//         position={[5, 8, 5]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
//       <spotLight
//         position={[-5, 10, 0]}
//         intensity={0.5}
//         angle={0.3}
//         penumbra={1}
//         castShadow
//       />
//       <Suspense fallback={null}>
//         <Brick
//           text={text}
//           brickType={brickType}
//           woodColor={woodColor}
//           uploadedImage={uploadedImage}
//           textColor={textColor}   // ADDED: Pass textColor
//           fontFamily={fontFamily}
//           fontStyle={fontStyle}
//           fontWeight={fontWeight}
//           imageMode={imageMode}
//           autoRotate={autoRotate}
//           objFilePath={objFilePath} // ADDED: Pass dynamic OBJ path
//         />
//       </Suspense>
//       <ContactShadows
//         position={[0, -2, 0]}
//         opacity={0.4}
//         scale={15}
//         blur={2}
//         far={4}
//       />
//       <Environment preset="warehouse" />
//       <OrbitControls
//         enablePan={false}
//         enableZoom={true}
//         minDistance={5}
//         maxDistance={25}
//         minPolarAngle={Math.PI / 2}      // ✅ Lock to horizontal level
//         maxPolarAngle={Math.PI / 2}      // ✅ Lock to horizontal level
//         minAzimuthAngle={-Infinity}      // ✅ Allow full horizontal rotation
//         maxAzimuthAngle={Infinity}       // ✅ Allow full horizontal rotation
//         autoRotate={autoRotate}
//         autoRotateSpeed={0.1}
//         enableRotate={true}
//       />
//     </>
//   );
// }

// // ============================================================================
// // MAIN COMPONENT (UI remains the same, only engraving logic changed)
// // ============================================================================
// export default function EngravedBrickCustomizer() {
//   // Get product ID from URL
//   const getProductIdFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('product_id') || '16'; // Default to 16
//   };

//   const [productId] = useState(getProductIdFromUrl());
//   const [productData, setProductData] = useState(null);
//   const [templateData, setTemplateData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   console.log(productData);

//   const [text, setText] = useState("");
//   const [brickType, setBrickType] = useState("2x4-plus");
//   const [quantity, setQuantity] = useState(1);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//   const [woodColor, setWoodColor] = useState("#d4a574");
//   const [fontStyle, setFontStyle] = useState("normal");
//   const [textColor, setTextColor] = useState("#4c3328");
//   const [fontWeight, setFontWeight] = useState("normal");
//   const [fontFamily, setFontFamily] = useState("Adamina");
//   const [imageMode, setImageMode] = useState("contain");
//   const [showTextPanel, setShowTextPanel] = useState(true);
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showClipart, setShowClipart] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [autoRotate, setAutoRotate] = useState(false);
//   const [zoom, setZoom] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [resetTrigger, setResetTrigger] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const prevZoomRef = useRef(null);

//   // Fetch product data from API
//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/product/${productId}`
//         );

//         if (!response.ok) {
//           throw new Error('Failed to fetch product data');
//         }

//         const result = await response.json();

//         if (result.success && result.data) {
//           setProductData(result.data);
//           setTemplateData(result.predefined_template);
//           console.log("API Response: ", result);

//         } else {
//           throw new Error('Invalid API response');
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error('API Error:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProductData();
//   }, [productId]);

//   const fontOptions = {
//     Adamina: "Adamina",
//     Aladin: "Aladin",
//     "Amatic SC": "Amatic SC",
//     Amiri: "Amiri",
//     Arimo: "Arimo",
//     Arizonia: "Arizonia",
//     "Berkshire Swash": "Berkshire Swash",
//     Cairo: "Cairo",
//     Condiment: "Condiment",
//     Cookie: "Cookie",
//     Damion: "Damion",
//     "EB Garamond": "EB Garamond",
//     Fondamento: "Fondamento",
//     "Gloria Hallelujah": "Gloria Hallelujah",
//     "Rock Salt": "Rock Salt",
//     Rubik: "Rubik",
//     "Shippori Mincho": "Shippori Mincho",
//     Tinos: "Tinos",
//     "Trail One": "Trail One",
//     "ZCOOL XiaoWei": "ZCOOL XiaoWei",
//     Roboto: "Roboto",
//     "Open Sans": "Open Sans",
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadedFile(file.name);
//       const imageUrl = URL.createObjectURL(file);
//       setUploadedImageUrl(imageUrl);
//     }
//   };

//   const handleClipartSelect = (svgPath) => {
//     const dataUrl = svgToEngravingDataURL(svgPath);
//     setUploadedImageUrl(dataUrl);
//     setUploadedFile("clipart");
//     setShowClipart(false);
//   };

//   const handleTemplateSelect = (templateKey) => {
//     const template = templateData[templateKey];
//     setSelectedTemplate(templateKey);
//     setText(template.template.text);
//     setShowTemplates(false);
//   };

//   const clearImage = () => {
//     setUploadedFile(null);
//     if (uploadedImageUrl) {
//       URL.revokeObjectURL(uploadedImageUrl);
//     }
//     setUploadedImageUrl(null);
//   };

//   const handleZoomIn = () => {
//     setZoom((prev) => Math.max(0.5, prev + 0.1));
//   };

//   const handleZoomOut = () => {
//     setZoom((prev) => Math.min(2, prev - 0.1));
//   };

//   const handleRotateLeft = () => {
//     setRotation((prev) => prev - Math.PI / 4);
//   };

//   const handleRotateRight = () => {
//     setRotation((prev) => prev + Math.PI / 4);
//   };

//   const handleReset = () => {
//     setZoom(1);
//     setRotation(0);
//     setResetTrigger((prev) => prev + 1);
//   };

//   const toggleFullscreen = () => {
//     setIsFullscreen((prev) => {
//       const entering = !prev;
//       if (entering) {
//         prevZoomRef.current = zoom;
//         setZoom(Math.max(0.5, zoom * 0.7));
//       } else {
//         if (prevZoomRef.current != null) setZoom(prevZoomRef.current);
//       }
//       return entering;
//     });
//   };

//   const price = productData?.price ? parseFloat(productData.price) : 19.99;
//   const total = (price * quantity).toFixed(2);

//   const captureScreenshot = async () => {
//     return new Promise((resolve) => {
//       // Get the canvas element from Three.js
//       const canvas = document.querySelector('canvas');

//       if (!canvas) {
//         console.error('Canvas not found');
//         resolve(null);
//         return;
//       }

//       // IMPORTANT: Wait for next frame to ensure scene is fully rendered
//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           // Double requestAnimationFrame ensures rendering is complete

//           try {
//             // Convert canvas to data URL for debugging
//             const dataURL = canvas.toDataURL('image/png', 0.95);

//             // Convert data URL to blob for upload
//             canvas.toBlob(
//               (blob) => {
//                 if (blob) {
//                   console.log('Screenshot captured:', blob.size, 'bytes');
//                   resolve({ blob, dataURL });
//                 } else {
//                   console.error('Failed to create blob from canvas');
//                   resolve(null);
//                 }
//               },
//               'image/png',
//               0.95
//             );
//           } catch (error) {
//             console.error('Error capturing screenshot:', error);
//             resolve(null);
//           }
//         });
//       });
//     });
//   };

//   const addToCart = async (event) => {
//     const orderDetails = {
//       brickType,
//       woodColor,
//       text: text || "None",
//       image: uploadedFile || "None",
//       template: selectedTemplate || "custom",
//       quantity,
//       total,
//       engravingStyle: "carved-engraving",
//     };

//     try {
//       const button = event.target;
//       button.disabled = true;
//       button.textContent = "Adding to cart...";

//       // ✅ LOG ORDER DETAILS OBJECT
//       console.log("Order Details Object:", orderDetails);

//       // Prepare FormData
//       const formData = new FormData();

//       formData.append("brick_type", brickType);
//       formData.append("wood_color", woodColor);
//       formData.append("text", text || "");
//       formData.append("template", selectedTemplate || "custom");
//       formData.append("quantity", quantity);
//       formData.append("price", price);
//       formData.append("total", total);
//       formData.append("engraving_style", "carved-engraving");
//       formData.append("font_family", fontFamily);
//       formData.append("font_style", fontStyle);
//       formData.append("font_weight", fontWeight);
//       formData.append("text_color", textColor);
//       formData.append("image_mode", imageMode);
//       formData.append("product_id", productId);

//       // Uploaded image / clipart handling
//       if (uploadedImageUrl && uploadedFile !== "clipart") {
//         const response = await fetch(uploadedImageUrl);
//         const blob = await response.blob();
//         formData.append("image", blob, uploadedFile);
//         formData.append("image_type", "upload");
//       } else if (uploadedFile === "clipart") {
//         formData.append("clipart", uploadedImageUrl);
//         formData.append("image_type", "clipart");
//       }

//       // ✅ LOG FORMDATA CONTENTS
//       console.log("Submitting FormData:");
//       for (let [key, value] of formData.entries()) {
//         console.log(key, value);
//       }

//       // Send POST request
//       const apiResponse = await fetch(
//         "https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/submit",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const result = await apiResponse.json();
//       console.log("API Response:", result);

//       if (result.success) {
//         console.log(
//           `✅ Successfully added to cart`,
//           result.data
//         );

//         window.location.href = result?.redirect_url;
//       } else {
//         throw new Error(result.message || "Failed to add to cart");
//       }

//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       alert(
//         `❌ Failed to add to cart\n\nError: ${error.message}`
//       );
//     } finally {
//       const button = event?.target;
//       if (button) {
//         button.disabled = false;
//         button.textContent = "Add to cart";
//       }
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Loading State */}
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-xl">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
//             <p className="text-lg font-semibold">Loading product data...</p>
//           </div>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
//           <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Product</h2>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {/* Main Content - Only show when data is loaded */}
//       {!loading && !error && productData && (
//         <div className="max-w-7xl mx-auto p-6 pb-32">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">Step 2: Upload Artwork</h1>
//             <p className="text-gray-600">
//               Customize your wooden brick with carved laser engraving
//             </p>
//             <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
//               ✨ All designs automatically converted to 3D carved engraving style
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
//                   <button
//                     onClick={handleZoomIn}
//                     className="p-2 hover:bg-gray-200 rounded transition-colors"
//                     title="Zoom In"
//                   >
//                     <ZoomIn className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={handleZoomOut}
//                     className="p-2 hover:bg-gray-200 rounded transition-colors"
//                     title="Zoom Out"
//                   >
//                     <ZoomOut className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={handleRotateLeft}
//                     className="p-2 hover:bg-gray-200 rounded transition-colors"
//                     title="Rotate Left"
//                   >
//                     <RotateCw className="w-5 h-5 scale-x-[-1]" />
//                   </button>
//                   <button
//                     onClick={handleRotateRight}
//                     className="p-2 hover:bg-gray-200 rounded transition-colors"
//                     title="Rotate Right"
//                   >
//                     <RotateCw className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={handleReset}
//                     className="p-2 hover:bg-gray-200 rounded transition-colors"
//                     title="Reset View"
//                   >
//                     <Undo className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => setAutoRotate(!autoRotate)}
//                     className={`px-3 py-2 rounded text-sm transition-colors ${autoRotate
//                       ? "bg-blue-100 text-blue-700"
//                       : "hover:bg-gray-200"
//                       }`}
//                     title="Toggle Auto-Rotate"
//                   >
//                     Auto
//                   </button>
//                   <div className="ml-auto">
//                     <button
//                       onClick={toggleFullscreen}
//                       className="p-2 hover:bg-gray-200 rounded transition-colors"
//                       title="Fullscreen"
//                     >
//                       <Maximize2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>

//                 <div
//                   className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${isFullscreen ? "fixed inset-0 z-50" : ""
//                     }`}
//                   style={{ height: isFullscreen ? "100vh" : "500px" }}
//                 >
//                   <Canvas camera={{ position: [60, 37.5, 60], fov: 45 }} shadows>
//                     <Scene
//                       text={text}
//                       brickType={brickType}
//                       woodColor={woodColor}
//                       uploadedImage={uploadedImageUrl}
//                       textColor={textColor}   // ADDED: Pass textColor
//                       fontFamily={fontFamily}
//                       fontStyle={fontStyle}
//                       fontWeight={fontWeight}
//                       imageMode={imageMode}
//                       autoRotate={autoRotate}
//                       zoom={zoom}
//                       rotation={rotation}
//                       reset={resetTrigger}
//                       objFilePath={productData?.obj_file} // ADDED: Dynamic OBJ from API
//                     />
//                   </Canvas>
//                   {isFullscreen && (
//                     <button
//                       onClick={toggleFullscreen}
//                       className="absolute top-4 right-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <Maximize2 className="w-6 h-6" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* TEMPLATES SECTION */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-semibold">📋 Predefined Templates</h3>
//                   <button
//                     onClick={() => setShowTemplates(!showTemplates)}
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     {showTemplates ? "Hide" : "Show"} Templates
//                   </button>
//                 </div>

//                 {showTemplates && (
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {Object.entries(templateData).map(([key, template]) => (
//                       <button
//                         key={key}
//                         onClick={() => handleTemplateSelect(key)}
//                         className={`p-3 border-2 rounded-lg text-left transition-all hover:border-gray-400 ${selectedTemplate === key
//                           ? "border-black bg-gray-50"
//                           : "border-gray-300"
//                           }`}
//                       >
//                         <div className="font-medium text-sm">{template.name}</div>
//                         <div className="text-xs text-gray-500">
//                           {template.category}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {/* 
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//                 <h3 className="font-semibold mb-3">Brick Size</h3>
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     { value: "2x2-plus", label: "2x2 Plus" },
//                     { value: "2x4-plus", label: "2x4 Plus" },
//                     { value: "2x4-standard", label: "2x4 Standard" },
//                   ].map((type) => (
//                     <button
//                       key={type.value}
//                       onClick={() => setBrickType(type.value)}
//                       className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${brickType === type.value
//                           ? "border-black bg-gray-50"
//                           : "border-gray-300 hover:border-gray-400"
//                         }`}
//                     >
//                       {type.label}
//                     </button>
//                   ))}
//                 </div>
//               </div> */}


//             </div>

//             <div className="space-y-4">
//               {showTextPanel && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="font-semibold">Text (Carved Engraving)</h3>
//                     <div className="flex gap-1">
//                       <button
//                         onClick={() => setShowTextPanel(false)}
//                         className="p-1 hover:bg-gray-100 rounded text-sm"
//                         title="Close"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-1 block">
//                         Custom Text
//                       </label>
//                       <textarea
//                         value={text}
//                         onChange={(e) => setText(e.target.value)}
//                         placeholder="Enter text..."
//                         rows={3}
//                         className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
//                       />
//                       <div className="text-xs text-gray-500 mt-1">
//                         {text.length} characters
//                       </div>
//                     </div>


//                     {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//                       <h3 className="font-semibold mb-3">Wood Color</h3>
//                       <div className="flex gap-3 items-center">
//                         {["#d4a574", "#8b4513", "#deb887", "#cd853f"].map((color) => (
//                           <button
//                             key={color}
//                             onClick={() => setWoodColor(color)}
//                             className={`w-12 h-12 rounded-lg border-2 transition-all ${woodColor === color
//                               ? "border-black scale-110"
//                               : "border-gray-300"
//                               }`}
//                             style={{ backgroundColor: color }}
//                             title={color}
//                           />
//                         ))}
//                         <input
//                           type="color"
//                           value={woodColor}
//                           onChange={(e) => setWoodColor(e.target.value)}
//                           className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
//                           title="Custom color"
//                         />
//                       </div>
//                     </div> */}

//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-2 block">
//                         Font
//                       </label>
//                       <select
//                         value={fontFamily}
//                         onChange={(e) => setFontFamily(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
//                       >
//                         {Object.keys(fontOptions).map((f) => (
//                           <option key={f} value={fontOptions[f]}>
//                             {f}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-2 block">
//                         Style
//                       </label>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             setFontWeight(
//                               fontWeight === "bold" ? "normal" : "bold"
//                             )
//                           }
//                           className={`flex-1 px-3 py-2 border rounded text-sm transition-colors ${fontWeight === "bold"
//                             ? "border-black bg-gray-50"
//                             : "border-gray-300 hover:border-gray-400"
//                             }`}
//                         >
//                           <span className="font-bold">B</span>
//                         </button>
//                         <button
//                           onClick={() =>
//                             setFontStyle(
//                               fontStyle === "italic" ? "normal" : "italic"
//                             )
//                           }
//                           className={`flex-1 px-3 py-2 border rounded text-sm transition-colors ${fontStyle === "italic"
//                             ? "border-black bg-gray-50"
//                             : "border-gray-300 hover:border-gray-400"
//                             }`}
//                         >
//                           <span className="italic">I</span>
//                         </button>
//                       </div>
//                     </div>
//                     {/* 
//                     <div>
//                       <label className="text-xs font-medium text-gray-600 mb-2 block">
//                         Engraving Color
//                       </label>
//                       <div className="flex gap-2 items-center">
//                         <button
//                           onClick={() => setTextColor("#4c3328")}
//                           className={`w-10 h-10 rounded border-2 transition-all ${textColor === "#4c3328"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                             }`}
//                           style={{ backgroundColor: "#4c3328" }}
//                           title="Dark Brown"
//                         />
//                         <button
//                           onClick={() => setTextColor("#654321")}
//                           className={`w-10 h-10 rounded border-2 transition-all ${textColor === "#654321"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                             }`}
//                           style={{ backgroundColor: "#654321" }}
//                           title="Medium Brown"
//                         />
//                         <button
//                           onClick={() => setTextColor("#000000")}
//                           className={`w-10 h-10 rounded border-2 transition-all ${textColor === "#000000"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                             }`}
//                           style={{ backgroundColor: "#000000" }}
//                           title="Black"
//                         />
//                         <button
//                           onClick={() => setTextColor("#ffffff")}
//                           className={`w-10 h-10 rounded border-2 transition-all ${textColor === "#ffffff"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                             }`}
//                           style={{ backgroundColor: "#ffffff" }}
//                           title="White"
//                         />
//                         <button
//                           onClick={() => setTextColor("#8b4513")}
//                           className={`w-10 h-10 rounded border-2 transition-all ${textColor === "#8b4513"
//                             ? "border-black scale-110"
//                             : "border-gray-300"
//                             }`}
//                           style={{ backgroundColor: "#8b4513" }}
//                           title="Saddle Brown"
//                         />
//                       </div>
//                     </div> */}
//                   </div>

//                   <div className="mt-6 space-y-2">
//                     <button
//                       onClick={() => setText("")}
//                       className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
//                     >
//                       Clear Text
//                     </button>
//                     <button
//                       onClick={() => setShowClipart(!showClipart)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <ImageIcon className="w-4 h-4" />
//                       Browse Clip-Art Library
//                     </button>
//                     <button
//                       onClick={() => document.getElementById("fileInput").click()}
//                       className="w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
//                     >
//                       ⊕ Upload Custom Image
//                     </button>
//                     <input
//                       id="fileInput"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                     />
//                     <p className="text-xs text-gray-500 text-center">
//                       All images auto-converted to carved engraving
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* CLIPART LIBRARY */}
//               {showClipart && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-h-96 overflow-y-auto">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold">🎨 Clip-Art Library</h3>
//                     <button
//                       onClick={() => setShowClipart(false)}
//                       className="text-sm text-gray-600 hover:text-gray-700"
//                     >
//                       ✕
//                     </button>
//                   </div>

//                   {Object.entries(CLIPART_LIBRARY).map(([key, category]) => (
//                     <div key={key} className="mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">
//                         {category.category}
//                       </h4>
//                       <div className="grid grid-cols-3 gap-2">
//                         {category.items.map((item) => (
//                           <button
//                             key={item.id}
//                             onClick={() => handleClipartSelect(item.svg)}
//                             className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
//                             title={item.name}
//                           >
//                             <svg
//                               viewBox="0 0 24 24"
//                               className="w-full h-12"
//                               fill="#000"
//                             >
//                               <path d={item.svg} />
//                             </svg>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {!showTextPanel && (
//                 <button
//                   onClick={() => setShowTextPanel(true)}
//                   className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-left hover:bg-gray-50 transition-colors"
//                 >
//                   <span className="font-semibold">+ Add Text Panel</span>
//                 </button>
//               )}

//               {uploadedImageUrl && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">
//                       Uploaded Image (Carved Engraving)
//                     </span>
//                     <button
//                       onClick={clearImage}
//                       className="text-sm text-red-600 hover:text-red-700"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                   <img
//                     src={uploadedImageUrl}
//                     alt="Preview"
//                     className="w-full rounded border border-gray-200 mb-3"
//                   />

//                   <div className="space-y-2">
//                     <label className="text-xs font-medium text-gray-600 block">
//                       Image Fit Mode
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={() => setImageMode("contain")}
//                         className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "contain"
//                           ? "border-black bg-gray-50 font-medium"
//                           : "border-gray-300 hover:border-gray-400"
//                           }`}
//                       >
//                         Fit
//                       </button>
//                       <button
//                         onClick={() => setImageMode("cover")}
//                         className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "cover"
//                           ? "border-black bg-gray-50 font-medium"
//                           : "border-gray-300 hover:border-gray-400"
//                           }`}
//                       >
//                         Fill
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       {imageMode === "contain"
//                         ? "Fit: Shows entire image, may have empty space"
//                         : "Fill: Covers entire brick, may crop image"}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//               <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
//                 <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                   <label className="text-sm font-medium">Quantity</label>
//                   <div className="flex items-center border border-gray-300 rounded w-full sm:w-auto">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-3 py-1 hover:bg-gray-50"
//                     >
//                       −
//                     </button>
//                     <input
//                       type="number"
//                       value={quantity}
//                       onChange={(e) =>
//                         setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                       }
//                       className="w-full sm:w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
//                     />
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="px-3 py-1 hover:bg-gray-50"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
//                   <div className="text-center sm:text-right">
//                     <div className="text-2xl font-bold">${total}</div>
//                     <div className="text-xs text-gray-500">
//                       {productData?.name || "3D Model"}
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
//                     <button
//                       onClick={addToCart}
//                       className="px-8 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 w-full sm:w-auto"
//                     >
//                       Add to cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }























// CODE 4 with edit text
// @ts-nocheck
// import React, { useState, Suspense, useRef, useEffect } from "react";
// import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
// import { OrbitControls, Environment, ContactShadows, TransformControls } from "@react-three/drei";
// import * as THREE from "three";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import {
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
//   Undo,
//   Maximize2,
//   Image as ImageIcon,
//   Move,
//   Check,
//   Type,        // ✅ Add these
//   Scaling,     // ✅ Add these
//   MousePointer2, // ✅ Add these
//   ImagePlus,   // ✅ Add these
//   Ban,         // ✅ Add these
//   Target,      // ✅ Add these
//   Expand,      // ✅ Add these
// } from "lucide-react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // ============================================================================
// // CLIP-ART LIBRARY
// // ============================================================================
// const CLIPART_LIBRARY = {
//   hearts: {
//     id: "hearts",
//     category: "Romance",
//     items: [
//       {
//         id: "heart-1",
//         name: "Heart",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
//       },
//       {
//         id: "heart-2",
//         name: "Double Hearts",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09M16 4.5c1.74 0 3.41.81 4.5 2.09 1.08 1.28 1.5 2.91 1.5 4.91",
//       },
//     ],
//   },
//   rings: {
//     id: "rings",
//     category: "Wedding",
//     items: [
//       {
//         id: "rings-1",
//         name: "Wedding Rings",
//         svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M16 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
//       },
//       {
//         id: "rings-2",
//         name: "Diamond Ring",
//         svg: "M12 2L4 9l8 13 8-13-8-7zm0 3.5L15.5 9h-7L12 5.5z",
//       },
//     ],
//   },
//   flowers: {
//     id: "flowers",
//     category: "Nature",
//     items: [
//       {
//         id: "flower-1",
//         name: "Rose",
//         svg: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
//       },
//       {
//         id: "flower-2",
//         name: "Tulip",
//         svg: "M12 2C8.5 2 6 4.5 6 8c0 3 2 5.5 4.5 6.5V22h3v-7.5C16 13.5 18 11 18 8c0-3.5-2.5-6-6-6z",
//       },
//     ],
//   },
//   crosses: {
//     id: "crosses",
//     category: "Religious",
//     items: [
//       {
//         id: "cross-1",
//         name: "Simple Cross",
//         svg: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z",
//       },
//       {
//         id: "cross-2",
//         name: "Ornate Cross",
//         svg: "M12 2L10 6h4l-2-4zm0 20l2-4h-4l2 4zM2 12l4-2v4l-4-2zm20 0l-4 2v-4l4 2z M11 7h2v10h-2z M7 11h10v2H7z",
//       },
//     ],
//   },
//   stars: {
//     id: "stars",
//     category: "Decorative",
//     items: [
//       {
//         id: "star-1",
//         name: "Star",
//         svg: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
//       },
//       {
//         id: "star-2",
//         name: "Sparkle",
//         svg: "M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5L12 1z",
//       },
//     ],
//   },
//   doves: {
//     id: "doves",
//     category: "Birds",
//     items: [
//       {
//         id: "dove-1",
//         name: "Dove",
//         svg: "M12 3c-4.97 0-9 4.03-9 9 0 3.38 1.87 6.32 4.63 7.87L6 22l6-4 6 4-1.63-2.13C19.13 18.32 21 15.38 21 12c0-4.97-4.03-9-9-9z M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
//       },
//     ],
//   },
//   butterflies: {
//     id: "butterflies",
//     category: "Nature",
//     items: [
//       {
//         id: "butterfly-1",
//         name: "Butterfly",
//         svg: "M12 2C9.24 2 7 4.24 7 7c0 1.44.62 2.74 1.6 3.65L7 13l5 3 5-3-1.6-2.35C16.38 9.74 17 8.44 17 7c0-2.76-2.24-5-5-5z M12 22l-3-5h6l-3 5z",
//       },
//     ],
//   },
// };




// async function createImageOnlyTexture(imageSrc, imageMode = "contain") {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = async () => {
//       try {
//         const engravingImage = await applyEngravingEffect(imageSrc, 0.9, "#4c3328");
//         const processedImg = new Image();
//         processedImg.crossOrigin = "anonymous";

//         await new Promise((res, rej) => {
//           processedImg.onload = res;
//           processedImg.onerror = rej;
//           processedImg.src = engravingImage;
//         });

//         const dpr = Math.min(window.devicePixelRatio || 1, 2);
//         const baseWidth = 1024;
//         const baseHeight = 512;
//         const canvas = document.createElement("canvas");
//         canvas.width = Math.floor(baseWidth * dpr);
//         canvas.height = Math.floor(baseHeight * dpr);
//         const ctx = canvas.getContext("2d");
//         ctx.scale(dpr, dpr);

//         const imgAspect = processedImg.width / processedImg.height;
//         const canvasAspect = baseWidth / baseHeight;
//         let drawWidth, drawHeight, offsetX, offsetY;

//         if (imageMode === "cover") {
//           if (imgAspect > canvasAspect) {
//             drawHeight = baseHeight;
//             drawWidth = baseHeight * imgAspect;
//             offsetX = (baseWidth - drawWidth) / 2;
//             offsetY = 0;
//           } else {
//             drawWidth = baseWidth;
//             drawHeight = baseWidth / imgAspect;
//             offsetX = 0;
//             offsetY = (baseHeight - drawHeight) / 2;
//           }
//         } else {
//           if (imgAspect > canvasAspect) {
//             drawWidth = baseWidth;
//             drawHeight = baseWidth / imgAspect;
//             offsetX = 0;
//             offsetY = (baseHeight - drawHeight) / 2;
//           } else {
//             drawHeight = baseHeight;
//             drawWidth = baseHeight * imgAspect;
//             offsetX = (baseWidth - drawWidth) / 2;
//             offsetY = 0;
//           }
//         }

//         ctx.drawImage(processedImg, offsetX, offsetY, drawWidth, drawHeight);

//         const texture = new THREE.CanvasTexture(canvas);
//         texture.generateMipmaps = false;
//         texture.anisotropy = 16;
//         texture.encoding = THREE.sRGBEncoding;
//         texture.needsUpdate = true;
//         resolve(texture);
//       } catch (e) {
//         reject(e);
//       }
//     };

//     img.onerror = reject;
//     img.src = imageSrc;
//   });
// }




// function DraggableTextLayer({
//   textTexture,
//   position,
//   rotation,
//   planeSize,
//   isEditMode,
//   isActive,
//   onPositionChange,
//   onScaleChange,
//   scale = [1, 1, 1],
//   transformMode = 'translate',
//   bounds,
// }) {
//   const groupRef = useRef();
//   const isDragging = useRef(false);
//   const lastPosition = useRef(null);

//   // ✅ useFrame ONLY handles position clamping during translate
//   // ✅ NO scale logic here — scale is only handled in handleTransformChange
//   useFrame(() => {
//     if (!groupRef.current || !isEditMode || !isActive || !bounds) return;
//     if (transformMode !== 'translate') return; // ✅ Skip entirely for scale mode

//     const pos = groupRef.current.position;
//     const clampedY = Math.max(bounds.yMin, Math.min(bounds.yMax, pos.y));
//     const clampedZ = Math.max(bounds.zMin, Math.min(bounds.zMax, pos.z));

//     const needsClamp =
//       Math.abs(pos.x - bounds.xFixed) > 0.001 ||
//       Math.abs(pos.y - clampedY) > 0.001 ||
//       Math.abs(pos.z - clampedZ) > 0.001;

//     if (needsClamp) {
//       groupRef.current.position.set(bounds.xFixed, clampedY, clampedZ);
//       // ✅ Only call onPositionChange when actually dragging, not on mount
//       if (isDragging.current) {
//         onPositionChange?.([bounds.xFixed, clampedY, clampedZ]);
//       }
//     }
//   });

//   const handleTransformChange = () => {
//     if (!groupRef.current) return;
//     isDragging.current = true;

//     if (transformMode === 'translate' && bounds) {
//       const pos = groupRef.current.position;
//       const clampedY = Math.max(bounds.yMin, Math.min(bounds.yMax, pos.y));
//       const clampedZ = Math.max(bounds.zMin, Math.min(bounds.zMax, pos.z));

//       // ✅ Only log if position actually changed
//       const newPos = [bounds.xFixed, clampedY, clampedZ];
//       const changed = !lastPosition.current ||
//         lastPosition.current.some((v, i) => Math.abs(v - newPos[i]) > 0.01);

//       if (changed) {
//         console.log("🔄 [TEXT] Position:", newPos.map(v => v.toFixed(2)));
//         lastPosition.current = newPos;
//         groupRef.current.position.set(...newPos);
//         onPositionChange?.(newPos);
//       }
//     }

//     if (transformMode === 'scale') {
//       const s = groupRef.current.scale;

//       // ✅ Clamp scale
//       const cx = Math.max(0.4, Math.min(2.5, s.x));
//       const cy = Math.max(0.6, Math.min(5, s.y));
//       const cz = Math.max(0.4, Math.min(2.5, s.z));

//       groupRef.current.scale.set(cx, cy, cz);

//       // ✅ Only fire onScaleChange once, not in a loop
//       console.log("🔄 [TEXT] Scale:", [cx.toFixed(2), cy.toFixed(2), cz.toFixed(2)]);
//       // ✅ Do NOT call onScaleChange here — it causes re-render loop
//       // onScaleChange?.([cx, cy, cz]); // ← REMOVED
//     }
//   };

//   // ✅ Save scale to parent only when dragging STOPS (mouseup)
//   const handleMouseUp = () => {
//     if (!groupRef.current || !isDragging.current) return;
//     isDragging.current = false;

//     if (transformMode === 'scale') {
//       const s = groupRef.current.scale;
//       const cx = Math.max(0.3, Math.min(2, s.x));
//       const cy = Math.max(0.3, Math.min(2, s.y));
//       const cz = Math.max(0.3, Math.min(2, s.z));
//       console.log("✅ [TEXT] Scale saved on release:", [cx.toFixed(2), cy.toFixed(2), cz.toFixed(2)]);
//       onScaleChange?.([cx, cy, cz]);
//     }

//     if (transformMode === 'translate') {
//       const pos = groupRef.current.position;
//       const clampedY = Math.max(bounds.yMin, Math.min(bounds.yMax, pos.y));
//       const clampedZ = Math.max(bounds.zMin, Math.min(bounds.zMax, pos.z));
//       onPositionChange?.([bounds.xFixed, clampedY, clampedZ]);
//     }
//   };

//   return (
//     <>
//       <group ref={groupRef} position={position} scale={scale}>
//         <mesh rotation={rotation}>
//           <planeGeometry args={planeSize} />
//           <meshStandardMaterial
//             map={textTexture}
//             transparent
//             alphaTest={0.1}
//             roughness={0.8}
//             metalness={0.0}
//             side={THREE.DoubleSide}
//             depthWrite={true}
//             depthTest={true}
//           />
//         </mesh>
//       </group>

//       {isEditMode && isActive && groupRef.current && (
//         <TransformControls
//           object={groupRef.current}
//           mode={transformMode}
//           space="world"
//           size={transformMode === 'scale' ? 2 : 4}
//           onObjectChange={handleTransformChange}
//           onMouseUp={handleMouseUp}   // ✅ Save on release
//           translationSnap={null}
//           scaleSnap={null}
//           showX={false}
//           showY={true}
//           showZ={true}
//         />
//       )}
//     </>
//   );
// }


// function DraggableImageLayer({
//   imageTexture,
//   position,
//   rotation,
//   planeSize,
//   isEditMode,
//   isActive,
//   onPositionChange,
//   onScaleChange,
//   scale = [1, 1, 1],
//   transformMode = 'translate',
//   bounds,
// }) {
//   const groupRef = useRef();
//   const isDragging = useRef(false);
//   const lastPosition = useRef(null);

//   useFrame(() => {
//     if (!groupRef.current || !isEditMode || !isActive || !bounds) return;
//     if (transformMode !== 'translate') return;

//     const pos = groupRef.current.position;
//     const currentScale = groupRef.current.scale;

//     // ✅ Shrink bounds based on current scale so scaled image stays inside
//     const scaleY = currentScale.y || 1;
//     const scaleZ = currentScale.z || 1;

//     const dynamicYMin = bounds.yMin * scaleY;
//     const dynamicYMax = bounds.yMax / scaleY;
//     const dynamicZMin = bounds.zMin / scaleZ;
//     const dynamicZMax = bounds.zMax / scaleZ;

//     const clampedY = Math.max(dynamicYMin, Math.min(dynamicYMax, pos.y));
//     const clampedZ = Math.max(dynamicZMin, Math.min(dynamicZMax, pos.z));

//     const needsClamp =
//       Math.abs(pos.x - bounds.xFixed) > 0.001 ||
//       Math.abs(pos.y - clampedY) > 0.001 ||
//       Math.abs(pos.z - clampedZ) > 0.001;

//     if (needsClamp) {
//       groupRef.current.position.set(bounds.xFixed, clampedY, clampedZ);
//       if (isDragging.current) {
//         onPositionChange?.([bounds.xFixed, clampedY, clampedZ]);
//       }
//     }
//   });

//   const handleTransformChange = () => {
//     if (!groupRef.current) return;
//     isDragging.current = true;

//     if (transformMode === 'translate' && bounds) {
//       const pos = groupRef.current.position;
//       const currentScale = groupRef.current.scale;

//       // ✅ Scale-aware bounds
//       const scaleY = currentScale.y || 1;
//       const scaleZ = currentScale.z || 1;

//       const dynamicYMin = bounds.yMin * scaleY;
//       const dynamicYMax = bounds.yMax / scaleY;
//       const dynamicZMin = bounds.zMin / scaleZ;
//       const dynamicZMax = bounds.zMax / scaleZ;

//       const clampedY = Math.max(dynamicYMin, Math.min(dynamicYMax, pos.y));
//       const clampedZ = Math.max(dynamicZMin, Math.min(dynamicZMax, pos.z));

//       const newPos = [bounds.xFixed, clampedY, clampedZ];
//       const changed = !lastPosition.current ||
//         lastPosition.current.some((v, i) => Math.abs(v - newPos[i]) > 0.01);

//       if (changed) {
//         console.log("🔄 [IMAGE] Position:", newPos.map(v => v.toFixed(2)));
//         lastPosition.current = newPos;
//         groupRef.current.position.set(...newPos);
//         onPositionChange?.(newPos);
//       }
//     }

//     if (transformMode === 'scale') {
//       const s = groupRef.current.scale;
//       const cx = Math.max(0.3, Math.min(2, s.x));
//       const cy = Math.max(0.3, Math.min(1.4, s.y));
//       const cz = Math.max(0.3, Math.min(4, s.z));

//       groupRef.current.scale.set(cx, cy, cz);
//       console.log("🔄 [IMAGE] Scale:", [cx.toFixed(2), cy.toFixed(2), cz.toFixed(2)]);
//       // ✅ Do NOT call onScaleChange here
//     }
//   };

//   const handleMouseUp = () => {
//     if (!groupRef.current || !isDragging.current) return;
//     isDragging.current = false;

//     if (transformMode === 'scale') {
//       const s = groupRef.current.scale;
//       const cx = Math.max(0.3, Math.min(2, s.x));
//       const cy = Math.max(0.3, Math.min(1.4, s.y));
//       const cz = Math.max(0.3, Math.min(4, s.z));
//       console.log("✅ [IMAGE] Scale saved on release:", [cx.toFixed(2), cy.toFixed(2), cz.toFixed(2)]);
//       onScaleChange?.([cx, cy, cz]);
//     }

//     if (transformMode === 'translate') {
//       const pos = groupRef.current.position;
//       const currentScale = groupRef.current.scale;

//       const scaleY = currentScale.y || 1;
//       const scaleZ = currentScale.z || 1;

//       const dynamicYMin = bounds.yMin * scaleY;
//       const dynamicYMax = bounds.yMax / scaleY;
//       const dynamicZMin = bounds.zMin / scaleZ;
//       const dynamicZMax = bounds.zMax / scaleZ;

//       const clampedY = Math.max(dynamicYMin, Math.min(dynamicYMax, pos.y));
//       const clampedZ = Math.max(dynamicZMin, Math.min(dynamicZMax, pos.z));
//       onPositionChange?.([bounds.xFixed, clampedY, clampedZ]);
//     }
//   };

//   return (
//     <>
//       <group ref={groupRef} position={position} scale={scale}>
//         <mesh rotation={rotation}>
//           <planeGeometry args={planeSize} />
//           <meshStandardMaterial
//             map={imageTexture}
//             transparent
//             alphaTest={0.1}
//             roughness={0.8}
//             metalness={0.0}
//             side={THREE.DoubleSide}
//             depthWrite={true}
//             depthTest={true}
//           />
//         </mesh>
//       </group>

//       {isEditMode && isActive && groupRef.current && (
//         <TransformControls
//           object={groupRef.current}
//           mode={transformMode}
//           space="world"
//           size={transformMode === 'scale' ? 2 : 4}
//           onObjectChange={handleTransformChange}
//           onMouseUp={handleMouseUp}   // ✅ Save on release
//           translationSnap={null}
//           scaleSnap={null}
//           showX={false}
//           showY={true}
//           showZ={true}
//         />
//       )}
//     </>
//   );
// }



// // ============================================================================
// // ENGRAVING EFFECT CONVERTER
// // ============================================================================
// async function applyEngravingEffect(imageSrc, engraveDepth = 0.7, textColor = "#4c3328") {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");

//       ctx.drawImage(img, 0, 0);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       const hexToRgb = (hex) => {
//         const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//         return result ? {
//           r: parseInt(result[1], 16),
//           g: parseInt(result[2], 16),
//           b: parseInt(result[3], 16)
//         } : { r: 76, g: 51, b: 40 };
//       };

//       const baseColor = hexToRgb(textColor);

//       for (let i = 0; i < data.length; i += 4) {
//         const r = data[i];
//         const g = data[i + 1];
//         const b = data[i + 2];
//         const alpha = data[i + 3];

//         const gray = (r * 0.299 + g * 0.587 + b * 0.114);
//         const brightness = gray / 255;
//         const darkness = 1 - brightness;

//         if (brightness > 0.85) {
//           data[i + 3] = 0;
//         } else if (brightness > 0.5) {
//           const intensity = (1 - brightness) * engraveDepth;
//           const lightFactor = 1.5;
//           data[i] = Math.floor(Math.min(255, baseColor.r * lightFactor));
//           data[i + 1] = Math.floor(Math.min(255, baseColor.g * lightFactor));
//           data[i + 2] = Math.floor(Math.min(255, baseColor.b * lightFactor));
//           data[i + 3] = Math.floor(alpha * intensity * 0.6);
//         } else if (brightness > 0.2) {
//           const intensity = darkness * engraveDepth;
//           data[i] = Math.floor(baseColor.r * intensity);
//           data[i + 1] = Math.floor(baseColor.g * intensity);
//           data[i + 2] = Math.floor(baseColor.b * intensity);
//           data[i + 3] = Math.floor(alpha * 0.85);
//         } else {
//           const intensity = darkness * engraveDepth;
//           const darkFactor = 0.7;
//           data[i] = Math.floor(baseColor.r * darkFactor * intensity);
//           data[i + 1] = Math.floor(baseColor.g * darkFactor * intensity);
//           data[i + 2] = Math.floor(baseColor.b * darkFactor * intensity);
//           data[i + 3] = alpha;
//         }
//       }

//       ctx.putImageData(imageData, 0, 0);
//       resolve(canvas.toDataURL());
//     };

//     img.onerror = reject;
//     img.src = imageSrc;
//   });
// }

// function svgToEngravingDataURL(svgPath) {
//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200">
//       <path fill="#000000" d="${svgPath}"/>
//     </svg>
//   `;
//   return `data:image/svg+xml;base64,${btoa(svg)}`;
// }

// // ============================================================================
// // TEXT TEXTURE
// // ============================================================================
// function getLines(ctx, text, maxWidth) {
//   const manualLines = text.split("\n");
//   const lines = [];

//   manualLines.forEach((line) => {
//     const words = line.split(" ");

//     if (words.length === 0 || line === "") {
//       lines.push("");
//       return;
//     }

//     let currentLine = words[0];

//     for (let i = 1; i < words.length; i++) {
//       const word = words[i];
//       const width = ctx.measureText(currentLine + " " + word).width;

//       if (width < maxWidth) {
//         currentLine += " " + word;
//       } else {
//         lines.push(currentLine);
//         currentLine = word;
//       }
//     }
//     lines.push(currentLine);
//   });

//   return lines;
// }

// async function createEngravedTextTexture(
//   text,
//   fontFamily,
//   fontSize = 140,
//   fontStyle = "normal",
//   fontWeight = "normal",
//   textColor = "#4c3328" // Add textColor parameter back
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) { }

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");

//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, baseWidth, baseHeight);

//   ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";

//   const maxWidth = baseWidth * 0.95;
//   const lines = getLines(ctx, text, maxWidth);
//   const lineHeight = fontSize * 1.1;
//   const totalHeight = lines.length * lineHeight;
//   let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//   lines.forEach((line, i) => {
//     const y = startY + i * lineHeight;
//     const x = baseWidth / 2;

//     ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
//     ctx.shadowBlur = 1;
//     ctx.shadowOffsetX = 3;
//     ctx.shadowOffsetY = 5;

//     ctx.fillStyle = textColor; // Use the textColor parameter
//     ctx.fillText(line, x, y);

//     ctx.shadowColor = "transparent";
//     ctx.shadowBlur = 0;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
//   });

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.magFilter = THREE.LinearFilter;
//   texture.minFilter = THREE.LinearFilter;
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }


// async function createCombinedEngravingTexture(
//   text,
//   fontFamily,
//   fontSize = 140,
//   fontStyle = "normal",
//   fontWeight = "normal",
//   imageSrc,
//   imageMode = "contain",
//   woodColor = "#d4a574",
//   textColor = "#4c3328"
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;

//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) { }

//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024;
//   const baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");
//   ctx.scale(dpr, dpr);

//   if (imageSrc) {
//     try {
//       const engravingImage = await applyEngravingEffect(imageSrc, 0.9, textColor);
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       await new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = reject;
//         img.src = engravingImage;
//       });

//       const imgAspect = img.width / img.height;
//       const canvasAspect = baseWidth / baseHeight;

//       let drawWidth, drawHeight, offsetX, offsetY;

//       if (imageMode === "cover") {
//         if (imgAspect > canvasAspect) {
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         } else {
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         }
//       } else {
//         if (imgAspect > canvasAspect) {
//           drawWidth = baseWidth;
//           drawHeight = baseWidth / imgAspect;
//           offsetX = 0;
//           offsetY = (baseHeight - drawHeight) / 2;
//         } else {
//           drawHeight = baseHeight;
//           drawWidth = baseHeight * imgAspect;
//           offsetX = (baseWidth - drawWidth) / 2;
//           offsetY = 0;
//         }
//       }

//       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   if (text) {
//     ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     const maxWidth = baseWidth * 0.9;
//     const lines = getLines(ctx, text, maxWidth);
//     const lineHeight = fontSize * 1.1;
//     const totalHeight = lines.length * lineHeight;
//     let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;

//     lines.forEach((line, i) => {
//       const y = startY + i * lineHeight;
//       const x = baseWidth / 2;

//       ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
//       ctx.shadowBlur = 1;
//       ctx.shadowOffsetX = 3;
//       ctx.shadowOffsetY = 5;

//       ctx.fillStyle = textColor;
//       ctx.fillText(line, x, y);

//       ctx.shadowColor = "transparent";
//       ctx.shadowBlur = 0;
//       ctx.shadowOffsetX = 0;
//       ctx.shadowOffsetY = 0;
//     });
//   }

//   const texture = new THREE.CanvasTexture(canvas);
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// // ============================================================================
// // CAMERA CONTROLLER
// // ============================================================================
// function CameraController({ zoom, rotation, reset }) {
//   const { camera } = useThree();
//   const initialPosition = useRef([8, 5, 8]);

//   useEffect(() => {
//     if (reset > 0) {
//       camera.position.set(...initialPosition.current);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [reset, camera]);

//   useEffect(() => {
//     const baseDistance = 10;
//     const newDistance = baseDistance / zoom;
//     const direction = camera.position.clone().normalize();
//     camera.position.copy(direction.multiplyScalar(newDistance));
//   }, [zoom, camera]);

//   useEffect(() => {
//     if (rotation !== 0) {
//       const axis = new THREE.Vector3(1, 0, 0);
//       camera.position.applyAxisAngle(axis, rotation);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [rotation, camera]);

//   return null;
// }

// // ============================================================================
// // WOOD TEXTURE
// // ============================================================================
// const createWoodTexture = (color) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = 512;
//   canvas.height = 512;
//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = color;
//   ctx.fillRect(0, 0, 512, 512);
//   for (let i = 0; i < 30; i++) {
//     ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
//     ctx.lineWidth = Math.random() * 2;
//     ctx.beginPath();
//     ctx.moveTo(0, Math.random() * 512);
//     ctx.bezierCurveTo(
//       128,
//       Math.random() * 512,
//       384,
//       Math.random() * 512,
//       512,
//       Math.random() * 512
//     );
//     ctx.stroke();
//   }
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(2, 2);
//   return texture;
// };

// // ============================================================================
// // INTERACTIVE TEXT PREVIEW
// // ============================================================================
// function InteractiveTextPreview({ text, position, onPositionChange, textColor, fontFamily, fontStyle, fontWeight, brickType }) {
//   const [isDragging, setIsDragging] = useState(false);
//   const [localPosition, setLocalPosition] = useState({ x: 50, y: 50 });
//   const containerRef = useRef();

//   // Get the correct Z value based on brick type
//   const getDefaultZ = () => {
//     if (brickType === "2x4-standard") return 3;
//     return 5; // for 2x2-plus and 2x4-plus
//   };

//   // Convert 3D position to 2D preview position
//   useEffect(() => {
//     if (position && position.length === 3) {
//       // The brick surface in 3D has these approximate ranges:
//       // X: 0 to 32 (center at 16) for 2x4-plus
//       // Y: 0 to 19.6 (center at 9.8) for 2x4-plus

//       const xRange = brickType === "2x4-standard" ? 16 : 32;
//       const yRange = brickType === "2x4-standard" ? 9.6 : 19.6;
//       const centerX = xRange / 2;
//       const centerY = yRange / 2;

//       // Map 3D coordinates to 2D percentage (0-100%)
//       // X: center is at 50%, scale to use 20%-80% range
//       const normalizedX = ((position[0] - centerX) / (xRange * 0.3)) * 30 + 50;

//       // Y: center is at 50%, scale to use 20%-80% range (inverted because Y is flipped)
//       const normalizedY = ((centerY - position[1]) / (yRange * 0.3)) * 30 + 50;

//       setLocalPosition({
//         x: Math.max(20, Math.min(80, normalizedX)),
//         y: Math.max(20, Math.min(80, normalizedY))
//       });
//     }
//   }, [position, brickType]);

//   const handleMouseDown = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !containerRef.current) return;

//     const rect = containerRef.current.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;

//     // Constrain to safe area (20%-80% to keep text visible)
//     const clampedX = Math.max(20, Math.min(80, x));
//     const clampedY = Math.max(20, Math.min(80, y));

//     setLocalPosition({ x: clampedX, y: clampedY });

//     // Convert 2D percentage back to 3D coordinates
//     const xRange = brickType === "2x4-standard" ? 16 : 32;
//     const yRange = brickType === "2x4-standard" ? 9.6 : 19.6;
//     const centerX = xRange / 2;
//     const centerY = yRange / 2;

//     // Map 2D percentage (20%-80% = ±30% from center) to 3D coords
//     const pos3DX = centerX + ((clampedX - 50) / 30) * (xRange * 0.3);
//     const pos3DY = centerY - ((clampedY - 50) / 30) * (yRange * 0.3);
//     const pos3DZ = getDefaultZ();

//     onPositionChange([pos3DX, pos3DY, pos3DZ]);
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };




//   useEffect(() => {
//     if (isDragging) {
//       window.addEventListener('mousemove', handleMouseMove);
//       window.addEventListener('mouseup', handleMouseUp);
//       return () => {
//         window.removeEventListener('mousemove', handleMouseMove);
//         window.removeEventListener('mouseup', handleMouseUp);
//       };
//     }
//   }, [isDragging, localPosition, brickType]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-64 border-2 border-amber-400 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden"
//       style={{ touchAction: 'none' }}
//     >
//       {/* Brick outline - safe area */}
//       <div className="absolute inset-8 border-2 border-amber-600 rounded bg-gradient-to-br from-amber-100 to-amber-200"></div>

//       {/* Draggable Text */}
//       {text && (
//         <div
//           className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
//           style={{
//             left: `${localPosition.x}%`,
//             top: `${localPosition.y}%`,
//             fontFamily: fontFamily,
//             fontStyle: fontStyle,
//             fontWeight: fontWeight,
//             color: textColor,
//             fontSize: '20px',
//             cursor: isDragging ? 'grabbing' : 'grab',
//             zIndex: 10,
//             padding: '4px 8px',
//             borderRadius: '4px',
//             backgroundColor: isDragging ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
//           }}
//           onMouseDown={handleMouseDown}
//         >
//           {text}

//           {/* Crosshair on text */}
//           <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
//             <div className="w-6 h-0.5 bg-red-500 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
//             <div className="w-0.5 h-6 bg-red-500 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
//           </div>
//         </div>
//       )}

//       {/* Grid lines */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 opacity-50"></div>
//         <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 opacity-50"></div>
//       </div>

//       {/* Instructions */}
//       {!isDragging && (
//         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs text-gray-700 shadow-sm pointer-events-none">
//           Click and drag text to reposition
//         </div>
//       )}

//       {/* Active dragging indicator */}
//       {isDragging && (
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg pointer-events-none">
//           Dragging...
//         </div>
//       )}
//     </div>
//   );
// }




// // ============================================================================
// // BRICK COMPONENT
// // ============================================================================
// function Brick({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   objFilePath,
//   isEditMode = false,
//   textPosition,
//   imagePosition,
//   onTextPositionChange,
//   onImagePositionChange,
//   editTarget,
//   textScale,
//   imageScale,
//   onTextScaleChange,
//   onImageScaleChange,
//   transformMode,
// }) {
//   const meshRef = useRef();
//   const brickModelPath = objFilePath || "/2X4 Plus Size_UVs.obj";
//   const obj = useLoader(OBJLoader, brickModelPath);
//   const [textTexture, setTextTexture] = useState(null);
//   const [imageTexture, setImageTexture] = useState(null);

//   // ✅ FIXED STANDARD SIZE FOR ALL IMAGES — change these two values to resize
//   const IMAGE_WIDTH = 30;  // ← change this
//   const IMAGE_HEIGHT = 15;  // ← change this

//   // ✅ brickDimensions defined first before everything
//   const brickDimensions = {
//     "2x2-plus": { width: 2, height: 1.2, depth: 2 },
//     "2x4-plus": { width: 4, height: 1.2, depth: 2 },
//     "2x4-standard": { width: 4, height: 1.2, depth: 2 },
//   };
//   const dims = brickDimensions[brickType];

//   // ✅ Text texture
//   useEffect(() => {
//     let mounted = true;
//     let current = null;

//     if (text) {
//       createEngravedTextTexture(text, fontFamily, 100, fontStyle, fontWeight, textColor)
//         .then((tex) => {
//           if (!mounted) { tex.dispose(); return; }
//           setTextTexture(tex);
//           current = tex;
//         })
//         .catch(() => { });
//     } else {
//       setTextTexture(null);
//     }

//     return () => {
//       mounted = false;
//       if (current) current.dispose();
//     };
//   }, [text, fontFamily, fontStyle, fontWeight, textColor]);

//   // ✅ Image texture
//   useEffect(() => {
//     let mounted = true;
//     let current = null;

//     if (uploadedImage) {
//       createImageOnlyTexture(uploadedImage, imageMode, textColor)
//         .then((tex) => {
//           if (!mounted) { tex.dispose(); return; }
//           setImageTexture(tex);
//           current = tex;
//         })
//         .catch(() => { });
//     } else {
//       setImageTexture(null);
//     }

//     return () => {
//       mounted = false;
//       if (current) current.dispose();
//     };
//   }, [uploadedImage, imageMode, textColor]);

//   // ✅ Text plane config
//   const textPlaneConfig = {
//     "2x2-plus": {
//       position: textPosition || [16, 9.8, 5],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-plus": {
//       position: textPosition || [16, 9.8, 1],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 14, dims.height * 14],
//     },
//     "2x4-standard": {
//       position: textPosition || [8, 4.8, 2],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [dims.width * 7, dims.height * 7],
//     },
//   };

//   // ✅ Image plane config — ALL use fixed IMAGE_WIDTH x IMAGE_HEIGHT
//   const imagePlaneConfig = {
//     "2x2-plus": {
//       position: imagePosition || [16, 9.8, 4.8],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [IMAGE_WIDTH, IMAGE_HEIGHT],
//     },
//     "2x4-plus": {
//       position: imagePosition || [16, 9.8, 2],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [IMAGE_WIDTH, IMAGE_HEIGHT],
//     },
//     "2x4-standard": {
//       position: imagePosition || [8, 4.8, 2.2],
//       rotation: [0, Math.PI / 2, 0],
//       planeSize: [IMAGE_WIDTH, IMAGE_HEIGHT],
//     },
//   };

//   const textConfig = textPlaneConfig[brickType];
//   const imageConfig = imagePlaneConfig[brickType];

//   // ✅ Static text bounds
//   const textBounds = {
//     "2x4-plus": {
//       xFixed: 16,
//       yMin: 1,
//       yMax: 16,
//       zMin: -20,
//       zMax: 20,
//     },
//     "2x2-plus": {
//       xFixed: 16,
//       yMin: -4,
//       yMax: 4,
//       zMin: -4,
//       zMax: 4,
//     },
//     "2x4-standard": {
//       xFixed: 8,
//       yMin: -4,
//       yMax: 4,
//       zMin: -2,
//       zMax: 2,
//     },
//   };

//   // ✅ Image bounds based on fixed IMAGE_WIDTH and IMAGE_HEIGHT
//   // These are now consistent for every image since size is fixed
//   const imageBounds = {
//     "2x4-plus": {
//       xFixed: 16,
//       yMin: 1 + IMAGE_HEIGHT / 3,
//       yMax: 17 - IMAGE_HEIGHT / 3,
//       zMin: -(IMAGE_WIDTH / 2) * 1.6,
//       zMax: (IMAGE_WIDTH / 2) * 1.6,
//     },
//     "2x2-plus": {
//       xFixed: 16,
//       yMin: 1 + IMAGE_HEIGHT / 2,
//       yMax: 17 - IMAGE_HEIGHT / 2,
//       zMin: -(IMAGE_WIDTH / 2) * 0.8,
//       zMax: (IMAGE_WIDTH / 2) * 0.8,
//     },
//     "2x4-standard": {
//       xFixed: 8,
//       yMin: 0.5 + IMAGE_HEIGHT / 2,
//       yMax: 9 - IMAGE_HEIGHT / 2,
//       zMin: -(IMAGE_WIDTH / 2) * 0.6,
//       zMax: (IMAGE_WIDTH / 2) * 0.6,
//     },
//   };

//   const activeTextBounds = textBounds[brickType];
//   const activeImageBounds = imageBounds[brickType];

//   const modelScale = 0.15;
//   const scaleMultiplier = brickType === "2x4-standard" ? 2.0 * modelScale : modelScale;

//   const clonedObj = React.useMemo(() => {
//     const cloned = obj.clone();
//     const woodTexture = createWoodTexture(woodColor);

//     cloned.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: woodColor,
//           roughness: 0.7,
//           metalness: 0.1,
//           map: woodTexture,
//         });
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });

//     return cloned;
//   }, [obj, woodColor]);

//   return (
//     <group ref={meshRef} scale={scaleMultiplier} position={[0, -1, 0]}>
//       <primitive object={clonedObj} />

//       {imageTexture && (
//         <DraggableImageLayer
//           imageTexture={imageTexture}
//           position={imageConfig.position}
//           rotation={imageConfig.rotation}
//           planeSize={imageConfig.planeSize}
//           isEditMode={isEditMode}
//           isActive={editTarget === 'image'}
//           onPositionChange={onImagePositionChange}
//           onScaleChange={onImageScaleChange}
//           scale={imageScale}
//           transformMode={transformMode}
//           bounds={activeImageBounds}
//         />
//       )}

//       {textTexture && (
//         <DraggableTextLayer
//           textTexture={textTexture}
//           position={textConfig.position}
//           rotation={textConfig.rotation}
//           planeSize={textConfig.planeSize}
//           isEditMode={isEditMode}
//           isActive={editTarget === 'text'}
//           onPositionChange={onTextPositionChange}
//           onScaleChange={onTextScaleChange}
//           scale={textScale}
//           transformMode={transformMode}
//           bounds={activeTextBounds}
//         />
//       )}
//     </group>
//   );
// }

// // ============================================================================
// // SCENE
// // ============================================================================
// function Scene({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   zoom,
//   reset,
//   objFilePath,
//   isEditMode,
//   textPosition,
//   imagePosition,
//   onTextPositionChange,
//   onImagePositionChange,
//   textScale,  // ✅ ADD THIS
//   imageScale,  // ✅ ADD THIS
//   onTextScaleChange,  // ✅ ADD THIS
//   onImageScaleChange,  // ✅ ADD THIS
//   transformMode,  // ✅ ADD THIS
//   editTarget,
// }) {
//   return (
//     <>
//       <CameraController zoom={zoom} rotation={0} reset={reset} />
//       <ambientLight intensity={0.5} />
//       <directionalLight
//         position={[5, 8, 5]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
//       <spotLight position={[-5, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} castShadow />
//       <Suspense fallback={null}>
//         <Brick
//           text={text}
//           brickType={brickType}
//           woodColor={woodColor}
//           uploadedImage={uploadedImage}
//           textColor={textColor}
//           fontFamily={fontFamily}
//           fontStyle={fontStyle}
//           fontWeight={fontWeight}
//           imageMode={imageMode}
//           objFilePath={objFilePath}
//           isEditMode={isEditMode}
//           textPosition={textPosition}
//           imagePosition={imagePosition}
//           onTextPositionChange={onTextPositionChange}
//           onImagePositionChange={onImagePositionChange}
//           textScale={textScale}  // ✅ Add
//           imageScale={imageScale}  // ✅ Add
//           onTextScaleChange={onTextScaleChange}  // ✅ CORRECT - use the prop passed to Scene
//           onImageScaleChange={onImageScaleChange}
//           transformMode={transformMode}  // ✅ Add
//           editTarget={editTarget}

//         />
//       </Suspense>
//       <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2} far={4} />
//       <Environment preset="warehouse" />
//       <OrbitControls
//         enablePan={false}
//         enableZoom={true}
//         minDistance={5}
//         maxDistance={25}
//         enableRotate={false} // ✅ Keep rotation disabled always
//         enabled={!isEditMode} // ✅ Only disable everything during edit mode
//       />
//     </>
//   );
// }

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================
// export default function EngravedBrickCustomizer() {
//   const getProductIdFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('product_id') || '16';
//   };

//   const [productId] = useState(getProductIdFromUrl());
//   const [productData, setProductData] = useState(null);
//   const [templateData, setTemplateData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [text, setText] = useState("");
//   const [brickType, setBrickType] = useState("2x4-plus");
//   const [quantity, setQuantity] = useState(1);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//   const [woodColor, setWoodColor] = useState("#d4a574");
//   const [fontStyle, setFontStyle] = useState("normal");
//   const [textColor, setTextColor] = useState("#4c3328");
//   const [fontWeight, setFontWeight] = useState("normal");
//   const [fontFamily, setFontFamily] = useState("Adamina");
//   const [imageMode, setImageMode] = useState("contain");
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showClipart, setShowClipart] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [zoom, setZoom] = useState(1);
//   const [resetTrigger, setResetTrigger] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [textPosition, setTextPosition] = useState(null);
//   const [imagePosition, setImagePosition] = useState(null); // Add this
//   const [editTarget, setEditTarget] = useState('text'); // Add this: 'text' or 'image'
//   const [textScale, setTextScale] = useState([1, 1, 1]);
//   const [imageScale, setImageScale] = useState([1, 1, 1]);
//   const [transformMode, setTransformMode] = useState('translate');
//   const prevZoomRef = useRef(null);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/product/${productId}`
//         );

//         if (!response.ok) throw new Error('Failed to fetch product data');
//         const result = await response.json();
//         console.log("API RESPONSE ❤: ", result);


//         if (result.success && result.data) {
//           setProductData(result.data);
//           setTemplateData(result.predefined_template);
//         } else {
//           throw new Error('Invalid API response');
//         }

//         setLoading(false);
//       } catch (err) {
//         console.error('API Error:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProductData();
//   }, [productId]);

//   const fontOptions = {
//     Adamina: "Adamina",
//     Aladin: "Aladin",
//     "Amatic SC": "Amatic SC",
//     Amiri: "Amiri",
//     Arimo: "Arimo",
//     Arizonia: "Arizonia",
//     "Berkshire Swash": "Berkshire Swash",
//     Cairo: "Cairo",
//     Condiment: "Condiment",
//     Cookie: "Cookie",
//     Damion: "Damion",
//     "EB Garamond": "EB Garamond",
//     Fondamento: "Fondamento",
//     "Gloria Hallelujah": "Gloria Hallelujah",
//     "Rock Salt": "Rock Salt",
//     Rubik: "Rubik",
//     "Shippori Mincho": "Shippori Mincho",
//     Tinos: "Tinos",
//     "Trail One": "Trail One",
//     "ZCOOL XiaoWei": "ZCOOL XiaoWei",
//     Roboto: "Roboto",
//     "Open Sans": "Open Sans",
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadedFile(file.name);
//       const imageUrl = URL.createObjectURL(file);
//       setUploadedImageUrl(imageUrl);
//     }
//   };

//   const handleClipartSelect = (svgPath) => {
//     const dataUrl = svgToEngravingDataURL(svgPath);
//     setUploadedImageUrl(dataUrl);
//     setUploadedFile("clipart");
//     setShowClipart(false);
//   };


//   const handleTemplateSelect = (templateId) => {
//     const template = templateData.find(t => t.id === templateId);

//     if (!template) return;

//     setSelectedTemplate(templateId);

//     // ✅ Check multiple conditions for Custom template
//     const isCustomTemplate =
//       template.category === "Custom" ||
//       template.name === "Custom" ||
//       template.id === 52 || // Your Custom template ID
//       (template.template.text === "" && template.img_url === "");

//     if (isCustomTemplate) {
//       // Clear everything for custom template
//       setText("");
//       clearImage();
//       console.log("Custom template selected - cleared all content");
//     } else {
//       // Set the text from template
//       setText(template.template.text || "");

//       // If template has an image, load it
//       if (template.img_url && template.img_url !== "") {
//         setUploadedImageUrl(template.img_url);
//         setUploadedFile("template-image");
//       } else {
//         // Clear image if template doesn't have one
//         clearImage();
//       }

//       console.log("Template applied:", template.name);
//     }

//     setShowTemplates(false);
//   };

//   const clearImage = () => {
//     setUploadedFile(null);
//     if (uploadedImageUrl && !uploadedImageUrl.startsWith('data:')) {
//       URL.revokeObjectURL(uploadedImageUrl);
//     }
//     setUploadedImageUrl(null);
//   };
//   const handleZoomIn = () => setZoom((prev) => Math.min(2, prev + 0.1));
//   const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.1));
//   const handleReset = () => {
//     // setZoom(1);
//     // setResetTrigger((prev) => prev + 1);

//     setUploadedFile(null);
//     if (uploadedImageUrl && !uploadedImageUrl.startsWith('data:')) {
//       URL.revokeObjectURL(uploadedImageUrl);
//     }
//     setUploadedImageUrl(null);
//     setText('')
//     setSelectedTemplate(null)


//   };


//   const toggleFullscreen = () => {
//     setIsFullscreen((prev) => {
//       const entering = !prev;
//       if (entering) {
//         prevZoomRef.current = zoom;
//         setZoom(Math.max(0.5, zoom * 0.7));
//       } else {
//         if (prevZoomRef.current != null) setZoom(prevZoomRef.current);
//       }
//       return entering;
//     });
//   };

//   const handleTextPositionChange = (newPosition) => {
//     setTextPosition(newPosition);
//     console.log("Text position updated:", newPosition);
//   };





//   const toggleEditMode = () => {
//     setIsEditMode(!isEditMode);
//     if (isEditMode) {
//       toast.success("Text position saved!", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     }
//     else {
//       // alert("🎯 Drag text in the preview to reposition");
//     }
//   };


//   const handleImagePositionChange = (newPosition) => {
//     setImagePosition(newPosition);
//     console.log("Image position updated:", newPosition);
//   };




//   const handleTextScaleChange = (newScale) => {
//     setTextScale(newScale);
//     console.log("Text scale updated:", newScale);
//   };

//   const handleImageScaleChange = (newScale) => {
//     setImageScale(newScale);
//     console.log("Image scale updated:", newScale);
//   };





//   const price = productData?.price ? parseFloat(productData.price) : 19.99;
//   const total = (price * quantity).toFixed(2);


//   const captureScreenshot = async () => {
//     return new Promise((resolve) => {
//       // Get the canvas element from Three.js
//       const canvas = document.querySelector('canvas');

//       if (!canvas) {
//         console.error('Canvas not found');
//         resolve(null);
//         return;
//       }

//       // IMPORTANT: Wait for next frame to ensure scene is fully rendered
//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           // Double requestAnimationFrame ensures rendering is complete

//           try {
//             // Convert canvas to data URL for debugging
//             const dataURL = canvas.toDataURL('image/png', 0.95);

//             // Convert data URL to blob for upload
//             canvas.toBlob(
//               (blob) => {
//                 if (blob) {
//                   console.log('Screenshot captured:', blob.size, 'bytes');
//                   resolve({ blob, dataURL });
//                 } else {
//                   console.error('Failed to create blob from canvas');
//                   resolve(null);
//                 }
//               },
//               'image/png',
//               0.95
//             );
//           } catch (error) {
//             console.error('Error capturing screenshot:', error);
//             resolve(null);
//           }
//         });
//       });
//     });
//   };




//   const addToCart = async (event) => {
//     event.preventDefault();

//     const orderDetails = {
//       brickType,
//       woodColor,
//       text: text || "None",
//       image: uploadedFile || "None",
//       template: selectedTemplate || "custom",
//       quantity,
//       total,
//       engravingStyle: "carved-engraving",
//       textPosition: textPosition || "default",
//       imagePosition: imagePosition || "default",
//     };

//     try {
//       const button = event.target;
//       button.disabled = true;
//       button.textContent = "Adding to cart...";

//       // Show loading toast
//       const loadingToast = toast.loading("Capturing preview and adding to cart...");

//       console.log("🚀 Starting cart submission...");
//       console.log("Order Details Object:", orderDetails);

//       // ✅ CAPTURE SCREENSHOT FROM CANVAS
//       const screenshot = await captureScreenshot();

//       if (!screenshot) {
//         toast.update(loadingToast, {
//           render: "Failed to capture screenshot",
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//         throw new Error("Failed to capture screenshot");
//       }

//       console.log("📸 Screenshot captured successfully");

//       const formData = new FormData();
//       formData.append("brick_type", brickType);
//       formData.append("wood_color", woodColor);
//       formData.append("text", text || "");
//       formData.append("template", selectedTemplate || "custom");
//       formData.append("quantity", quantity);
//       formData.append("price", price);
//       formData.append("total", total);
//       formData.append("engraving_style", "carved-engraving");
//       formData.append("font_family", fontFamily);
//       formData.append("font_style", fontStyle);
//       formData.append("font_weight", fontWeight);
//       formData.append("text_color", textColor);
//       formData.append("image_mode", imageMode);
//       formData.append("product_id", productId);
//       formData.append("text_position", JSON.stringify(textPosition || "default"));
//       formData.append("image_position", JSON.stringify(imagePosition || "default"));

//       // ✅ APPEND SCREENSHOT
//       formData.append("brick_screenshot", screenshot.blob, "brick-preview.png");

//       // Uploaded image / clipart handling
//       if (uploadedImageUrl && uploadedFile !== "clipart") {
//         const response = await fetch(uploadedImageUrl);
//         const blob = await response.blob();
//         formData.append("image", blob, uploadedFile);
//         formData.append("image_type", "upload");
//       } else if (uploadedFile === "clipart") {
//         formData.append("clipart", uploadedImageUrl);
//         formData.append("image_type", "clipart");
//       }

//       console.log("📦 Submitting FormData");

//       const apiResponse = await fetch(
//         "https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/submit",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       console.log("📡 API Response Status:", apiResponse.status);

//       if (!apiResponse.ok) {
//         throw new Error(`HTTP error! status: ${apiResponse.status}`);
//       }

//       const result = await apiResponse.json();
//       console.log("✅ API Response:", result);

//       if (result.success) {
//         console.log("✅ Successfully added to cart", result.data);

//         toast.update(loadingToast, {
//           render: "Successfully added to cart! 🎉",
//           type: "success",
//           isLoading: false,
//           autoClose: 2000,
//         });

//         // Redirect after toast
//         setTimeout(() => {
//           if (result?.redirect_url) {
//             window.location.href = result.redirect_url;
//           }
//         }, 2000);
//       } else {
//         throw new Error(result.message || "Failed to add to cart");
//       }

//     } catch (error) {
//       console.error("❌ Error adding to cart:", error);
//       toast.error(`Failed to add to cart: ${error.message}`, {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     } finally {
//       const button = event?.target;
//       if (button) {
//         button.disabled = false;
//         button.textContent = "Add to cart";
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-xl">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
//             <p className="text-lg font-semibold">Loading product data...</p>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
//           <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Product</h2>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {!loading && !error && productData && (
//         <div className="max-w-7xl mx-auto p-6 pb-32">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">Step 2: Upload Artwork</h1>
//             <p className="text-gray-600">Customize your wooden brick with carved laser engraving</p>
//             <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
//               ✨ All designs automatically converted to 3D carved engraving style
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">




//             {/* CENTER - 3D Canvas */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {/* CONTROLS ABOVE SCENE */}
//                 <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 flex-wrap">
//                   <button
//                     onClick={handleZoomIn}
//                     className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
//                   >
//                     <ZoomIn className="w-4 h-4" />
//                     <span>Zoom In</span>
//                   </button>
//                   <button
//                     onClick={handleZoomOut}
//                     className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
//                   >
//                     <ZoomOut className="w-4 h-4" />
//                     <span>Zoom Out</span>
//                   </button>
//                   <button
//                     onClick={handleReset}
//                     className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
//                   >
//                     <Undo className="w-4 h-4" />
//                     <span>Reset</span>
//                   </button>

//                   <button
//                     onClick={toggleEditMode}
//                     className={`flex items-center justify-center gap-1 px-4 py-2 border-2 rounded font-medium transition-colors text-sm ml-auto ${isEditMode
//                       ? "border-green-600 bg-green-50 text-green-700"
//                       : "border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100"
//                       }`}
//                   >
//                     {isEditMode ? (
//                       <>
//                         <Check className="w-4 h-4" />
//                         <span>Done Moving</span>
//                       </>
//                     ) : (
//                       <>
//                         <Move className="w-4 h-4" />
//                         <span>Move Text Position</span>
//                       </>
//                     )}
//                   </button>

//                   <button
//                     onClick={toggleFullscreen}
//                     className="p-2 hover:bg-gray-100 rounded transition-colors"
//                     title="Fullscreen"
//                   >
//                     <Maximize2 className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div
//                   className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${isFullscreen ? "fixed inset-0 z-50" : ""
//                     }`}
//                   style={{ height: isFullscreen ? "100vh" : "600px" }}
//                 >
//                   <Canvas camera={{ position: [1, 0, 0], fov: 70 }} shadows>
//                     <Scene
//                       text={text}
//                       brickType={brickType}
//                       woodColor={woodColor}
//                       uploadedImage={uploadedImageUrl}
//                       textColor={textColor}
//                       fontFamily={fontFamily}
//                       fontStyle={fontStyle}
//                       fontWeight={fontWeight}
//                       imageMode={imageMode}
//                       zoom={zoom}
//                       reset={resetTrigger}
//                       objFilePath={productData?.obj_file}
//                       isEditMode={isEditMode}
//                       textPosition={textPosition}
//                       imagePosition={imagePosition}
//                       onTextPositionChange={handleTextPositionChange}
//                       onImagePositionChange={handleImagePositionChange}
//                       textScale={textScale}  // ✅ ADD THIS
//                       imageScale={imageScale}  // ✅ ADD THIS
//                       onTextScaleChange={handleTextScaleChange}  // ✅ ADD THIS
//                       onImageScaleChange={handleImageScaleChange}  // ✅ ADD THIS
//                       transformMode={transformMode}  // ✅ ADD THIS
//                       editTarget={editTarget}
//                     />
//                   </Canvas>


//                   {isFullscreen && (
//                     <button
//                       onClick={toggleFullscreen}
//                       className="absolute top-4 left-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <Maximize2 className="w-6 h-6" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Templates */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-semibold">📋 Predefined Templates</h3>
//                   <button
//                     onClick={() => setShowTemplates(!showTemplates)}
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     {showTemplates ? "Hide" : "Show"} Templates
//                   </button>
//                 </div>

//                 {showTemplates && templateData && (
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {templateData.map((template) => {
//                       const isCustom = template.category === "Custom" || template.name === "Custom";

//                       return (
//                         <button
//                           key={template.id}
//                           onClick={() => handleTemplateSelect(template.id)}
//                           className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${selectedTemplate === template.id
//                             ? "border-blue-600 bg-blue-50 shadow-lg"
//                             : isCustom
//                               ? "border-dashed border-gray-400 bg-gray-50"
//                               : "border-gray-300 hover:border-gray-400"
//                             }`}
//                         >
//                           {/* Rest of template card */}
//                           {isCustom && (
//                             <div className="flex items-center justify-center h-32 mb-3">
//                               <div className="text-center text-gray-400">
//                                 <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                 </svg>
//                                 <div className="text-sm font-medium">Start from scratch</div>
//                               </div>
//                             </div>
//                           )}

//                           {!isCustom && template.img_url && (
//                             <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
//                               <img
//                                 src={template.img_url}
//                                 alt={template.name}
//                                 className="w-full h-32 object-cover"
//                                 onError={(e) => {
//                                   e.target.parentElement.style.display = 'none';
//                                 }}
//                               />
//                             </div>
//                           )}

//                           <div className="font-semibold text-sm mb-1">{template.name}</div>
//                           <div className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
//                             {template.category}
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* LEFT SIDEBAR */}
//             <div className="lg:col-span-1 space-y-4">
//               {/* Text Panel */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">





//                 <h3 className="font-semibold mb-3 text-lg">Text (Carved Engraving)</h3>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Text</label>
//                     <textarea
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       placeholder="Enter text..."
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                     />
//                     <div className="text-xs text-gray-500 mt-1">{text.length} characters</div>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Font</label>
//                     <select
//                       value={fontFamily}
//                       onChange={(e) => setFontFamily(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       {Object.keys(fontOptions).map((f) => (
//                         <option key={f} value={fontOptions[f]}>
//                           {f}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Style</label>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}
//                         className={`flex-1 px-3 py-2 border rounded-lg text-sm font-bold transition-colors ${fontWeight === "bold"
//                           ? "border-blue-600 bg-blue-50 text-blue-700"
//                           : "border-gray-300 hover:border-gray-400"
//                           }`}
//                       >
//                         B
//                       </button>
//                       <button
//                         onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}
//                         className={`flex-1 px-3 py-2 border rounded-lg text-sm italic transition-colors ${fontStyle === "italic"
//                           ? "border-blue-600 bg-blue-50 text-blue-700"
//                           : "border-gray-300 hover:border-gray-400"
//                           }`}
//                       >
//                         I
//                       </button>
//                     </div>
//                   </div>

//                   {/* <div>
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Engraving Color</label>
//                     <div className="flex gap-2 flex-wrap">
//                       {["#4c3328", "#654321", "#000000", "#ffffff", "#8b4513"].map((color) => (
//                         <button
//                           key={color}
//                           onClick={() => setTextColor(color)}
//                           className={`w-12 h-12 rounded-lg border-2 transition-all ${
//                             textColor === color ? "border-blue-600 scale-110" : "border-gray-300"
//                           }`}
//                           style={{ backgroundColor: color }}
//                           title={color}
//                         />
//                       ))}
//                     </div>
//                   </div> */}

//                   <div className="space-y-2 pt-2 border-t">
//                     <button
//                       onClick={() => setText("")}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
//                     >
//                       Clear Text
//                     </button>
//                     <button
//                       onClick={() => setShowClipart(!showClipart)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <ImageIcon className="w-4 h-4" />
//                       Browse Clip-Art Library
//                     </button>
//                     <button
//                       onClick={() => document.getElementById("fileInput").click()}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
//                     >
//                       ⊕ Upload Custom Image
//                     </button>
//                     <input
//                       id="fileInput"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                     />
//                   </div>
//                 </div>


//                 {isEditMode && (
//                   <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 z-10 min-w-[280px]">

//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                           <Move className="w-4 h-4 text-blue-600" />
//                         </div>
//                         <h3 className="font-semibold text-lg">Edit Position</h3>
//                       </div>
//                       <button
//                         onClick={toggleEditMode}
//                         className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
//                       >
//                         <Check className="w-4 h-4" />
//                         Done
//                       </button>
//                     </div>

//                     {/* Divider */}
//                     <div className="border-t border-gray-100 mb-4" />

//                     {/* Transform Mode Toggle */}
//                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
//                       Transform Mode
//                     </p>
//                     <div className="mb-4 flex gap-2">
//                       <button
//                         onClick={() => setTransformMode('translate')}
//                         className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${transformMode === 'translate'
//                           ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
//                           : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
//                           }`}
//                       >
//                         <MousePointer2 className="w-4 h-4" />
//                         Move
//                       </button>
//                       <button
//                         onClick={() => setTransformMode('scale')}
//                         className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${transformMode === 'scale'
//                           ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
//                           : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
//                           }`}
//                       >
//                         <Expand className="w-4 h-4" />
//                         Scale
//                       </button>
//                     </div>

//                     {/* Target Selection */}
//                     <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
//                       Edit Target
//                     </p>
//                     <div className="mb-4 flex gap-2">
//                       {/* Text Button */}
//                       {text ? (
//                         <button
//                           onClick={() => setEditTarget('text')}
//                           className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${editTarget === 'text'
//                             ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
//                             : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
//                             }`}
//                         >
//                           <Type className="w-4 h-4" />
//                           Text
//                         </button>
//                       ) : (
//                         <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-200 text-gray-300 cursor-not-allowed select-none">
//                           <Ban className="w-4 h-4" />
//                           No Text
//                         </div>
//                       )}

//                       {/* Image Button */}
//                       {uploadedImageUrl ? (
//                         <button
//                           onClick={() => setEditTarget('image')}
//                           className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${editTarget === 'image'
//                             ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
//                             : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
//                             }`}
//                         >
//                           <ImageIcon className="w-4 h-4" />
//                           Image
//                         </button>
//                       ) : (
//                         <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-200 text-gray-300 cursor-not-allowed select-none">
//                           <Ban className="w-4 h-4" />
//                           No Image
//                         </div>
//                       )}
//                     </div>

//                     {/* Active target badge */}
//                     <div className={`mb-3 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${editTarget === 'text'
//                       ? 'bg-blue-50 text-blue-700 border border-blue-200'
//                       : 'bg-purple-50 text-purple-700 border border-purple-200'
//                       }`}>
//                       {editTarget === 'text'
//                         ? <Type className="w-3.5 h-3.5 flex-shrink-0" />
//                         : <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
//                       }
//                       Editing: <strong className="ml-0.5">{editTarget === 'text' ? 'Text Layer' : 'Image Layer'}</strong>
//                     </div>

//                     {/* Instructions */}
//                     <div className={`p-3 rounded-lg text-sm flex items-start gap-2.5 ${transformMode === 'translate'
//                       ? 'bg-blue-50 border border-blue-200 text-blue-800'
//                       : 'bg-purple-50 border border-purple-200 text-purple-800'
//                       }`}>
//                       {transformMode === 'translate'
//                         ? <Target className="w-4 h-4 flex-shrink-0 mt-0.5" />
//                         : <Expand className="w-4 h-4 flex-shrink-0 mt-0.5" />
//                       }
//                       <span>
//                         {transformMode === 'translate'
//                           ? `Drag the colored arrows in the 3D view to reposition the ${editTarget}.`
//                           : `Drag the colored cubes in the 3D view to resize the ${editTarget}.`
//                         }
//                       </span>
//                     </div>

//                   </div>
//                 )}

//               </div>

//               {uploadedImageUrl && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Uploaded Image</span>
//                     <button onClick={clearImage} className="text-sm text-red-600 hover:text-red-700">
//                       Remove
//                     </button>
//                   </div>
//                   <img src={uploadedImageUrl} alt="Preview" className="w-full rounded border border-gray-200 mb-3" />

//                   <div className="space-y-2">
//                     <label className="text-xs font-medium text-gray-600 block">Image Fit Mode</label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={() => setImageMode("contain")}
//                         className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "contain"
//                           ? "border-blue-600 bg-blue-50 font-medium text-blue-700"
//                           : "border-gray-300 hover:border-gray-400"
//                           }`}
//                       >
//                         Fit
//                       </button>
//                       <button
//                         onClick={() => setImageMode("cover")}
//                         className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "cover"
//                           ? "border-blue-600 bg-blue-50 font-medium text-blue-700"
//                           : "border-gray-300 hover:border-gray-400"
//                           }`}
//                       >
//                         Fill
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {showClipart && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-h-96 overflow-y-auto">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold">🎨 Clip-Art Library</h3>
//                     <button
//                       onClick={() => setShowClipart(false)}
//                       className="text-sm text-gray-600 hover:text-gray-700"
//                     >
//                       ✕
//                     </button>
//                   </div>

//                   {Object.entries(CLIPART_LIBRARY).map(([key, category]) => (
//                     <div key={key} className="mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
//                       <div className="grid grid-cols-3 gap-2">
//                         {category.items.map((item) => (
//                           <button
//                             key={item.id}
//                             onClick={() => handleClipartSelect(item.svg)}
//                             className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
//                             title={item.name}
//                           >
//                             <svg viewBox="0 0 24 24" className="w-full h-12" fill="#000">
//                               <path d={item.svg} />
//                             </svg>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>


//           </div>

//           {/* Bottom Bar */}
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//               <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
//                 <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                   <label className="text-sm font-medium">Quantity</label>
//                   <div className="flex items-center border border-gray-300 rounded w-full sm:w-auto">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-3 py-1 hover:bg-gray-50"
//                     >
//                       −
//                     </button>
//                     <input
//                       type="number"
//                       value={quantity}
//                       onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
//                       className="w-full sm:w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
//                     />
//                     <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-gray-50">
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
//                   <div className="text-center sm:text-right">
//                     <div className="text-2xl font-bold">${total}</div>
//                     <div className="text-xs text-gray-500">{productData?.name || "3D Model"}</div>
//                   </div>
//                   <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
//                     <button
//                       onClick={addToCart}
//                       className="px-8 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 w-full sm:w-auto"
//                     >
//                       Add to cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}


//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </div>
//   );
// }














// CODE 5 WITH PREVIEW FUNCTIONALITY

// @ts-nocheck
// import React, { useState, Suspense, useRef, useEffect } from "react";
// import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
// import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
// import * as THREE from "three";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import {
//   ZoomIn,
//   ZoomOut,
//   Undo,
//   Maximize2,
//   Image as ImageIcon,
//   Move,
//   Check,
// } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // ============================================================================
// // CLIP-ART LIBRARY
// // ============================================================================
// const CLIPART_LIBRARY = {
//   hearts: {
//     id: "hearts",
//     category: "Romance",
//     items: [
//       {
//         id: "heart-1",
//         name: "Heart",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
//       },
//       {
//         id: "heart-2",
//         name: "Double Hearts",
//         svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09M16 4.5c1.74 0 3.41.81 4.5 2.09 1.08 1.28 1.5 2.91 1.5 4.91",
//       },
//     ],
//   },
//   rings: {
//     id: "rings",
//     category: "Wedding",
//     items: [
//       {
//         id: "rings-1",
//         name: "Wedding Rings",
//         svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M16 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z",
//       },
//       {
//         id: "rings-2",
//         name: "Diamond Ring",
//         svg: "M12 2L4 9l8 13 8-13-8-7zm0 3.5L15.5 9h-7L12 5.5z",
//       },
//     ],
//   },
//   flowers: {
//     id: "flowers",
//     category: "Nature",
//     items: [
//       {
//         id: "flower-1",
//         name: "Rose",
//         svg: "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
//       },
//       {
//         id: "flower-2",
//         name: "Tulip",
//         svg: "M12 2C8.5 2 6 4.5 6 8c0 3 2 5.5 4.5 6.5V22h3v-7.5C16 13.5 18 11 18 8c0-3.5-2.5-6-6-6z",
//       },
//     ],
//   },
//   crosses: {
//     id: "crosses",
//     category: "Religious",
//     items: [
//       {
//         id: "cross-1",
//         name: "Simple Cross",
//         svg: "M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z",
//       },
//       {
//         id: "cross-2",
//         name: "Ornate Cross",
//         svg: "M12 2L10 6h4l-2-4zm0 20l2-4h-4l2 4zM2 12l4-2v4l-4-2zm20 0l-4 2v-4l4 2z M11 7h2v10h-2z M7 11h10v2H7z",
//       },
//     ],
//   },
//   stars: {
//     id: "stars",
//     category: "Decorative",
//     items: [
//       {
//         id: "star-1",
//         name: "Star",
//         svg: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
//       },
//       {
//         id: "star-2",
//         name: "Sparkle",
//         svg: "M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5L12 1z",
//       },
//     ],
//   },
//   doves: {
//     id: "doves",
//     category: "Birds",
//     items: [
//       {
//         id: "dove-1",
//         name: "Dove",
//         svg: "M12 3c-4.97 0-9 4.03-9 9 0 3.38 1.87 6.32 4.63 7.87L6 22l6-4 6 4-1.63-2.13C19.13 18.32 21 15.38 21 12c0-4.97-4.03-9-9-9z M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
//       },
//     ],
//   },
//   butterflies: {
//     id: "butterflies",
//     category: "Nature",
//     items: [
//       {
//         id: "butterfly-1",
//         name: "Butterfly",
//         svg: "M12 2C9.24 2 7 4.24 7 7c0 1.44.62 2.74 1.6 3.65L7 13l5 3 5-3-1.6-2.35C16.38 9.74 17 8.44 17 7c0-2.76-2.24-5-5-5z M12 22l-3-5h6l-3 5z",
//       },
//     ],
//   },
// };

// // ============================================================================
// // TEXTURE HELPERS
// // ============================================================================
// async function applyEngravingEffect(
//   imageSrc,
//   engraveDepth = 0.7,
//   textColor = "#4c3328",
// ) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;
//       const hexToRgb = (hex) => {
//         const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//         return result
//           ? {
//               r: parseInt(result[1], 16),
//               g: parseInt(result[2], 16),
//               b: parseInt(result[3], 16),
//             }
//           : { r: 76, g: 51, b: 40 };
//       };
//       const baseColor = hexToRgb(textColor);
//       for (let i = 0; i < data.length; i += 4) {
//         const r = data[i],
//           g = data[i + 1],
//           b = data[i + 2],
//           alpha = data[i + 3];
//         const gray = r * 0.299 + g * 0.587 + b * 0.114;
//         const brightness = gray / 255;
//         const darkness = 1 - brightness;
//         if (brightness > 0.85) {
//           data[i + 3] = 0;
//         } else if (brightness > 0.5) {
//           const intensity = (1 - brightness) * engraveDepth;
//           data[i] = Math.floor(Math.min(255, baseColor.r * 1.5));
//           data[i + 1] = Math.floor(Math.min(255, baseColor.g * 1.5));
//           data[i + 2] = Math.floor(Math.min(255, baseColor.b * 1.5));
//           data[i + 3] = Math.floor(alpha * intensity * 0.6);
//         } else if (brightness > 0.2) {
//           const intensity = darkness * engraveDepth;
//           data[i] = Math.floor(baseColor.r * intensity);
//           data[i + 1] = Math.floor(baseColor.g * intensity);
//           data[i + 2] = Math.floor(baseColor.b * intensity);
//           data[i + 3] = Math.floor(alpha * 0.85);
//         } else {
//           const intensity = darkness * engraveDepth;
//           data[i] = Math.floor(baseColor.r * 0.7 * intensity);
//           data[i + 1] = Math.floor(baseColor.g * 0.7 * intensity);
//           data[i + 2] = Math.floor(baseColor.b * 0.7 * intensity);
//           data[i + 3] = alpha;
//         }
//       }
//       ctx.putImageData(imageData, 0, 0);
//       resolve(canvas.toDataURL());
//     };
//     img.onerror = reject;
//     img.src = imageSrc;
//   });
// }

// async function createImageOnlyTexture(imageSrc, imageMode = "contain") {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = async () => {
//       try {
//         const engravingImage = await applyEngravingEffect(
//           imageSrc,
//           0.9,
//           "#4c3328",
//         );
//         const processedImg = new Image();
//         processedImg.crossOrigin = "anonymous";
//         await new Promise((res, rej) => {
//           processedImg.onload = res;
//           processedImg.onerror = rej;
//           processedImg.src = engravingImage;
//         });
//         const dpr = Math.min(window.devicePixelRatio || 1, 2);
//         const baseWidth = 1024,
//           baseHeight = 512;
//         const canvas = document.createElement("canvas");
//         canvas.width = Math.floor(baseWidth * dpr);
//         canvas.height = Math.floor(baseHeight * dpr);
//         const ctx = canvas.getContext("2d");
//         ctx.scale(dpr, dpr);
//         const imgAspect = processedImg.width / processedImg.height;
//         const canvasAspect = baseWidth / baseHeight;
//         let drawWidth, drawHeight, offsetX, offsetY;
//         if (imageMode === "cover") {
//           if (imgAspect > canvasAspect) {
//             drawHeight = baseHeight;
//             drawWidth = baseHeight * imgAspect;
//             offsetX = (baseWidth - drawWidth) / 2;
//             offsetY = 0;
//           } else {
//             drawWidth = baseWidth;
//             drawHeight = baseWidth / imgAspect;
//             offsetX = 0;
//             offsetY = (baseHeight - drawHeight) / 2;
//           }
//         } else {
//           if (imgAspect > canvasAspect) {
//             drawWidth = baseWidth;
//             drawHeight = baseWidth / imgAspect;
//             offsetX = 0;
//             offsetY = (baseHeight - drawHeight) / 2;
//           } else {
//             drawHeight = baseHeight;
//             drawWidth = baseHeight * imgAspect;
//             offsetX = (baseWidth - drawWidth) / 2;
//             offsetY = 0;
//           }
//         }
//         ctx.drawImage(processedImg, offsetX, offsetY, drawWidth, drawHeight);
//         const texture = new THREE.CanvasTexture(canvas);
//         texture.generateMipmaps = false;
//         texture.anisotropy = 16;
//         texture.encoding = THREE.sRGBEncoding;
//         texture.needsUpdate = true;
//         resolve(texture);
//       } catch (e) {
//         reject(e);
//       }
//     };
//     img.onerror = reject;
//     img.src = imageSrc;
//   });
// }

// function svgToEngravingDataURL(svgPath) {
//   const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="200" height="200"><path fill="#000000" d="${svgPath}"/></svg>`;
//   return `data:image/svg+xml;base64,${btoa(svg)}`;
// }

// function getLines(ctx, text, maxWidth) {
//   const manualLines = text.split("\n");
//   const lines = [];
//   manualLines.forEach((line) => {
//     const words = line.split(" ");
//     if (words.length === 0 || line === "") {
//       lines.push("");
//       return;
//     }
//     let currentLine = words[0];
//     for (let i = 1; i < words.length; i++) {
//       const word = words[i];
//       const width = ctx.measureText(currentLine + " " + word).width;
//       if (width < maxWidth) {
//         currentLine += " " + word;
//       } else {
//         lines.push(currentLine);
//         currentLine = word;
//       }
//     }
//     lines.push(currentLine);
//   });
//   return lines;
// }

// async function createEngravedTextTexture(
//   text,
//   fontFamily,
//   fontSize = 140,
//   fontStyle = "normal",
//   fontWeight = "normal",
//   textColor = "#4c3328",
// ) {
//   const fontSpec = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//   try {
//     await document.fonts.load(fontSpec);
//     await document.fonts.ready;
//   } catch (e) {}
//   const dpr = Math.min(window.devicePixelRatio || 1, 2);
//   const baseWidth = 1024,
//     baseHeight = 512;
//   const canvas = document.createElement("canvas");
//   canvas.width = Math.floor(baseWidth * dpr);
//   canvas.height = Math.floor(baseHeight * dpr);
//   const ctx = canvas.getContext("2d");
//   ctx.scale(dpr, dpr);
//   ctx.clearRect(0, 0, baseWidth, baseHeight);
//   ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}"`;
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   const maxWidth = baseWidth * 0.95;
//   const lines = getLines(ctx, text, maxWidth);
//   const lineHeight = fontSize * 1.1;
//   const totalHeight = lines.length * lineHeight;
//   let startY = (baseHeight - totalHeight) / 2 + lineHeight / 2;
//   lines.forEach((line, i) => {
//     const y = startY + i * lineHeight,
//       x = baseWidth / 2;
//     ctx.shadowColor = "rgba(245, 245, 245, 0.5)";
//     ctx.shadowBlur = 1;
//     ctx.shadowOffsetX = 3;
//     ctx.shadowOffsetY = 5;
//     ctx.fillStyle = textColor;
//     ctx.fillText(line, x, y);
//     ctx.shadowColor = "transparent";
//     ctx.shadowBlur = 0;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
//   });
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.magFilter = THREE.LinearFilter;
//   texture.minFilter = THREE.LinearFilter;
//   texture.generateMipmaps = false;
//   texture.anisotropy = 16;
//   texture.encoding = THREE.sRGBEncoding;
//   texture.needsUpdate = true;
//   return texture;
// }

// const createWoodTexture = (color) => {
//   const canvas = document.createElement("canvas");
//   canvas.width = 512;
//   canvas.height = 512;
//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = color;
//   ctx.fillRect(0, 0, 512, 512);
//   for (let i = 0; i < 30; i++) {
//     ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
//     ctx.lineWidth = Math.random() * 2;
//     ctx.beginPath();
//     ctx.moveTo(0, Math.random() * 512);
//     ctx.bezierCurveTo(
//       128,
//       Math.random() * 512,
//       384,
//       Math.random() * 512,
//       512,
//       Math.random() * 512,
//     );
//     ctx.stroke();
//   }
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(2, 2);
//   return texture;
// };

// // ============================================================================
// // SIMPLE 3D LAYERS (no TransformControls — positioning via 2D editor)
// // ============================================================================
// function SimpleTextLayer({
//   textTexture,
//   position,
//   rotation,
//   planeSize,
//   scale = [1, 1, 1],
// }) {
//   return (
//     <group position={position} scale={scale}>
//       <mesh rotation={rotation}>
//         <planeGeometry args={planeSize} />
//         <meshStandardMaterial
//           map={textTexture}
//           transparent
//           alphaTest={0.1}
//           roughness={0.8}
//           metalness={0.0}
//           side={THREE.DoubleSide}
//           depthWrite={true}
//           depthTest={true}
//         />
//       </mesh>
//     </group>
//   );
// }

// function SimpleImageLayer({
//   imageTexture,
//   position,
//   rotation,
//   planeSize,
//   scale = [1, 1, 1],
// }) {
//   return (
//     <group position={position} scale={scale}>
//       <mesh rotation={rotation}>
//         <planeGeometry args={planeSize} />
//         <meshStandardMaterial
//           map={imageTexture}
//           transparent
//           alphaTest={0.1}
//           roughness={0.8}
//           metalness={0.0}
//           side={THREE.DoubleSide}
//           depthWrite={true}
//           depthTest={true}
//         />
//       </mesh>
//     </group>
//   );
// }

// // ============================================================================
// // CAMERA CONTROLLER
// // ============================================================================
// function CameraController({ zoom, reset }) {
//   const { camera } = useThree();
//   const initialPosition = useRef([8, 5, 8]);
//   useEffect(() => {
//     if (reset > 0) {
//       camera.position.set(...initialPosition.current);
//       camera.lookAt(0, 0, 0);
//     }
//   }, [reset, camera]);
//   useEffect(() => {
//     const baseDistance = 10;
//     const newDistance = baseDistance / zoom;
//     const direction = camera.position.clone().normalize();
//     camera.position.copy(direction.multiplyScalar(newDistance));
//   }, [zoom, camera]);
//   return null;
// }

// // ============================================================================
// // BRICK COMPONENT
// // ============================================================================
// function Brick({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   objFilePath,
//   textPosition,
//   imagePosition,
//   textScale,
//   imageScale,
// }) {
//   const meshRef = useRef();
//   const brickModelPath = objFilePath || "/2X4 Plus Size_UVs.obj";
//   const obj = useLoader(OBJLoader, brickModelPath);
//   const [textTexture, setTextTexture] = useState(null);
//   const [imageTexture, setImageTexture] = useState(null);

//   const IMAGE_WIDTH = 20;
//   const IMAGE_HEIGHT = 10;

//   const brickDimensions = {
//     "2x2-plus": { width: 2, height: 1.2 },
//     "2x4-plus": { width: 4, height: 1.2 },
//     "2x4-standard": { width: 4, height: 1.2 },
//   };
//   const dims = brickDimensions[brickType];

//   useEffect(() => {
//     let mounted = true,
//       current = null;
//     if (text) {
//       createEngravedTextTexture(
//         text,
//         fontFamily,
//         100,
//         fontStyle,
//         fontWeight,
//         textColor,
//       )
//         .then((tex) => {
//           if (!mounted) {
//             tex.dispose();
//             return;
//           }
//           setTextTexture(tex);
//           current = tex;
//         })
//         .catch(() => {});
//     } else {
//       setTextTexture(null);
//     }
//     return () => {
//       mounted = false;
//       if (current) current.dispose();
//     };
//   }, [text, fontFamily, fontStyle, fontWeight, textColor]);

//   useEffect(() => {
//     let mounted = true,
//       current = null;
//     if (uploadedImage) {
//       createImageOnlyTexture(uploadedImage, imageMode)
//         .then((tex) => {
//           if (!mounted) {
//             tex.dispose();
//             return;
//           }
//           setImageTexture(tex);
//           current = tex;
//         })
//         .catch(() => {});
//     } else {
//       setImageTexture(null);
//     }
//     return () => {
//       mounted = false;
//       if (current) current.dispose();
//     };
//   }, [uploadedImage, imageMode]);

//   const defaultTextPos = {
//     "2x2-plus": [16, 9.8, 5],
//     "2x4-plus": [16, 9.8, 1],
//     "2x4-standard": [8, 4.8, 2],
//   };
//   const defaultImagePos = {
//     "2x2-plus": [16, 9.8, 4.8],
//     "2x4-plus": [16, 9.8, 2],
//     "2x4-standard": [8, 4.8, 2.2],
//   };
//   const textPlaneSize = {
//     "2x2-plus": [dims.width * 14, dims.height * 14],
//     "2x4-plus": [dims.width * 14, dims.height * 14],
//     "2x4-standard": [dims.width * 7, dims.height * 7],
//   };
//   const rotation = [0, Math.PI / 2, 0];

//   const modelScale = 0.15;
//   const scaleMultiplier =
//     brickType === "2x4-standard" ? 2.0 * modelScale : modelScale;

//   const clonedObj = React.useMemo(() => {
//     const cloned = obj.clone();
//     const woodTexture = createWoodTexture(woodColor);
//     cloned.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: woodColor,
//           roughness: 0.7,
//           metalness: 0.1,
//           map: woodTexture,
//         });
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//     return cloned;
//   }, [obj, woodColor]);

//   return (
//     <group ref={meshRef} scale={scaleMultiplier} position={[0, -1, 0]}>
//       <primitive object={clonedObj} />
//       {imageTexture && (
//         <SimpleImageLayer
//           imageTexture={imageTexture}
//           position={imagePosition || defaultImagePos[brickType]}
//           rotation={rotation}
//           planeSize={[IMAGE_WIDTH, IMAGE_HEIGHT]}
//           scale={imageScale}
//         />
//       )}
//       {textTexture && (
//         <SimpleTextLayer
//           textTexture={textTexture}
//           position={textPosition || defaultTextPos[brickType]}
//           rotation={rotation}
//           planeSize={textPlaneSize[brickType]}
//           scale={textScale}
//         />
//       )}
//     </group>
//   );
// }

// // ============================================================================
// // SCENE
// // ============================================================================
// function Scene({
//   text,
//   brickType,
//   woodColor,
//   uploadedImage,
//   textColor,
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   imageMode,
//   zoom,
//   reset,
//   objFilePath,
//   textPosition,
//   imagePosition,
//   textScale,
//   imageScale,
// }) {
//   return (
//     <>
//       <CameraController zoom={zoom} reset={reset} />
//       <ambientLight intensity={0.5} />
//       <directionalLight
//         position={[5, 8, 5]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
//       <spotLight
//         position={[-5, 10, 0]}
//         intensity={0.5}
//         angle={0.3}
//         penumbra={1}
//         castShadow
//       />
//       <Suspense fallback={null}>
//         <Brick
//           text={text}
//           brickType={brickType}
//           woodColor={woodColor}
//           uploadedImage={uploadedImage}
//           textColor={textColor}
//           fontFamily={fontFamily}
//           fontStyle={fontStyle}
//           fontWeight={fontWeight}
//           imageMode={imageMode}
//           objFilePath={objFilePath}
//           textPosition={textPosition}
//           imagePosition={imagePosition}
//           textScale={textScale}
//           imageScale={imageScale}
//         />
//       </Suspense>
//       <ContactShadows
//         position={[0, -2, 0]}
//         opacity={0.4}
//         scale={15}
//         blur={2}
//         far={4}
//       />
//       <Environment preset="warehouse" />
//       <OrbitControls
//         enablePan={false}
//         enableZoom={true}
//         minDistance={5}
//         maxDistance={25}
//         enableRotate={false}
//       />
//     </>
//   );
// }

// // ============================================================================
// // 2D PREVIEW EDITOR — like TimberBrands
// // ============================================================================
// function CornerHandle({ posStyle, bg, onPointerDown, size = 20, children }) {
//   return (
//     <div
//       onPointerDown={onPointerDown}
//       style={{
//         position: "absolute",
//         width: size,
//         height: size,
//         borderRadius: "50%",
//         background: bg,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
//         zIndex: 20,
//         userSelect: "none",
//         touchAction: "none",
//         cursor: "pointer",
//         ...posStyle,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function Layer2D({
//   layerRef,
//   transform,
//   isActive,
//   accentColor,
//   onLayerPointerDown,
//   onMoveHandle,
//   onRotateHandle,
//   onScaleHandle,
//   onDelete,
//   children,
// }) {
//   const H = 20;
//   return (
//     <div
//       ref={layerRef}
//       onPointerDown={onLayerPointerDown}
//       style={{
//         position: "absolute",
//         left: "50%",
//         top: "50%",
//         transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotation}deg) scale(${transform.scale})`,
//         cursor: isActive ? "move" : "pointer",
//         zIndex: isActive ? 10 : 5,
//         padding: 4,
//         userSelect: "none",
//         touchAction: "none",
//         outline: isActive
//           ? `2px solid ${accentColor}`
//           : "2px dashed transparent",
//         borderRadius: 3,
//       }}
//     >
//       {children}
//       {isActive && (
//         <>
//           {/* TOP LEFT — Move */}
//           <CornerHandle
//             posStyle={{ top: -H / 2, left: -H / 2, cursor: "grab" }}
//             bg={accentColor}
//             onPointerDown={onMoveHandle}
//             size={H}
//           >
//             <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
//               <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
//             </svg>
//           </CornerHandle>
//           {/* TOP RIGHT — Rotate */}
//           <CornerHandle
//             posStyle={{ top: -H / 2, right: -H / 2, cursor: "crosshair" }}
//             bg={accentColor}
//             onPointerDown={onRotateHandle}
//             size={H}
//           >
//             <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
//               <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
//             </svg>
//           </CornerHandle>
//           {/* BOTTOM LEFT — Delete / Reset */}
//           <CornerHandle
//             posStyle={{ bottom: -H / 2, left: -H / 2, cursor: "pointer" }}
//             bg="#ef4444"
//             onPointerDown={(e) => {
//               e.stopPropagation();
//               onDelete();
//             }}
//             size={H}
//           >
//             <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
//               <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
//             </svg>
//           </CornerHandle>
//           {/* BOTTOM RIGHT — Scale */}
//           <CornerHandle
//             posStyle={{ bottom: -H / 2, right: -H / 2, cursor: "nwse-resize" }}
//             bg={accentColor}
//             onPointerDown={onScaleHandle}
//             size={H}
//           >
//             <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
//               <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z" />
//             </svg>
//           </CornerHandle>
//         </>
//       )}
//     </div>
//   );
// }

// function SliderControl({
//   label,
//   value,
//   min,
//   max,
//   step,
//   color,
//   displayVal,
//   onChange,
// }) {
//   return (
//     <div>
//       <div className="flex justify-between items-center mb-1">
//         <span className="text-xs text-gray-500 font-medium">{label}</span>
//         <span className="text-xs font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
//           {displayVal}
//         </span>
//       </div>
//       <input
//         type="range"
//         min={min}
//         max={max}
//         step={step}
//         value={value}
//         onChange={(e) => onChange(parseFloat(e.target.value))}
//         className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
//         style={{ accentColor: color }}
//       />
//     </div>
//   );
// }

// function BrickPreviewEditor({
//   text,
//   uploadedImageUrl,
//   fontFamily,
//   fontStyle,
//   fontWeight,
//   textColor,
//   woodColor,
//   brickType,
//   textTransform,
//   imageTransform,
//   onTextTransformChange,
//   onImageTransformChange,
//   onClose,
// }) {
//   const [activeLayer, setActiveLayer] = useState(
//     text ? "text" : uploadedImageUrl ? "image" : null,
//   );
//   const brickRef = useRef(null);
//   const textRef = useRef(null);
//   const imageRef = useRef(null);
//   const ia = useRef({
//     type: null,
//     layer: null,
//     startMX: 0,
//     startMY: 0,
//     startX: 0,
//     startY: 0,
//     startScale: 1,
//     startRotation: 0,
//     startAngle: 0,
//   });

//   const brickSurface = {
//     "2x4-plus": { w: 300, h: 150 },
//     "2x2-plus": { w: 150, h: 150 },
//     "2x4-standard": { w: 300, h: 150 },
//   }[brickType] || { w: 300, h: 150 };
//   const studCount = brickType === "2x2-plus" ? 2 : 4;

//   const getT = (l) => (l === "text" ? textTransform : imageTransform);
//   const setT = (l, v) => {
//     if (l === "text") onTextTransformChange?.(v);
//     else onImageTransformChange?.(v);
//   };

//   const getLayerCenter = (ref) => {
//     if (!ref.current) return { cx: 0, cy: 0 };
//     const r = ref.current.getBoundingClientRect();
//     return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
//   };

//   const onLayerPointerDown = (e, layer) => {
//     e.stopPropagation();
//     e.preventDefault();
//     const t = getT(layer);
//     ia.current = {
//       type: "drag",
//       layer,
//       startMX: e.clientX,
//       startMY: e.clientY,
//       startX: t.x,
//       startY: t.y,
//       startScale: t.scale,
//       startRotation: t.rotation,
//     };
//     setActiveLayer(layer);
//     window.addEventListener("pointermove", onPointerMove);
//     window.addEventListener("pointerup", onPointerUp);
//   };

//   const onHandlePointerDown = (e, type, layer) => {
//     e.stopPropagation();
//     e.preventDefault();
//     const t = getT(layer);
//     const ref = layer === "text" ? textRef : imageRef;
//     const { cx, cy } = getLayerCenter(ref);
//     ia.current = {
//       type,
//       layer,
//       startMX: e.clientX,
//       startMY: e.clientY,
//       startX: t.x,
//       startY: t.y,
//       startScale: t.scale,
//       startRotation: t.rotation,
//       startAngle: Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI),
//     };
//     setActiveLayer(layer);
//     window.addEventListener("pointermove", onPointerMove);
//     window.addEventListener("pointerup", onPointerUp);
//   };

//   const onPointerMove = (e) => {
//     const i = ia.current;
//     if (!i.type || !i.layer) return;
//     const t = { ...getT(i.layer) };
//     const hw = brickSurface.w / 2 - 16,
//       hh = brickSurface.h / 2 - 10;
//     if (i.type === "drag") {
//       t.x = Math.max(-hw, Math.min(hw, i.startX + (e.clientX - i.startMX)));
//       t.y = Math.max(-hh, Math.min(hh, i.startY + (e.clientY - i.startMY)));
//     }
//     if (i.type === "scale") {
//       const d = (e.clientX - i.startMX + (e.clientY - i.startMY)) / 150;
//       // clamp scale so the layer never extends outside the brick preview
//       const ref = i.layer === "text" ? textRef : imageRef;
//       const el = ref.current ? ref.current.firstElementChild : null;
//       const baseW = el
//         ? el.getBoundingClientRect().width
//         : i.layer === "image"
//           ? 70
//           : 100;
//       const baseH = el
//         ? el.getBoundingClientRect().height
//         : i.layer === "image"
//           ? 55
//           : 24;

//       const hwAvail = Math.max(8, hw - Math.abs(t.x));
//       const hhAvail = Math.max(8, hh - Math.abs(t.y));

//       const maxScaleX = baseW > 0 ? (2 * hwAvail) / baseW : 4;
//       const maxScaleY = baseH > 0 ? (2 * hhAvail) / baseH : 4;
//       const maxAllowed = Math.max(
//         0.2,
//         Math.min(4, Math.min(maxScaleX, maxScaleY)),
//       );

//       t.scale = Math.max(0.2, Math.min(maxAllowed, i.startScale + d));
//     }
//     if (i.type === "rotate") {
//       const ref = i.layer === "text" ? textRef : imageRef;
//       const { cx, cy } = getLayerCenter(ref);
//       const angle =
//         Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
//       t.rotation = i.startRotation + (angle - i.startAngle);
//     }
//     setT(i.layer, t);
//   };

//   const onPointerUp = () => {
//     ia.current.type = null;
//     window.removeEventListener("pointermove", onPointerMove);
//     window.removeEventListener("pointerup", onPointerUp);
//   };

//   useEffect(() => {
//     return () => {
//       window.removeEventListener("pointermove", onPointerMove);
//       window.removeEventListener("pointerup", onPointerUp);
//     };
//   }, []);

//   const brickFaceStyle = {
//     backgroundColor: woodColor || "#d4a574",
//     backgroundImage: `repeating-linear-gradient(88deg, transparent 0px, transparent 18px, rgba(0,0,0,0.025) 18px, rgba(0,0,0,0.025) 19px), repeating-linear-gradient(92deg, transparent 0px, transparent 30px, rgba(0,0,0,0.015) 30px, rgba(0,0,0,0.015) 31px)`,
//   };

//   const hasText = !!text;
//   const hasImage = !!uploadedImageUrl;

//   return (
//     <div
//       className="flex flex-col bg-white rounded-2xl overflow-hidden"
//       style={{
//         boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
//         border: "1px solid rgba(0,0,0,0.08)",
//       }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
//         <span className="font-semibold text-gray-800 text-sm tracking-tight">
//           ✏️ Edit Position
//         </span>
//         <button
//           onClick={onClose}
//           className="px-5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-700 transition-colors"
//         >
//           ✓ OK
//         </button>
//       </div>

//       {/* Layer Toggle */}
//       {(hasText || hasImage) && (
//         <div className="flex gap-2 px-4 py-3 border-b border-gray-100">
//           {hasText && (
//             <button
//               onClick={() => setActiveLayer("text")}
//               className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${activeLayer === "text" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
//             >
//               T Text
//             </button>
//           )}
//           {hasImage && (
//             <button
//               onClick={() => setActiveLayer("image")}
//               className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${activeLayer === "image" ? "bg-purple-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
//             >
//               🖼 Image
//             </button>
//           )}
//         </div>
//       )}

//       {/* 2D Brick Canvas */}
//       <div
//         className="flex items-center justify-center"
//         style={{ background: "#f0f0f0", padding: "28px 20px 20px" }}
//       >
//         <div
//           className="relative"
//           style={{ width: brickSurface.w + 16, paddingTop: 14 }}
//         >
//           {/* Studs */}
//           {/* <div
//             className="absolute top-0 left-0 right-0 flex justify-around px-5"
//             style={{ pointerEvents: "none" }}
//           >
//             {Array.from({ length: studCount }).map((_, i) => (
//               <div
//                 key={i}
//                 style={{
//                   width: 28,
//                   height: 14,
//                   borderRadius: "50%",
//                   background: woodColor || "#d4a574",
//                   border: "2px solid rgba(0,0,0,0.18)",
//                   boxShadow:
//                     "0 3px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25)",
//                 }}
//               />
//             ))}
//           </div> */}
//           {/* Brick Face */}
//           <div
//             ref={brickRef}
//             className="relative rounded overflow-hidden"
//             style={{
//               width: brickSurface.w,
//               height: brickSurface.h,
//               ...brickFaceStyle,
//               boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//             }}
//           >
//             {/* Image Layer */}
//             {hasImage && (
//               <Layer2D
//                 layerRef={imageRef}
//                 transform={imageTransform}
//                 isActive={activeLayer === "image"}
//                 accentColor="#7c3aed"
//                 onLayerPointerDown={(e) => onLayerPointerDown(e, "image")}
//                 onMoveHandle={(e) => onHandlePointerDown(e, "drag", "image")}
//                 onRotateHandle={(e) =>
//                   onHandlePointerDown(e, "rotate", "image")
//                 }
//                 onScaleHandle={(e) => onHandlePointerDown(e, "scale", "image")}
//                 onDelete={() =>
//                   onImageTransformChange?.({
//                     x: 0,
//                     y: 0,
//                     scale: 1,
//                     rotation: 0,
//                   })
//                 }
//               >
//                 <img
//                   src={uploadedImageUrl}
//                   alt="layer"
//                   draggable={false}
//                   style={{
//                     width: 70,
//                     height: 55,
//                     objectFit: "contain",
//                     display: "block",
//                     filter: "sepia(0.25) contrast(1.1) brightness(0.92)",
//                     pointerEvents: "none",
//                     userSelect: "none",
//                   }}
//                 />
//               </Layer2D>
//             )}
//             {/* Text Layer */}
//             {hasText && (
//               <Layer2D
//                 layerRef={textRef}
//                 transform={textTransform}
//                 isActive={activeLayer === "text"}
//                 accentColor="#2563eb"
//                 onLayerPointerDown={(e) => onLayerPointerDown(e, "text")}
//                 onMoveHandle={(e) => onHandlePointerDown(e, "drag", "text")}
//                 onRotateHandle={(e) => onHandlePointerDown(e, "rotate", "text")}
//                 onScaleHandle={(e) => onHandlePointerDown(e, "scale", "text")}
//                 onDelete={() =>
//                   onTextTransformChange?.({ x: 0, y: 0, scale: 1, rotation: 0 })
//                 }
//               >
//                 <span
//                   style={{
//                     fontFamily: fontFamily || "Georgia, serif",
//                     fontStyle: fontStyle || "normal",
//                     fontWeight: fontWeight || "normal",
//                     color: textColor || "#4c3328",
//                     fontSize: 18,
//                     whiteSpace: "nowrap",
//                     display: "block",
//                     pointerEvents: "none",
//                     userSelect: "none",
//                     textShadow: "0 1px 2px rgba(0,0,0,0.15)",
//                     letterSpacing: "0.02em",
//                   }}
//                 >
//                   {text}
//                 </span>
//               </Layer2D>
//             )}
//             {!hasText && !hasImage && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <p className="text-xs text-gray-400 italic">
//                   Add text or image to position
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Hint */}
//       {/* {activeLayer && (
//         <div className="px-4 pt-3 pb-1">
//           <p className="text-xs text-gray-400 text-center">
//             Drag <strong className="text-gray-600">{activeLayer}</strong>{" "}
//             directly on the brick preview, or use sliders
//           </p>
//         </div>
//       )} */}

//       {/* Sliders */}
//       {activeLayer && (
//         <div className="px-4 pb-4 pt-2 space-y-3">
//           {/* <SliderControl
//             label="⬅ Left / Right ➡"
//             value={getT(activeLayer).x}
//             min={-(brickSurface.w / 2 - 16)}
//             max={brickSurface.w / 2 - 16}
//             step={1}
//             color={activeLayer === "text" ? "#2563eb" : "#7c3aed"}
//             displayVal={Math.round(getT(activeLayer).x)}
//             onChange={(v) => setT(activeLayer, { ...getT(activeLayer), x: v })}
//           />
//           <SliderControl
//             label="⬆ Up / Down ⬇"
//             value={getT(activeLayer).y}
//             min={-(brickSurface.h / 2 - 10)}
//             max={brickSurface.h / 2 - 10}
//             step={1}
//             color={activeLayer === "text" ? "#2563eb" : "#7c3aed"}
//             displayVal={Math.round(getT(activeLayer).y)}
//             onChange={(v) => setT(activeLayer, { ...getT(activeLayer), y: v })}
//           />
//           <SliderControl
//             label="⤡ Size"
//             value={getT(activeLayer).scale}
//             min={0.2}
//             max={4}
//             step={0.05}
//             color={activeLayer === "text" ? "#2563eb" : "#7c3aed"}
//             displayVal={getT(activeLayer).scale.toFixed(2) + "×"}
//             onChange={(v) =>
//               setT(activeLayer, { ...getT(activeLayer), scale: v })
//             }
//           />
//           <SliderControl
//             label="↻ Rotation"
//             value={getT(activeLayer).rotation}
//             min={-180}
//             max={180}
//             step={1}
//             color={activeLayer === "text" ? "#2563eb" : "#7c3aed"}
//             displayVal={Math.round(getT(activeLayer).rotation) + "°"}
//             onChange={(v) =>
//               setT(activeLayer, { ...getT(activeLayer), rotation: v })
//             }
//           /> */}


          
//           <button
//             onClick={() =>
//               setT(activeLayer, { x: 0, y: 0, scale: 1, rotation: 0 })
//             }
//             className="w-full mt-1 py-2 text-xs text-gray-400 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//           >
//             Reset {activeLayer === "text" ? "Text" : "Image"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================================================
// // HELPER: map 2D editor transform → 3D position/scale
// // ============================================================================
// function transform2DTo3D(transform2D, brickType, layerType) {
//   // brickSurface px dimensions match editor
//   const brickSurface = {
//     "2x4-plus": { w: 300, h: 150 },
//     "2x2-plus": { w: 150, h: 150 },
//     "2x4-standard": { w: 300, h: 150 },
//   }[brickType] || { w: 300, h: 150 };

//   // 3D default center positions
//   const defaultPos = {
//     text: {
//       "2x2-plus": [16, 9.8, 5],
//       "2x4-plus": [16, 9.8, 1],
//       "2x4-standard": [8, 4.8, 2],
//     },
//     image: {
//       "2x2-plus": [16, 9.8, 4.8],
//       "2x4-plus": [16, 9.8, 2],
//       "2x4-standard": [8, 4.8, 2.2],
//     },
//   };

//   // 3D movement ranges (how far from center can it go)
//   const range3D = {
//     "2x4-plus": { y: 7, z: 18 },
//     "2x2-plus": { y: 7, z: 8 },
//     "2x4-standard": { y: 3.5, z: 5 },
//   }[brickType] || { y: 7, z: 18 };

//   const base = defaultPos[layerType][brickType];

//   // Map 2D pixel offset → 3D offset
//   // 2D x (left/right) → 3D Z axis
//   // 2D y (up/down)    → 3D Y axis (inverted)
//   // invert X->Z mapping so dragging left in 2D moves left in 3D
//   const zOffset = -(transform2D.x / (brickSurface.w / 2)) * range3D.z;
//   const yOffset = -(transform2D.y / (brickSurface.h / 2)) * range3D.y;

//   const position3D = [base[0], base[1] + yOffset, base[2] + zOffset];
//   const scale3D = [transform2D.scale, transform2D.scale, transform2D.scale];

//   return { position3D, scale3D };
// }

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================
// export default function EngravedBrickCustomizer() {
//   const getProductIdFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get("product_id") || "16";
//   };

//   const [productId] = useState(getProductIdFromUrl());
//   const [productData, setProductData] = useState(null);
//   const [templateData, setTemplateData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [text, setText] = useState("");
//   const [brickType, setBrickType] = useState("2x4-plus");
//   const [quantity, setQuantity] = useState(1);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//   const [woodColor, setWoodColor] = useState("#d4a574");
//   const [fontStyle, setFontStyle] = useState("normal");
//   const [textColor, setTextColor] = useState("#4c3328");
//   const [fontWeight, setFontWeight] = useState("normal");
//   const [fontFamily, setFontFamily] = useState("Adamina");
//   const [imageMode, setImageMode] = useState("contain");
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showClipart, setShowClipart] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [zoom, setZoom] = useState(1);
//   const [resetTrigger, setResetTrigger] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showPreviewEditor, setShowPreviewEditor] = useState(false);
//   const prevZoomRef = useRef(null);

//   // ── 2D editor transforms
//   const [textTransform2D, setTextTransform2D] = useState({
//     x: 0,
//     y: 0,
//     scale: 1,
//     rotation: 0,
//   });
//   const [imageTransform2D, setImageTransform2D] = useState({
//     x: 0,
//     y: 0,
//     scale: 1,
//     rotation: 0,
//   });

//   // ── Derived 3D positions from 2D transforms
//   const { position3D: textPosition3D, scale3D: textScale3D } = transform2DTo3D(
//     textTransform2D,
//     brickType,
//     "text",
//   );
//   const { position3D: imagePosition3D, scale3D: imageScale3D } =
//     transform2DTo3D(imageTransform2D, brickType, "image");

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/product/${productId}`,
//         );
//         if (!response.ok) throw new Error("Failed to fetch product data");
//         const result = await response.json();
//         if (result.success && result.data) {
//           setProductData(result.data);
//           setTemplateData(result.predefined_template);
//         } else throw new Error("Invalid API response");
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchProductData();
//   }, [productId]);

//   const fontOptions = {
//     Adamina: "Adamina",
//     Aladin: "Aladin",
//     "Amatic SC": "Amatic SC",
//     Amiri: "Amiri",
//     Arimo: "Arimo",
//     Arizonia: "Arizonia",
//     "Berkshire Swash": "Berkshire Swash",
//     Cairo: "Cairo",
//     Condiment: "Condiment",
//     Cookie: "Cookie",
//     Damion: "Damion",
//     "EB Garamond": "EB Garamond",
//     Fondamento: "Fondamento",
//     "Gloria Hallelujah": "Gloria Hallelujah",
//     "Rock Salt": "Rock Salt",
//     Rubik: "Rubik",
//     "Shippori Mincho": "Shippori Mincho",
//     Tinos: "Tinos",
//     "Trail One": "Trail One",
//     "ZCOOL XiaoWei": "ZCOOL XiaoWei",
//     Roboto: "Roboto",
//     "Open Sans": "Open Sans",
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadedFile(file.name);
//       setUploadedImageUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleClipartSelect = (svgPath) => {
//     setUploadedImageUrl(svgToEngravingDataURL(svgPath));
//     setUploadedFile("clipart");
//     setShowClipart(false);
//   };

//   const handleTemplateSelect = (templateId) => {
//     const template = templateData.find((t) => t.id === templateId);
//     if (!template) return;
//     setSelectedTemplate(templateId);
//     const isCustomTemplate =
//       template.category === "Custom" ||
//       template.name === "Custom" ||
//       template.id === 52 ||
//       (template.template.text === "" && template.img_url === "");
//     if (isCustomTemplate) {
//       setText("");
//       clearImage();
//     } else {
//       setText(template.template.text || "");
//       if (template.img_url && template.img_url !== "") {
//         setUploadedImageUrl(template.img_url);
//         setUploadedFile("template-image");
//       } else clearImage();
//     }
//     setShowTemplates(false);
//   };

//   const clearImage = () => {
//     setUploadedFile(null);
//     if (uploadedImageUrl && !uploadedImageUrl.startsWith("data:"))
//       URL.revokeObjectURL(uploadedImageUrl);
//     setUploadedImageUrl(null);
//   };

//   const handleZoomIn = () => setZoom((prev) => Math.min(2, prev + 0.1));
//   const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.1));
//   const handleReset = () => {
//     clearImage();
//     setText("");
//     setSelectedTemplate(null);
//     setTextTransform2D({ x: 0, y: 0, scale: 1, rotation: 0 });
//     setImageTransform2D({ x: 0, y: 0, scale: 1, rotation: 0 });
//   };

//   const toggleFullscreen = () => {
//     setIsFullscreen((prev) => {
//       const entering = !prev;
//       if (entering) {
//         prevZoomRef.current = zoom;
//         setZoom(Math.max(0.5, zoom * 0.7));
//       } else {
//         if (prevZoomRef.current != null) setZoom(prevZoomRef.current);
//       }
//       return entering;
//     });
//   };

//   const price = productData?.price ? parseFloat(productData.price) : 19.99;
//   const total = (price * quantity).toFixed(2);

//   const captureScreenshot = async () => {
//     return new Promise((resolve) => {
//       const canvas = document.querySelector("canvas");
//       if (!canvas) {
//         resolve(null);
//         return;
//       }
//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           try {
//             const dataURL = canvas.toDataURL("image/png", 0.95);
//             canvas.toBlob(
//               (blob) => {
//                 if (blob) resolve({ blob, dataURL });
//                 else resolve(null);
//               },
//               "image/png",
//               0.95,
//             );
//           } catch (error) {
//             resolve(null);
//           }
//         });
//       });
//     });
//   };

//   const addToCart = async (event) => {
//     event.preventDefault();
//     try {
//       const button = event.target;
//       button.disabled = true;
//       button.textContent = "Adding to cart...";
//       const loadingToast = toast.loading(
//         "Capturing preview and adding to cart...",
//       );
//       const screenshot = await captureScreenshot();
//       if (!screenshot) {
//         toast.update(loadingToast, {
//           render: "Failed to capture screenshot",
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//         throw new Error("Failed to capture screenshot");
//       }
//       const formData = new FormData();
//       formData.append("brick_type", brickType);
//       formData.append("wood_color", woodColor);
//       formData.append("text", text || "");
//       formData.append("template", selectedTemplate || "custom");
//       formData.append("quantity", quantity);
//       formData.append("price", price);
//       formData.append("total", total);
//       formData.append("engraving_style", "carved-engraving");
//       formData.append("font_family", fontFamily);
//       formData.append("font_style", fontStyle);
//       formData.append("font_weight", fontWeight);
//       formData.append("text_color", textColor);
//       formData.append("image_mode", imageMode);
//       formData.append("product_id", productId);
//       formData.append("text_transform_2d", JSON.stringify(textTransform2D));
//       formData.append("image_transform_2d", JSON.stringify(imageTransform2D));
//       formData.append("brick_screenshot", screenshot.blob, "brick-preview.png");
//       if (uploadedImageUrl && uploadedFile !== "clipart") {
//         const response = await fetch(uploadedImageUrl);
//         const blob = await response.blob();
//         formData.append("image", blob, uploadedFile);
//         formData.append("image_type", "upload");
//       } else if (uploadedFile === "clipart") {
//         formData.append("clipart", uploadedImageUrl);
//         formData.append("image_type", "clipart");
//       }
//       const apiResponse = await fetch(
//         "https://snow-crocodile-302906.hostingersite.com/wp-json/react-3d/v1/submit",
//         { method: "POST", body: formData },
//       );
//       if (!apiResponse.ok)
//         throw new Error(`HTTP error! status: ${apiResponse.status}`);
//       const result = await apiResponse.json();
//       if (result.success) {
//         toast.update(loadingToast, {
//           render: "Successfully added to cart! 🎉",
//           type: "success",
//           isLoading: false,
//           autoClose: 2000,
//         });
//         setTimeout(() => {
//           if (result?.redirect_url) window.location.href = result.redirect_url;
//         }, 2000);
//       } else throw new Error(result.message || "Failed to add to cart");
//     } catch (error) {
//       toast.error(`Failed to add to cart: ${error.message}`, {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     } finally {
//       const button = event?.target;
//       if (button) {
//         button.disabled = false;
//         button.textContent = "Add to cart";
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-xl">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
//             <p className="text-lg font-semibold">Loading product data...</p>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
//           <h2 className="text-2xl font-bold text-red-800 mb-2">
//             Error Loading Product
//           </h2>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {!loading && !error && productData && (
//         <div className="max-w-7xl mx-auto p-6 pb-32">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">Step 2: Upload Artwork</h1>
//             <p className="text-gray-600">
//               Customize your wooden brick with carved laser engraving
//             </p>
//             <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
//               ✨ All designs automatically converted to 3D carved engraving
//               style
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* ── CENTER: 3D Canvas */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 {/* Controls */}
//                 <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 flex-wrap">
//                   <button
//                     onClick={handleZoomIn}
//                     className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
//                   >
//                     <ZoomIn className="w-4 h-4" />
//                     <span>Zoom In</span>
//                   </button>
//                   <button
//                     onClick={handleZoomOut}
//                     className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
//                   >
//                     <ZoomOut className="w-4 h-4" />
//                     <span>Zoom Out</span>
//                   </button>
//                   <button
//                     onClick={handleReset}
//                     className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
//                   >
//                     <Undo className="w-4 h-4" />
//                     <span>Reset</span>
//                   </button>

//                   {/* ── Edit Position Button */}
//                   <button
//                     onClick={() => setShowPreviewEditor(true)}
//                     className="flex items-center gap-1 px-4 py-2 border-2 border-blue-600 bg-blue-50 text-blue-700 rounded font-medium text-sm ml-auto hover:bg-blue-100 transition-colors"
//                   >
//                     <Move className="w-4 h-4" />
//                     <span>Edit Position</span>
//                   </button>

//                   <button
//                     onClick={toggleFullscreen}
//                     className="p-2 hover:bg-gray-100 rounded transition-colors"
//                     title="Fullscreen"
//                   >
//                     <Maximize2 className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* 3D Canvas */}
//                 <div
//                   className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
//                   style={{ height: isFullscreen ? "100vh" : "600px" }}
//                 >
//                   <Canvas camera={{ position: [1, 0, 0], fov: 70 }} shadows>
//                     <Scene
//                       text={text}
//                       brickType={brickType}
//                       woodColor={woodColor}
//                       uploadedImage={uploadedImageUrl}
//                       textColor={textColor}
//                       fontFamily={fontFamily}
//                       fontStyle={fontStyle}
//                       fontWeight={fontWeight}
//                       imageMode={imageMode}
//                       zoom={zoom}
//                       reset={resetTrigger}
//                       objFilePath={productData?.obj_file}
//                       textPosition={textPosition3D}
//                       imagePosition={imagePosition3D}
//                       textScale={textScale3D}
//                       imageScale={imageScale3D}
//                     />
//                   </Canvas>
//                   {isFullscreen && (
//                     <button
//                       onClick={toggleFullscreen}
//                       className="absolute top-4 left-4 p-3 bg-white rounded-lg shadow-lg hover:bg-gray-100"
//                     >
//                       <Maximize2 className="w-6 h-6" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Templates */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-semibold">📋 Predefined Templates</h3>
//                   <button
//                     onClick={() => setShowTemplates(!showTemplates)}
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     {showTemplates ? "Hide" : "Show"} Templates
//                   </button>
//                 </div>
//                 {showTemplates && templateData && (
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {templateData.map((template) => {
//                       const isCustom =
//                         template.category === "Custom" ||
//                         template.name === "Custom";
//                       return (
//                         <button
//                           key={template.id}
//                           onClick={() => handleTemplateSelect(template.id)}
//                           className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${selectedTemplate === template.id ? "border-blue-600 bg-blue-50 shadow-lg" : isCustom ? "border-dashed border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400"}`}
//                         >
//                           {isCustom && (
//                             <div className="flex items-center justify-center h-32 mb-3">
//                               <div className="text-center text-gray-400">
//                                 <svg
//                                   className="w-12 h-12 mx-auto mb-2"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M12 4v16m8-8H4"
//                                   />
//                                 </svg>
//                                 <div className="text-sm font-medium">
//                                   Start from scratch
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                           {!isCustom && template.img_url && (
//                             <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
//                               <img
//                                 src={template.img_url}
//                                 alt={template.name}
//                                 className="w-full h-32 object-cover"
//                                 onError={(e) => {
//                                   e.target.parentElement.style.display = "none";
//                                 }}
//                               />
//                             </div>
//                           )}
//                           <div className="font-semibold text-sm mb-1">
//                             {template.name}
//                           </div>
//                           <div className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
//                             {template.category}
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ── RIGHT SIDEBAR */}
//             <div className="lg:col-span-1 space-y-4">
//               {/* ── 2D Preview Editor Panel — shown inline in sidebar */}
//               {showPreviewEditor && (
//                 <BrickPreviewEditor
//                   text={text}
//                   uploadedImageUrl={uploadedImageUrl}
//                   fontFamily={fontFamily}
//                   fontStyle={fontStyle}
//                   fontWeight={fontWeight}
//                   textColor={textColor}
//                   woodColor={woodColor}
//                   brickType={brickType}
//                   textTransform={textTransform2D}
//                   imageTransform={imageTransform2D}
//                   onTextTransformChange={setTextTransform2D}
//                   onImageTransformChange={setImageTransform2D}
//                   onClose={() => {
//                     setShowPreviewEditor(false);
//                     toast.success("Position saved!", {
//                       position: "top-right",
//                       autoClose: 1500,
//                     });
//                   }}
//                 />
//               )}

//               {/* ── Text Panel */}
//               {!showPreviewEditor && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                   <h3 className="font-semibold mb-3 text-lg">
//                     Text (Carved Engraving)
//                   </h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">
//                         Custom Text
//                       </label>
//                       <textarea
//                         value={text}
//                         onChange={(e) => setText(e.target.value)}
//                         placeholder="Enter text..."
//                         rows={3}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                       />
//                       <div className="text-xs text-gray-500 mt-1">
//                         {text.length} characters
//                       </div>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">
//                         Font
//                       </label>
//                       <select
//                         value={fontFamily}
//                         onChange={(e) => setFontFamily(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         {Object.keys(fontOptions).map((f) => (
//                           <option key={f} value={fontOptions[f]}>
//                             {f}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">
//                         Style
//                       </label>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             setFontWeight(
//                               fontWeight === "bold" ? "normal" : "bold",
//                             )
//                           }
//                           className={`flex-1 px-3 py-2 border rounded-lg text-sm font-bold transition-colors ${fontWeight === "bold" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
//                         >
//                           B
//                         </button>
//                         <button
//                           onClick={() =>
//                             setFontStyle(
//                               fontStyle === "italic" ? "normal" : "italic",
//                             )
//                           }
//                           className={`flex-1 px-3 py-2 border rounded-lg text-sm italic transition-colors ${fontStyle === "italic" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
//                         >
//                           I
//                         </button>
//                       </div>
//                     </div>
//                     <div className="space-y-2 pt-2 border-t">
//                       <button
//                         onClick={() => setText("")}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
//                       >
//                         Clear Text
//                       </button>
//                       <button
//                         onClick={() => setShowClipart(!showClipart)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                       >
//                         <ImageIcon className="w-4 h-4" />
//                         Browse Clip-Art Library
//                       </button>
//                       <button
//                         onClick={() =>
//                           document.getElementById("fileInput").click()
//                         }
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
//                       >
//                         ⊕ Upload Custom Image
//                       </button>
//                       <input
//                         id="fileInput"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleFileUpload}
//                         className="hidden"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── Uploaded Image Panel */}
//               {uploadedImageUrl && !showPreviewEditor && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Uploaded Image</span>
//                     <button
//                       onClick={clearImage}
//                       className="text-sm text-red-600 hover:text-red-700"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                   <img
//                     src={uploadedImageUrl}
//                     alt="Preview"
//                     className="w-full rounded border border-gray-200 mb-3"
//                   />
//                   <div className="space-y-2">
//                     <label className="text-xs font-medium text-gray-600 block">
//                       Image Fit Mode
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={() => setImageMode("contain")}
//                         className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "contain" ? "border-blue-600 bg-blue-50 font-medium text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
//                       >
//                         Fit
//                       </button>
//                       <button
//                         onClick={() => setImageMode("cover")}
//                         className={`px-3 py-2 border-2 rounded text-sm transition-all ${imageMode === "cover" ? "border-blue-600 bg-blue-50 font-medium text-blue-700" : "border-gray-300 hover:border-gray-400"}`}
//                       >
//                         Fill
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── Clipart Library */}
//               {showClipart && !showPreviewEditor && (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-h-96 overflow-y-auto">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold">🎨 Clip-Art Library</h3>
//                     <button
//                       onClick={() => setShowClipart(false)}
//                       className="text-sm text-gray-600 hover:text-gray-700"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                   {Object.entries(CLIPART_LIBRARY).map(([key, category]) => (
//                     <div key={key} className="mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">
//                         {category.category}
//                       </h4>
//                       <div className="grid grid-cols-3 gap-2">
//                         {category.items.map((item) => (
//                           <button
//                             key={item.id}
//                             onClick={() => handleClipartSelect(item.svg)}
//                             className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all"
//                             title={item.name}
//                           >
//                             <svg
//                               viewBox="0 0 24 24"
//                               className="w-full h-12"
//                               fill="#000"
//                             >
//                               <path d={item.svg} />
//                             </svg>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── Bottom Bar */}
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//               <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
//                 <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
//                   <label className="text-sm font-medium">Quantity</label>
//                   <div className="flex items-center border border-gray-300 rounded w-full sm:w-auto">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-3 py-1 hover:bg-gray-50"
//                     >
//                       −
//                     </button>
//                     <input
//                       type="number"
//                       value={quantity}
//                       onChange={(e) =>
//                         setQuantity(Math.max(1, parseInt(e.target.value) || 1))
//                       }
//                       className="w-full sm:w-16 px-2 py-1 text-center border-x border-gray-300 focus:outline-none"
//                     />
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="px-3 py-1 hover:bg-gray-50"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
//                   <div className="text-center sm:text-right">
//                     <div className="text-2xl font-bold">${total}</div>
//                     <div className="text-xs text-gray-500">
//                       {productData?.name || "3D Model"}
//                     </div>
//                   </div>
//                   <button
//                     onClick={addToCart}
//                     className="px-8 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 w-full sm:w-auto"
//                   >
//                     Add to cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </div>
//   );
// }
