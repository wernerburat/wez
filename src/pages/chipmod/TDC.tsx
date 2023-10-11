import { useState } from "react";
import { useScene } from "react-babylonjs";
import BoxVisualizer from "./visualizers/BoxVisualizer";
import { useMainSound } from "./chipmodmain";
import ProceduralVisualizer from "./visualizers/ProceduralVisualizer";

export default function TDC() {
  // Todo: Fix this
  const bpm = 133;
  const offset = 20;

  const scene = useScene();
  const soundRef = useMainSound(scene);

  const [visType] = useState<"box" | "cylinder" | "sky">("sky");

  const [freqData] = useState<Uint8Array>(new Uint8Array(0));

  // Create a material and set its diffuse texture to the dynamic texture
  return (
    <>
      {visType == "box" && (
        <BoxVisualizer
          soundRef={soundRef}
          bpm={bpm}
          freqArray={freqData}
          offset={offset}
        />
      )}
      {visType == "sky" && (
        <ProceduralVisualizer
          soundRef={soundRef}
          bpm={bpm}
          freqArray={freqData}
          offset={offset}
        />
      )}
    </>
  );
}
