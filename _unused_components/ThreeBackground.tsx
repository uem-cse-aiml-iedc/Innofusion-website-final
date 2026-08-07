import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if device prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false, // Disable antialiasing for performance
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const starParticles = createStarSystem();
    scene.add(starParticles);

    const lightningGroup = createLightningEffect();
    scene.add(lightningGroup);

    // Frame rate limiting for smooth 30fps animation
    let frame = 0;
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Skip if tab is not visible
      if (!isVisibleRef.current) return;
      
      // Frame rate limiting
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);
      
      frame++;

      // Smoother, slower rotations
      starParticles.rotation.y += 0.00005;

      // Less frequent lightning
      if (frame % 180 === 0) {
        lightningGroup.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = 0.8;
          }
        });
      }
      lightningGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material.opacity > 0) {
          child.material.opacity *= 0.95;
        }
      });

      renderer.render(scene, camera);
    };
    animationRef.current = requestAnimationFrame(animate);

    // Pause animation when tab is not visible
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Debounced resize handler for performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose all geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

// Helper function to create particle systems
function createParticleSystem(color: number, count: number, size: number): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 150;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 80 - 20;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: color,
    size: size,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

// Helper function to create star/sparkle system - optimized count
function createStarSystem(): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const count = 200; // Reduced from 500 for performance
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200;
    positions[i + 1] = (Math.random() - 0.5) * 150;
    positions[i + 2] = (Math.random() - 0.5) * 100 - 30;

    const isGold = Math.random() > 0.5;
    colors[i] = isGold ? 1 : 1;
    colors[i + 1] = isGold ? 0.84 : 1;
    colors[i + 2] = isGold ? 0 : 1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.2,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

// Helper function to create lightning effect
function createLightningEffect(): THREE.Group {
  const group = new THREE.Group();
  
  for (let i = 0; i < 3; i++) {
    const points: THREE.Vector3[] = [];
    let x = (Math.random() - 0.5) * 100;
    let y = 50;
    
    for (let j = 0; j < 10; j++) {
      points.push(new THREE.Vector3(x, y, -30));
      x += (Math.random() - 0.5) * 10;
      y -= Math.random() * 10;
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00bfff,
      transparent: true,
      opacity: 0,
    });
    
    const lightning = new THREE.Line(geometry, material);
    group.add(lightning);
  }
  
  return group;
}

export default ThreeBackground;
