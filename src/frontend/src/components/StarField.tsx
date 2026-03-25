import { Stars } from "@react-three/drei";

export default function StarField() {
  return (
    <Stars
      radius={300}
      depth={60}
      count={5000}
      factor={5}
      saturation={0}
      fade
    />
  );
}
