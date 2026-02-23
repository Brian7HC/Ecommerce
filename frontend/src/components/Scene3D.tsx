import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const FloatingElements = () => {
  const sphereRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    sphereRef.current.position.y = Math.sin(t) * 0.2;
    sphereRef.current.rotation.x = Math.sin(t / 4);
    sphereRef.current.rotation.y = Math.cos(t / 2);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.woff"
          fontSize={1.5}
          color="white"
          position={[0, 0, -2]}
          maxWidth={10}
          textAlign="center"
          fontStyle="italic"
          fontWeight="black"
        >
          CR7
        </Text>
      </Float>

      <Sphere ref={sphereRef} args={[1, 64, 64]} position={[2, 1, 0]}>
        <MeshDistortMaterial
          color="#333"
          speed={3}
          distort={0.4}
          radius={1}
        />
      </Sphere>

      <Sphere args={[0.5, 32, 32]} position={[-3, -1, 1]}>
        <meshStandardMaterial color="#666" wireframe />
      </Sphere>
    </>
  );
};

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <FloatingElements />
      </Canvas>
    </div>
  );
};
