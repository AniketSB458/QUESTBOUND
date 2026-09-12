import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function MagicOrbShape() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4;
      ring1Ref.current.rotation.y += delta * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.3;
      ring2Ref.current.rotation.z += delta * 0.6;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y -= delta * 0.5;
      ring3Ref.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Outer Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.5, 0.04, 16, 100]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Outer Ring 2 */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.2, 0.06, 16, 100]} />
          <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Outer Ring 3 */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[0.9, 0.08, 16, 100]} />
          <meshStandardMaterial color="#b45309" roughness={0.1} metalness={0.95} />
        </mesh>
        
        {/* Inner Glowing Core */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#d97706"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
          />
        </mesh>

        <Sparkles count={80} scale={4} size={2} speed={0.2} opacity={0.8} color="#fef08a" />
      </Float>
    </group>
  );
}

export default function MagicOrb() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing rounded-full overflow-hidden shadow-[inset_0_0_50px_rgba(245,158,11,0.15)] relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#fcd34d" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
        <MagicOrbShape />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
