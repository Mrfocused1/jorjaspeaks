import type React from 'react';
import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string; gradient?: { left?: number; right?: number; top?: number; bottom?: number }; disableHover?: boolean };

interface FadeSettings {
    fadeIn: {
        start: number;
        end: number;
    };
    fadeOut: {
        start: number;
        end: number;
    };
}

interface BlurSettings {
    blurIn: {
        start: number;
        end: number;
    };
    blurOut: {
        start: number;
        end: number;
    };
    maxBlur: number;
}

interface InfiniteGalleryProps {
    images: ImageItem[];
    speed?: number;
    zSpacing?: number;
    visibleCount?: number;
    falloff?: { near: number; far: number };
    fadeSettings?: FadeSettings;
    blurSettings?: BlurSettings;
    className?: string;
    style?: React.CSSProperties;
}

interface PlaneData {
    index: number;
    z: number;
    imageIndex: number;
    x: number;
    y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

const createClothMaterial = () => {
    return new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            map: { value: null },
            opacity: { value: 1.0 },
            blurAmount: { value: 0.0 },
            scrollForce: { value: 0.0 },
            time: { value: 0.0 },
            isHovered: { value: 0.0 },
            gradientLeft: { value: 0.0 },
            gradientRight: { value: 0.0 },
            gradientTop: { value: 0.0 },
            gradientBottom: { value: 0.0 },
        },
        vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;

        vec3 pos = position;

        // Create smooth curving based on scroll force
        float curveIntensity = scrollForce * 0.3;

        // Base curve across the plane based on distance from center
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        // Add gentle cloth-like ripples
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        // Flag waving effect when hovered
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          // Create flag-like wave from left to right
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          // Damping effect - stronger wave on the right side (free edge)
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;

