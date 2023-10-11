import { type Engine, Scene, type WebGPUEngine } from "@babylonjs/core";
import { useState, useEffect } from "react";

const useBabylonScene = (engine: Engine | WebGPUEngine | null) => {
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    if (engine) {
      const newScene = new Scene(engine);
      setScene(newScene);

      return () => {
        newScene.dispose();
      };
    }
  }, [engine]);

  return scene;
};

export default useBabylonScene;
