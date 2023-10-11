import React, { useEffect } from "react";
import MeshRenderer from "../Scene"; // Composant enfant que nous allons créer.
import { useBabylon } from "../context/BabylonContext";
import {
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
} from "@babylonjs/core";

const BabylonWrapper: React.FC = () => {
  const { scene, engine, canvasRef } = useBabylon();

  useEffect(() => {
    if (scene && engine && canvasRef) {
      // Camera
      const camera = new FreeCamera("camera", new Vector3(0, 5, -10), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvasRef.current, true);

      // Light
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);

      // Ground
      MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

      // Render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      // Resize
      window.addEventListener("resize", () => {
        engine.resize();
      });
    }
  }, [scene, engine, canvasRef]);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MeshRenderer />
      {/* Ici, vous pouvez ajouter d'autres éléments UI ou d'autres composants Babylon. */}
    </div>
  );
};

export default BabylonWrapper;
