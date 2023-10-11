import { useEffect, useRef, useState } from "react";
import { useBeforeRender, useEngine, useScene } from "react-babylonjs";
import useAnalyser from "~/components/chipmod/useAnalyser";
import BoxVisualizer from "./visualizers/BoxVisualizer";
import { useMainSound } from "./chipmodmain";
import CylinderVisualizer from "./visualizers/CylinderVisualizer";
import ProceduralVisualizer from "./visualizers/ProceduralVisualizer";

type TDCProps = {
  showDebug: boolean;
};
export default function TDC({ showDebug }: TDCProps) {
  // Todo: Fix this
  const bpm = 133;
  const offset = 20;

  const scene = useScene();
  const soundRef = useMainSound(scene);

  const [visType, setVisType] = useState<"box" | "cylinder" | "sky">("sky");

  const { byteFrequencyRef } = useAnalyser(scene, showDebug);
  const [freqData, setFreqData] = useState<Uint8Array>(new Uint8Array(0));

  const FRAME_INTERVAL = 30;

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
      {visType == "cylinder" && (
        <CylinderVisualizer
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
