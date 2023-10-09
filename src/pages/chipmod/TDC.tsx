import React, { useEffect, useRef, useState } from "react";
import { useBeforeRender, useScene } from "react-babylonjs";
import {
  Color3,
  DynamicTexture,
  Mesh,
  Sound,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { useActiveCamera } from "../../components/chipmod/useActiveCamera";
import { useMainSound, useAnalyser } from "./chipmodmain";
import { ArcRotateCamera, PBRMaterial } from "@babylonjs/core";

export const useAverageFrequencyAnimation = (
  cameraRef: React.MutableRefObject<ArcRotateCamera | null>,
  byteFrequencyRef: React.MutableRefObject<Uint8Array | null>,
  boxRef?: React.MutableRefObject<Mesh | null>,
) => {
  const movecam = false;

  useBeforeRender(() => {
    if (byteFrequencyRef.current) {
      // Calculate average of the first few values for bass frequencies
      const len = byteFrequencyRef.current.length;
      const bassValues = byteFrequencyRef.current.slice(
        Math.floor(len / 6),
        len,
      ); // Adjust the slice range as needed
      const bassAvg = bassValues.reduce((a, b) => a + b, 0) / bassValues.length;
      console.log(bassAvg);

      // Use bassAvg for more pronounced rotation when there's more bass
      if (cameraRef.current && movecam) {
        cameraRef.current.alpha += bassAvg / 10000;
      }
      if (boxRef) {
        boxRef.current!.rotate(new Vector3(0, 1, 0), bassAvg / 10000);
      }
    }
  });
};

export const useTexture = () => {
  const textureRef = useRef<DynamicTexture>(
    new DynamicTexture("dt", { width: 512, height: 512 }, useScene(), false, 0),
  );
  textureRef.current.hasAlpha = true;
  return textureRef;
};

export const TDC = () => {
  const scene = useScene();
  const cameraRef = useActiveCamera(scene);
  const soundRef = useMainSound(scene);
  const { analyserRef, byteFrequencyRef } = useAnalyser(scene);
  const progress = useTrackProgress(soundRef);
  const boxRef = useRef(null);

  const textureRef = useTexture();

  //useAverageFrequencyAnimation(cameraRef, byteFrequencyRef, boxRef);

  useBeforeRender(() => {
    // Every 12 frames:
    if (scene!.getFrameId() % 12 == 0) {
      if (byteFrequencyRef.current) {
        const data = byteFrequencyRef.current;

        // Calculate bass average (first few values)
        const bassValues = data.slice(0, 10);
        const bassAvg = (
          bassValues.reduce((a, b) => a + b, 0) / bassValues.length
        ).toFixed(1);

        // Calculate treble average (last few values)
        const trebleValues = data.slice(data.length - 10);
        const trebleAvg = (
          trebleValues.reduce((a, b) => a + b, 0) / trebleValues.length
        ).toFixed(1);

        // Overall average
        const overallAvg = (
          data.reduce((a, b) => a + b, 0) / data.length
        ).toFixed(1);

        // Peak frequency value
        const peakValue = Math.max(...data).toFixed(1);

        textureRef.current.getContext().clearRect(0, 0, 512, 512);
        textureRef.current.drawText(
          `Bass Avg: ${bassAvg}`,
          10,
          40,
          "bold 24px monospace",
          "white",
          "transparent",
          false,
          false,
        );
        textureRef.current.drawText(
          `Treble Avg: ${trebleAvg}`,
          10,
          80,
          "bold 24px monospace",
          "white",
          "transparent",
          false,
          false,
        );
        textureRef.current.drawText(
          `Overall Avg: ${overallAvg}`,
          10,
          120,
          "bold 24px monospace",
          "white",
          "transparent",
          false,
          false,
        );
        textureRef.current.drawText(
          `Peak Value: ${peakValue}`,
          10,
          160,
          "bold 24px monospace",
          "white",
          "transparent",
          false,
          false,
        );
        textureRef.current.update();
      }
    }
  });

  // Create a material and set its diffuse texture to the dynamic texture

  return (
    <>
      <box ref={boxRef} name="box-1" size={2} position={new Vector3(0, 2, 2)}>
        <pbrMaterial name="pbr"></pbrMaterial>
      </box>
      <box name="box-2" size={2} position={new Vector3(0, -1, 0)}>
        <pbrMaterial
          name="pbr"
          albedoTexture={textureRef.current}
        ></pbrMaterial>
      </box>
    </>
  );
};

export const useTrackProgress = (
  soundRef: React.MutableRefObject<Sound | null>,
) => {
  const [progress, setProgress] = useState(0); // Progress in percentage

  useEffect(() => {
    const interval = setInterval(() => {
      if (soundRef.current) {
        // const currentTime = soundRef.current.playbackTime;
        // const duration = soundRef.current.duration;
        // const currentProgress = (currentTime / duration) * 100;
        const currentProgress = 1;
        setProgress(currentProgress);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [soundRef]);

  return progress;
};
