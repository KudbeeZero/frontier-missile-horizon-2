# Frontier: Missile Horizon

## Current State
New project. Empty frontend scaffold. No backend required — all state is in-memory.

## Requested Changes (Diff)

### Add
- Full-screen React Three Fiber Canvas as scene root
- Earth sphere with NASA public-domain day texture, specular map, and normal map via @react-three/drei useTexture
- CloudLayer: slightly larger sphere with cloud texture, slow rotation via useFrame
- AtmosphereGlow: custom ShaderMaterial with Fresnel blue rim effect
- StarField: Points geometry with ~5000 randomized positions
- HexGrid: 10,000 hex plot coordinates using Fibonacci sphere distribution, rendered as neon-cyan LineSegments overlay
- Plot data model: { plotId: string, owner: string | null, faction: string | null, color: string }
- Unowned plots: dim cyan (#00FFFF at low opacity); owned plots glow with faction color
- Click/tap handler: logs plotId to console, sets selectedPlot in React state
- OrbitControls for rotation and zoom
- Mock seed: 50 random plots owned across 3 factions — Nova Core (#00AAFF), Rebel Front (#FF4400), Syndicate (#AA00FF)

### Modify
- App.tsx: replace default content with full-screen Canvas scene

### Remove
- Default placeholder UI

## Implementation Plan
1. Install / verify @react-three/fiber, @react-three/drei, three are available
2. Create HexGrid utility: Fibonacci sphere distribution generating 10,000 plot center points, then build tiny hexagon geometry per point projected onto sphere surface, merged into LineSegments
3. Create faction color map and mock ownership seed (50 plots, 3 factions)
4. Build scene components: EarthSphere, CloudLayer, AtmosphereGlow, StarField, HexGrid
5. Wire click raycasting on HexGrid plots
6. Compose all in a single Canvas in App.tsx with OrbitControls
7. Use merged/instanced geometry for hex lines to keep draw calls low
