import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { useMemo } from "react";
import { ELEMENT_BY_CODE } from "@/lib/elements";

const COLORS: Record<string, string> = {
  W: "#2f7fd8",
  F: "#e2632a",
  E: "#3f9e5f",
  A: "#9fdfe8",
  ".": "#2b2440",
};

function Terrain({ grid }: { grid: string[] }) {
  const tiles = useMemo(() => {
    const h = grid.length;
    const w = grid[0]?.length ?? 0;
    const out: { x: number; z: number; height: number; color: string; code: string }[] = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const code = grid[y]?.[x] ?? ".";
        const el = ELEMENT_BY_CODE[code] ?? ELEMENT_BY_CODE["."]!;
        out.push({
          x: x - w / 2 + 0.5,
          z: y - h / 2 + 0.5,
          height: el.height,
          color: COLORS[code] ?? COLORS["."]!,
          code,
        });
      }
    }
    return out;
  }, [grid]);

  return (
    <group>
      {tiles.map((t, i) => (
        <mesh key={i} position={[t.x, t.height / 2, t.z]} castShadow receiveShadow>
          <boxGeometry args={[0.96, t.height, 0.96]} />
          <meshStandardMaterial
            color={t.color}
            roughness={t.code === "W" ? 0.15 : 0.7}
            metalness={t.code === "F" ? 0.35 : 0.1}
            emissive={t.color}
            emissiveIntensity={t.code === "F" ? 0.5 : t.code === "A" ? 0.2 : 0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

export function WorldViewer3D({ grid }: { grid: string[] }) {
  const span = Math.max(grid.length, grid[0]?.length ?? 8);

  return (
    <div className="panel h-full min-h-[420px] w-full overflow-hidden">
      <Canvas shadows camera={{ position: [span * 0.9, span * 0.85, span * 0.9], fov: 45 }}>
        <color attach="background" args={["#100c1c"]} />
        <fog attach="fog" args={["#100c1c", span * 1.6, span * 3.4]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[span, span * 1.4, span * 0.6]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Environment>
          <Lightformer intensity={1.6} position={[0, 6, 0]} scale={[14, 14, 1]} />
          <Lightformer
            intensity={1.1}
            color="#8f6bff"
            position={[-8, 2, -2]}
            rotation-y={Math.PI / 2}
            scale={[20, 2, 1]}
          />
        </Environment>
        <Terrain grid={grid} />
        <OrbitControls enablePan={false} minDistance={span * 0.6} maxDistance={span * 2.4} />
      </Canvas>
    </div>
  );
}
