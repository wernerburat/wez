import React, { useEffect } from "react";
import { useBabylon } from "../context/BabylonContext";
import { ArcRotateCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import RacerScene from "../racer/RacerScene";

const BabylonWrapper: React.FC = () => {
  const { scene, engine, canvasRef, loading } = useBabylon();

  useEffect(() => {
    if (scene && engine && canvasRef && !loading) {
      // // Camera
      // const camera = new ArcRotateCamera(
      //   "camera",
      //   -Math.PI / 2,
      //   Math.PI / 2,
      //   10,
      //   Vector3.Zero(),
      //   scene,
      // );
      // camera.setTarget(Vector3.Zero());

      // Light
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // Render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      // Resize
      window.addEventListener("resize", () => {
        engine.resize();
      });
    }

    return () => {
      window.removeEventListener("resize", () => {
        engine?.resize();
      });
    };
  }, [scene, engine, canvasRef, loading]);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="pointer-events-none absolute flex w-full justify-center"></div>
      <RacerScene />
    </div>
  );
};

export default BabylonWrapper;
