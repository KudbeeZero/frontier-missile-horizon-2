import * as THREE from "three";

export interface HexPlot {
  plotId: string;
  lat: number;
  lon: number;
  position: THREE.Vector3;
  owner: string | null;
  faction: string | null;
  color: string;
}

export const FACTIONS: Record<string, string> = {
  "Nova Core": "#00AAFF",
  "Rebel Front": "#FF4400",
  Syndicate: "#AA00FF",
};

export const UNOWNED_COLOR = "#003333";
export const SELECTED_COLOR = "#FFFFFF";

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export function generatePlots(n: number): HexPlot[] {
  const plots: HexPlot[] = [];

  for (let i = 0; i < n; i++) {
    const theta = (2 * Math.PI * i) / GOLDEN_RATIO;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);

    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);

    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(z, x) * 180) / Math.PI;

    plots.push({
      plotId: `plot_${i}`,
      lat,
      lon,
      position: new THREE.Vector3(x, y, z),
      owner: null,
      faction: null,
      color: UNOWNED_COLOR,
    });
  }

  return plots;
}

export function seedOwnership(plots: HexPlot[]): HexPlot[] {
  const result = plots.map((p) => ({ ...p }));
  const factionNames = Object.keys(FACTIONS);
  const usedIndices = new Set<number>();

  let factionIdx = 0;
  let seeded = 0;

  while (seeded < 50) {
    const idx = Math.floor(Math.random() * result.length);
    if (usedIndices.has(idx)) continue;
    usedIndices.add(idx);

    const faction = factionNames[factionIdx % factionNames.length];
    result[idx].owner = `Agent_${Math.floor(Math.random() * 9999)}`;
    result[idx].faction = faction;
    result[idx].color = FACTIONS[faction];

    factionIdx++;
    seeded++;
  }

  return result;
}

export function getHexVertices(
  center: THREE.Vector3,
  hexSize: number,
): THREE.Vector3[] {
  const up = new THREE.Vector3(0, 1, 0);
  let tangent1 = new THREE.Vector3();

  if (Math.abs(center.dot(up)) > 0.99) {
    tangent1.crossVectors(center, new THREE.Vector3(1, 0, 0)).normalize();
  } else {
    tangent1.crossVectors(center, up).normalize();
  }

  const tangent2 = new THREE.Vector3()
    .crossVectors(center, tangent1)
    .normalize();

  const vertices: THREE.Vector3[] = [];
  for (let k = 0; k < 6; k++) {
    const angle = (k * Math.PI) / 3;
    const v = new THREE.Vector3()
      .addScaledVector(tangent1, Math.cos(angle) * hexSize)
      .addScaledVector(tangent2, Math.sin(angle) * hexSize)
      .add(center);
    v.normalize().multiplyScalar(1.005);
    vertices.push(v);
  }
  return vertices;
}

export function buildHexGeometryData(
  plots: HexPlot[],
  selectedPlotId: string | null,
  hexSize = 0.022,
): { positions: Float32Array; colors: Float32Array } {
  const VERTS_PER_HEX = 12; // 6 edges × 2 vertices
  const total = plots.length * VERTS_PER_HEX;
  const positions = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);

  let pi = 0;
  let ci = 0;

  for (const plot of plots) {
    const verts = getHexVertices(plot.position, hexSize);
    const colorHex =
      plot.plotId === selectedPlotId ? SELECTED_COLOR : plot.color;
    const col = new THREE.Color(colorHex);

    // 6 edges: [0→1, 1→2, 2→3, 3→4, 4→5, 5→0]
    const edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ];

    for (const [a, b] of edges) {
      positions[pi++] = verts[a].x;
      positions[pi++] = verts[a].y;
      positions[pi++] = verts[a].z;
      positions[pi++] = verts[b].x;
      positions[pi++] = verts[b].y;
      positions[pi++] = verts[b].z;

      colors[ci++] = col.r;
      colors[ci++] = col.g;
      colors[ci++] = col.b;
      colors[ci++] = col.r;
      colors[ci++] = col.g;
      colors[ci++] = col.b;
    }
  }

  return { positions, colors };
}
