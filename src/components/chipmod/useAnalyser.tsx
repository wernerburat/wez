import { useEffect, useRef } from "react";
import { Analyser as EAnalyser } from "@babylonjs/core/Audio/analyser";
import { Engine as EEngine } from "@babylonjs/core/Engines/engine";
import type { Scene as BabylonScene } from "@babylonjs/core/";

const useAnalyser = (scene: BabylonScene | null, showDebug: boolean) => {
  const analyserRef = useRef<EAnalyser | null>(null); // Initialize with null
  const byteTimeRef = useRef<Uint8Array | null>(null); // Initialize with null
  const byteFrequencyRef = useRef<Uint8Array | null>(null); // Initialize with null

  useEffect(() => {
    if (analyserRef.current) {
      if (showDebug) {
        analyserRef.current.drawDebugCanvas();
      } else {
        analyserRef.current.stopDebugCanvas();
      }
    }
  }, [showDebug]);

  useEffect(() => {
    if (!analyserRef.current && scene) {
      analyserRef.current = new EAnalyser(scene);
      EEngine.audioEngine?.connectToAnalyser(analyserRef.current);
      byteTimeRef.current = analyserRef.current.getByteTimeDomainData();
      byteFrequencyRef.current = analyserRef.current.getByteFrequencyData();
    }
  }, [scene]);
  return { analyserRef, byteTimeRef, byteFrequencyRef };
};

export default useAnalyser;
