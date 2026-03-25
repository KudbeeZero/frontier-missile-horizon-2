import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

const CLOUD_TEX =
  "https://unpkg.com/three-globe@2.31.2/example/img/earth-clouds.png";

export default function CloudLayer() {
  const meshRef = useRef<THREE.Mesh>(null);

  const cloudTexture = useTexture(CLOUD_TEX);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.00005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.01, 64, 64]} />
      <meshPhongMaterial
        map={cloudTexture}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </mesh>
  );
}
