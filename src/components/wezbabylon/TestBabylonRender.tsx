import React, { useEffect } from "react";
import BabylonProvider from "./BabylonProvider";
import MeshRenderer from "./MeshRenderer"; // Composant enfant que nous allons créer.
import { useBabylon } from "./context/BabylonContext";
import {
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
} from "@babylonjs/core";

const TestBabylonRender: React.FC = () => {
  const { scene, engine, canvasRef } = useBabylon();

  useEffect(() => {
    if (scene && engine && canvasRef) {
      console.log(scene);
      // init scene:
      const camera = new FreeCamera("camera", new Vector3(0, 5, -10), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvasRef.current, true);
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;
      // init mesh:
      const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
      box.position.y = 1;

      // init render loop:
      engine.runRenderLoop(() => {
        scene.render();
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

export default TestBabylonRender;
