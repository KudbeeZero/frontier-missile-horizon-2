import { OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import type * as THREE from "three";
import { generatePlots, seedOwnership } from "../utils/hexPlots";
import AtmosphereGlow from "./AtmosphereGlow";
import CloudLayer from "./CloudLayer";
import EarthSphere from "./EarthSphere";
import HexGrid from "./HexGrid";
import StarField from "./StarField";

const NUM_PLOTS = 10000;

export default function Scene() {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

  const plots = useMemo(() => {
    const raw = generatePlots(NUM_PLOTS);
    return seedOwnership(raw);
  }, []);

  function handleGlobeClick(point: THREE.Vector3) {
    const dir = point.clone().normalize();
    let bestPlot = plots[0];
    let bestDot = Number.NEGATIVE_INFINITY;

    for (const plot of plots) {
      const d = plot.position.dot(dir);
      if (d > bestDot) {
        bestDot = d;
        bestPlot = plot;
      }
    }

    console.log("Selected plot:", bestPlot.plotId, bestPlot);
    setSelectedPlotId(bestPlot.plotId);
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />

      {/* Stars (no texture loading needed) */}
      <StarField />

      {/* Atmosphere (no texture loading needed) */}
      <AtmosphereGlow />

      {/* Globe content inside Suspense for texture loading */}
      <Suspense fallback={null}>
        <EarthSphere onPointerDown={handleGlobeClick} />
        <CloudLayer />
      </Suspense>

      {/* Hex grid overlay */}
      <HexGrid plots={plots} selectedPlotId={selectedPlotId} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}
