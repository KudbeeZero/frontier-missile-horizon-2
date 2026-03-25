import { useEffect, useMemo, useRef } from "react";
import type * as THREE from "three";
import type { HexPlot } from "../utils/hexPlots";
import { buildHexGeometryData } from "../utils/hexPlots";

interface HexGridProps {
  plots: HexPlot[];
  selectedPlotId: string | null;
}

export default function HexGrid({ plots, selectedPlotId }: HexGridProps) {
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => {
    const { positions: pos } = buildHexGeometryData(plots, null);
    return pos;
  }, [plots]);

  const initialColors = useMemo(() => {
    const { colors } = buildHexGeometryData(plots, null);
    return colors;
  }, [plots]);

  // Update colors when selection changes
  useEffect(() => {
    if (!geoRef.current) return;
    const { colors } = buildHexGeometryData(plots, selectedPlotId);
    const attr = geoRef.current.attributes.color as THREE.BufferAttribute;
    if (attr) {
      attr.array.set(colors);
      attr.needsUpdate = true;
    }
  }, [selectedPlotId, plots]);

  return (
    <lineSegments>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[initialColors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
}
