import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface EarthSphereProps {
  onPointerDown?: (point: THREE.Vector3) => void;
}

const DAY_TEX =
  "https://unpkg.com/three-globe@2.31.2/example/img/earth-blue-marble.jpg";
const NORMAL_TEX =
  "https://unpkg.com/three-globe@2.31.2/example/img/earth-topology.png";
const SPECULAR_TEX =
  "https://unpkg.com/three-globe@2.31.2/example/img/earth-water.png";

export default function EarthSphere({ onPointerDown }: EarthSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const textures = useTexture({
    map: DAY_TEX,
    normalMap: NORMAL_TEX,
    specularMap: SPECULAR_TEX,
  });

  return (
    <mesh
      ref={meshRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (onPointerDown) onPointerDown(e.point);
      }}
    >
      <sphereGeometry args={[1.0, 64, 64]} />
      <meshPhongMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        specularMap={textures.specularMap}
        shininess={15}
        specular={new THREE.Color(0x333333)}
      />
    </mesh>
  );
}
