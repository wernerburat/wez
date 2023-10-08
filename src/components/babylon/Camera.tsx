import React, { useRef } from "react";
import { Vector3, ArcRotateCamera } from "@babylonjs/core";

export const Camera = () => {
  const cameraRef = useRef<ArcRotateCamera>(null);

  return (
    <arcRotateCamera
      name="camera1"
      ref={cameraRef}
      alpha={-Math.PI / 2}
      beta={Math.PI / (2 + 0.1)}
      radius={5}
      target={Vector3.Zero()}
    />
  );
};
