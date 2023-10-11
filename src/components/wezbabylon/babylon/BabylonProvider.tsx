import React from "react";
import { BabylonContext } from "../context/BabylonContext";
import { useBabylonEngine } from "../hook/useBabylonEngine";
import useBabylonScene from "../hook/useBabylonScene";

interface Props {
  children: React.ReactNode;
}
function BabylonProvider({ children }: Props): React.ReactNode {
  const { canvasRef, engine } = useBabylonEngine();
  const scene = useBabylonScene(engine);

  return (
    <BabylonContext.Provider value={{ engine, scene, canvasRef }}>
      <canvas
        ref={canvasRef}
        id="babylonJS"
        className="absolute h-full w-full"
      />
      {children}
    </BabylonContext.Provider>
  );
}

export default BabylonProvider;
