import React, { useEffect } from "react";
import { useBabylon } from "../context/BabylonContext";
import { ArcRotateCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import useMeshBuilder from "../hook/useMeshBuilder";

const BabylonWrapper: React.FC = () => {
  const { scene, engine, canvasRef, loading } = useBabylon();
  const { createBox } = useMeshBuilder();

  useEffect(() => {
    if (scene && engine && canvasRef && !loading) {
      // Camera
      const camera = new ArcRotateCamera(
        "camera",
        0,
        Math.PI / 3,
        10,
        Vector3.Zero(),
        scene,
      );
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvasRef.current, true);

      // Light
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      createBox("box", {});

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
  }, [scene, engine, canvasRef, loading, createBox]);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="pointer-events-none absolute flex w-full justify-center"></div>
    </div>
  );
};

export default BabylonWrapper;
