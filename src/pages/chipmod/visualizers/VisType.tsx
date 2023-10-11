import { type Sound } from "@babylonjs/core";

type VisualizerProps = {
  soundRef: React.MutableRefObject<Sound | null>;
  showDebug?: boolean;
  bpm: number;
  offset: number;
  freqArray?: Uint8Array;
};

export default VisualizerProps;
