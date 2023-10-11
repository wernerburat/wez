import { type MutableRefObject, useState } from "react";
import { type Sound } from "@babylonjs/core";
import { Easings } from "~/components/chipmod/easings";

type BeatEasingReturn = [number, () => void];
export const useBeatEasing = (
  soundRef: MutableRefObject<Sound | null>,
  easingType = "linear",
  duration = 1000,
): BeatEasingReturn => {
  const [easingValue, setEasingValue] = useState(0);
  const easing = Easings[easingType];

  const animateBeat = () => {
    if (!soundRef.current?.isPlaying) return;

    let startTime: number;
    const frame = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / duration);
      const value = 1 - easing!(t);

      setEasingValue(value);

      if (t < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  };

  return [easingValue, animateBeat];
};