          // Add secondary smaller waves for more realistic flag motion
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }

        // Apply Z displacement for curving effect (inverted) with cloth ripples and flag wave
        pos.z -= (curve + clothEffect + flagWave);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      uniform float gradientLeft;
      uniform float gradientRight;
      uniform float gradientTop;
      uniform float gradientBottom;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vec4 color = texture2D(map, vUv);

        // Simple blur approximation
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        // Add subtle lighting effect based on curving
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);

        // Apply gradient overlays
        float gradientAlpha = 1.0;

        // Left gradient
        if (gradientLeft > 0.0) {
          float leftFade = smoothstep(0.0, gradientLeft, vUv.x);
          gradientAlpha *= leftFade;
        }

        // Right gradient
        if (gradientRight > 0.0) {
          float rightFade = smoothstep(1.0, 1.0 - gradientRight, vUv.x);
          gradientAlpha *= rightFade;
        }

        // Top gradient
        if (gradientTop > 0.0) {
          float topFade = smoothstep(1.0, 1.0 - gradientTop, vUv.y);
          gradientAlpha *= topFade;
        }

        // Bottom gradient
        if (gradientBottom > 0.0) {
          float bottomFade = smoothstep(0.0, gradientBottom, vUv.y);
          gradientAlpha *= bottomFade;
        }

        gl_FragColor = vec4(color.rgb, color.a * opacity * gradientAlpha);
      }
    `,
    });
};

function ImagePlane({
    texture,
    position,
    scale,
    material,
    disableHover = false,
}: {
    texture: THREE.Texture;
    position: [number, number, number];
    scale: [number, number, number];
    material: THREE.ShaderMaterial;
    disableHover?: boolean;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (material && texture) {
            material.uniforms.map.value = texture;
        }
    }, [material, texture]);

    useEffect(() => {
        if (material && material.uniforms) {
            material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
        }
    }, [material, isHovered]);

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            material={material}
            onPointerEnter={() => !disableHover && setIsHovered(true)}
            onPointerLeave={() => !disableHover && setIsHovered(false)}
        >
            <planeGeometry args={[1, 1, 32, 32]} />
        </mesh>
    );
}

function GalleryScene({
    images,
    speed = 1,
    visibleCount = 8,
    fadeSettings = {
        fadeIn: { start: 0.05, end: 0.15 },
        fadeOut: { start: 0.85, end: 0.95 },
    },
    blurSettings = {
        blurIn: { start: 0.0, end: 0.1 },
        blurOut: { start: 0.9, end: 1.0 },
        maxBlur: 3.0,
    },
}: Omit<InfiniteGalleryProps, 'className' | 'style'>) {
    const [scrollVelocity, setScrollVelocity] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const lastInteraction = useRef(Date.now());
    const totalScrollDistance = useRef(0);
    const hasReachedEnd = useRef(false);

    const normalizedImages = useMemo(
        () =>
            images.map((img) =>
                typeof img === 'string' ? { src: img, alt: '' } : img
            ),
        [images]
    );

    const textures = useTexture(normalizedImages.map((img) => img.src));

    // Create materials pool
    const materials = useMemo(
        () => Array.from({ length: visibleCount }, () => createClothMaterial()),
        [visibleCount]
    );

    const spatialPositions = useMemo(() => {
        const positions: { x: number; y: number }[] = [];
        const maxHorizontalOffset = MAX_HORIZONTAL_OFFSET;
        const maxVerticalOffset = MAX_VERTICAL_OFFSET;

        for (let i = 0; i < visibleCount; i++) {
            // Create varied distribution patterns for both axes
            const horizontalAngle = (i * 2.618) % (Math.PI * 2); // Golden angle for natural distribution
            const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2); // Offset angle for vertical

            const horizontalRadius = (i % 3) * 1.2; // Vary the distance from center
            const verticalRadius = ((i + 1) % 4) * 0.8; // Different pattern for vertical

            const x =
                (Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) /
                3;
            const y =
                (Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

            positions.push({ x, y });
        }

        return positions;
    }, [visibleCount]);

    const totalImages = normalizedImages.length;
    const depthRange = DEFAULT_DEPTH_RANGE;

    // Initialize plane data
    const planesData = useRef<PlaneData[]>(
        Array.from({ length: visibleCount }, (_, i) => ({
            index: i,
            z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
            imageIndex: totalImages > 0 ? i % totalImages : 0,
            x: spatialPositions[i]?.x ?? 0, // Use spatial positions for x
            y: spatialPositions[i]?.y ?? 0, // Use spatial positions for y
        }))
    );

    useEffect(() => {
        planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
            index: i,
            z:
                visibleCount > 0
                    ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange
                    : 0,
            imageIndex: totalImages > 0 ? i % totalImages : 0,
            x: spatialPositions[i]?.x ?? 0,
            y: spatialPositions[i]?.y ?? 0,
        }));
    }, [depthRange, spatialPositions, totalImages, visibleCount]);

    // Handle scroll input
    const handleWheel = useCallback(
        (event: WheelEvent) => {
            const maxScrollDistance = totalImages * 8;
            const isScrollingForward = event.deltaY > 0;
            const isScrollingBackward = event.deltaY < 0;
            const atEnd = totalScrollDistance.current >= maxScrollDistance;
            const atStart = totalScrollDistance.current <= 0;

            // Allow normal page scroll only if:
            // - At the end AND scrolling forward, OR
            // - At the start AND scrolling backward
            const shouldAllowPageScroll = (atEnd && isScrollingForward) || (atStart && isScrollingBackward);

            if (!shouldAllowPageScroll) {
                event.preventDefault();
                setScrollVelocity((prev) => prev + event.deltaY * 0.01 * speed);
                setAutoPlay(false);
                lastInteraction.current = Date.now();

                // Reset hasReachedEnd if scrolling backward from the end
                if (atEnd && isScrollingBackward) {
                    hasReachedEnd.current = false;
                }
            }
        },
        [speed, totalImages]
    );

    // Handle keyboard input
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const maxScrollDistance = totalImages * 8;
            const atEnd = totalScrollDistance.current >= maxScrollDistance;
            const atStart = totalScrollDistance.current <= 0;

            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                // Scrolling backward - only prevent if not at start
                if (!atStart) {
                    setScrollVelocity((prev) => prev - 2 * speed);
                    setAutoPlay(false);
                    lastInteraction.current = Date.now();
                    // Reset hasReachedEnd if we were at the end
                    if (atEnd) {
                        hasReachedEnd.current = false;
                    }
                }
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                // Scrolling forward - only prevent if not at end
                if (!atEnd) {
                    setScrollVelocity((prev) => prev + 2 * speed);
                    setAutoPlay(false);
                    lastInteraction.current = Date.now();
                }
            }
        },
        [speed, totalImages]
    );

    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('wheel', handleWheel, { passive: false });
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                canvas.removeEventListener('wheel', handleWheel);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [handleWheel, handleKeyDown]);

    // Auto-play logic - resume after inactivity only if not at the end
    useEffect(() => {
        const interval = setInterval(() => {
            if (Date.now() - lastInteraction.current > 2000 && !hasReachedEnd.current) {
                setAutoPlay(true);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useFrame((state, delta) => {
        // Calculate max scroll distance to show all images
        const maxScrollDistance = totalImages * 8; // Adjust this multiplier to control pacing

        // Track total scroll distance
        totalScrollDistance.current += scrollVelocity * delta * 10;

        // Clamp scroll distance between 0 and max
        if (totalScrollDistance.current >= maxScrollDistance) {
            totalScrollDistance.current = maxScrollDistance;
            hasReachedEnd.current = true;
            setAutoPlay(false);
            setScrollVelocity(0);
        } else if (totalScrollDistance.current < 0) {
            totalScrollDistance.current = 0;
            // If we're at the start, reset velocity
            if (scrollVelocity < 0) {
                setScrollVelocity(0);
            }
        } else {
            // We're in the middle, so we're not at the end
            hasReachedEnd.current = false;
        }

        // Apply auto-play - push forward when auto-play is enabled and not at end
        if (autoPlay && !hasReachedEnd.current) {
            setScrollVelocity((prev) => prev + 0.3 * delta);
        }

        // Damping
        setScrollVelocity((prev) => prev * 0.95);

        // Update time uniform for all materials
        const time = state.clock.getElapsedTime();
        materials.forEach((material) => {
            if (material && material.uniforms) {
                material.uniforms.time.value = time;
                material.uniforms.scrollForce.value = scrollVelocity;
            }
        });

        // Update plane positions
        const totalRange = depthRange;
        const halfRange = totalRange / 2;

        planesData.current.forEach((plane, i) => {
            const spacing = totalRange / totalImages;
            const baseZ = i * spacing;
            const virtualZ = baseZ + totalScrollDistance.current;

            // Wrap the z position correctly for both positive and negative values
            plane.z = virtualZ % totalRange;
            if (plane.z < 0) {
                plane.z += totalRange;
            }

            // Determine the image index based on the continuous virtual position, handling negative indices
            const virtualImageIndex = Math.floor(virtualZ / spacing);
            plane.imageIndex = ((virtualImageIndex % totalImages) + totalImages) % totalImages;

            // Keep the original spatial x/y offsets
            plane.x = spatialPositions[i]?.x ?? 0;
            plane.y = spatialPositions[i]?.y ?? 0;

            const worldZ = plane.z - halfRange;

            // Calculate opacity based on fade settings
            const normalizedPosition = plane.z / totalRange; // 0 to 1
            let opacity = 1;

            if (
                normalizedPosition >= fadeSettings.fadeIn.start &&
                normalizedPosition <= fadeSettings.fadeIn.end
            ) {
                // Fade in: opacity goes from 0 to 1 within the fade in range
                const fadeInProgress =
                    (normalizedPosition - fadeSettings.fadeIn.start) /
                    (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
                opacity = fadeInProgress;
            } else if (normalizedPosition < fadeSettings.fadeIn.start) {
                // Before fade in starts: fully transparent
                opacity = 0;
            } else if (
                normalizedPosition >= fadeSettings.fadeOut.start &&
                normalizedPosition <= fadeSettings.fadeOut.end
            ) {
                // Fade out: opacity goes from 1 to 0 within the fade out range
                const fadeOutProgress =
                    (normalizedPosition - fadeSettings.fadeOut.start) /
                    (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
                opacity = 1 - fadeOutProgress;
            } else if (normalizedPosition > fadeSettings.fadeOut.end) {
                // After fade out ends: fully transparent
                opacity = 0;
            }

            // Clamp opacity between 0 and 1
            opacity = Math.max(0, Math.min(1, opacity));

            // Calculate blur based on blur settings
            let blur = 0;

            if (
                normalizedPosition >= blurSettings.blurIn.start &&
                normalizedPosition <= blurSettings.blurIn.end
            ) {
                // Blur in: blur goes from maxBlur to 0 within the blur in range
                const blurInProgress =
                    (normalizedPosition - blurSettings.blurIn.start) /
                    (blurSettings.blurIn.end - blurSettings.blurIn.start);
                blur = blurSettings.maxBlur * (1 - blurInProgress);
            } else if (normalizedPosition < blurSettings.blurIn.start) {
                // Before blur in starts: full blur
                blur = blurSettings.maxBlur;
            } else if (
                normalizedPosition >= blurSettings.blurOut.start &&
                normalizedPosition <= blurSettings.blurOut.end
            ) {
                // Blur out: blur goes from 0 to maxBlur within the blur out range
                const blurOutProgress =
                    (normalizedPosition - blurSettings.blurOut.start) /
                    (blurSettings.blurOut.end - blurSettings.blurOut.start);
                blur = blurSettings.maxBlur * blurOutProgress;
            } else if (normalizedPosition > blurSettings.blurOut.end) {
                // After blur out ends: full blur
                blur = blurSettings.maxBlur;
            }

            // Clamp blur to reasonable values
            blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

            // Update material uniforms
            const material = materials[i];
            if (material && material.uniforms) {
                material.uniforms.opacity.value = opacity;
                material.uniforms.blurAmount.value = blur;

                // Set gradient uniforms based on image settings
                const currentImage = normalizedImages[plane.imageIndex];
                const gradient = typeof currentImage !== 'string' && currentImage.gradient ? currentImage.gradient : null;
                material.uniforms.gradientLeft.value = gradient?.left || 0.0;
                material.uniforms.gradientRight.value = gradient?.right || 0.0;
                material.uniforms.gradientTop.value = gradient?.top || 0.0;
                material.uniforms.gradientBottom.value = gradient?.bottom || 0.0;
            }
        });
    });

    if (normalizedImages.length === 0) return null;

    return (
        <>
            {planesData.current.map((plane, i) => {
                const texture = textures[plane.imageIndex];
                const material = materials[i];

                if (!texture || !material) return null;

                const worldZ = plane.z - depthRange / 2;

                // Calculate scale to maintain aspect ratio
                const aspect = texture.image
                    ? texture.image.width / texture.image.height
                    : 1;
                const scale: [number, number, number] =
                    aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];

                const currentImage = normalizedImages[plane.imageIndex];
                const disableHover = typeof currentImage !== 'string' && currentImage.disableHover ? currentImage.disableHover : false;

                return (
                    <ImagePlane
                        key={plane.index}
                        texture={texture}
                        position={[plane.x, plane.y, worldZ]} // Position planes relative to camera center
                        scale={scale}
                        material={material}
                        disableHover={disableHover}
                    />
                );
            })}
        </>
    );
}

// Fallback component for when WebGL is not available
function FallbackGallery({ images }: { images: ImageItem[] }) {
    const normalizedImages = useMemo(
        () =>
            images.map((img) =>
                typeof img === 'string' ? { src: img, alt: '' } : img
            ),
        [images]
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f3f4f6', padding: '1rem' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                WebGL not supported. Showing image list:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxHeight: '24rem', overflowY: 'auto' }}>
                {normalizedImages.map((img, i) => (
                    <img
                        key={i}
                        src={img.src}
                        alt={img.alt}
                        style={{ width: '100%', height: '8rem', objectFit: 'cover', borderRadius: '0.5rem' }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function InfiniteGallery({
    images,
    className = '',
    style,
    fadeSettings = {
        fadeIn: { start: 0.05, end: 0.25 },
        fadeOut: { start: 0.4, end: 0.43 },
    },
    blurSettings = {
        blurIn: { start: 0.0, end: 0.1 },
        blurOut: { start: 0.4, end: 0.43 },
        maxBlur: 8.0,
    },
}: InfiniteGalleryProps) {
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        // Check WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl =
                canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                setWebglSupported(false);
            }
        } catch (e) {
            setWebglSupported(false);
        }
    }, []);

    if (!webglSupported) {
        return (
            <div className={className} style={style}>
                <FallbackGallery images={images} />
            </div>
        );
    }

    return (
        <div className={className} style={style}>
            <Canvas
                camera={{ position: [0, 0, 0], fov: 55 }}
                gl={{ antialias: true, alpha: true }}
            >
                <GalleryScene
                    images={images}
                    fadeSettings={fadeSettings}
                    blurSettings={blurSettings}
                />
            </Canvas>
        </div>
    );
}
