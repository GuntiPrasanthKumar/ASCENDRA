import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, ContactShadows, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Blob = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.5, 32, 32]} position={[2, 0, -2]}>
        <MeshDistortMaterial
          color="#2A2A2A"
          envMapIntensity={0.8}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          roughness={0.2}
          metalness={0.4}
          distort={0.3}
          speed={1.5}
        />
      </Sphere>
    </Float>
  );
};

const Dodecahedron = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[-2.5, 1, -1]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color="#888888" 
          roughness={0.2} 
          metalness={0.1} 
          transmission={0.8} 
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
};

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 h-screen w-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "low-power", antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        
        <Blob />
        <Dodecahedron />
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} frames={1} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />
    </div>
  );
}
