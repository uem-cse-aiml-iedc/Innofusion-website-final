import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingResourcesProps {
  type?: 'gold' | 'elixir' | 'gems' | 'mixed';
  count?: number;
}

const FloatingResources = ({ type = 'mixed', count = 30 }: FloatingResourcesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create resources based on type
    const resources: THREE.Mesh[] = [];
    
    for (let i = 0; i < count; i++) {
      let geometry: THREE.BufferGeometry;
      let material: THREE.MeshBasicMaterial;
      
      const resourceType = type === 'mixed' 
        ? ['gold', 'elixir', 'gems'][Math.floor(Math.random() * 3)]
        : type;

      switch (resourceType) {
        case 'gold':
          // Gold coin - flat cylinder
          geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 16);
          material = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.9,
          });
          break;
        case 'elixir':
          // Elixir drop - elongated sphere
          geometry = new THREE.SphereGeometry(0.5, 16, 16);
          geometry.scale(1, 1.5, 1);
          material = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.8,
          });
          break;
        case 'gems':
          // Gem - octahedron
          geometry = new THREE.OctahedronGeometry(0.6);
          material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.9,
          });
          break;
        default:
          geometry = new THREE.SphereGeometry(0.5);
          material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      }

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      );
      
      // Random rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Store animation data
      (mesh as any).animationData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: mesh.position.y,
      };

      resources.push(mesh);
      scene.add(mesh);
    }

    // Add glow effect with point lights
    const goldLight = new THREE.PointLight(0xffd700, 0.5, 50);
    goldLight.position.set(10, 10, 10);
    scene.add(goldLight);

    const elixirLight = new THREE.PointLight(0xff00ff, 0.3, 50);
    elixirLight.position.set(-10, -10, 10);
    scene.add(elixirLight);

    // Animation
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame++;

      resources.forEach((resource) => {
        const data = (resource as any).animationData;
        
        // Rotate
        resource.rotation.x += data.rotationSpeed.x;
        resource.rotation.y += data.rotationSpeed.y;
        resource.rotation.z += data.rotationSpeed.z;
        
        // Float up and down
        resource.position.y = data.originalY + Math.sin(frame * 0.01 * data.floatSpeed + data.floatOffset) * 2;
      });

      // Animate lights
      goldLight.position.x = Math.sin(frame * 0.005) * 15;
      elixirLight.position.y = Math.cos(frame * 0.005) * 15;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      resources.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
    };
  }, [type, count]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
};

export default FloatingResources;
