import { Scene, Sound } from "@babylonjs/core";
import { Nullable } from "@babylonjs/core/types";

export type VisualizerProps = {
  soundRef: React.MutableRefObject<Sound | null>;
  showDebug?: boolean;
  bpm: number;
  offset: number;
  freqArray?: Uint8Array;
};
