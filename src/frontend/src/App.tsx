import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

export default function App() {
  return (
    <div
      style={{ width: "100vw", height: "100vh", background: "#05080C" }}
      data-ocid="globe.canvas_target"
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>

      {/* Branding */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          color: "rgba(25, 230, 227, 0.4)",
          fontSize: "11px",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        FRONTIER: MISSILE HORIZON
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(25, 230, 227, 0.3)",
          fontSize: "10px",
          fontFamily: "monospace",
          pointerEvents: "auto",
          userSelect: "none",
        }}
      >
        &copy; {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(25, 230, 227, 0.45)", textDecoration: "none" }}
        >
          Built with ❤ using caffeine.ai
        </a>
      </div>
    </div>
  );
}
