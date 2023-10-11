import React from "react";
import { BabylonContext } from "../context/BabylonContext";
import { useBabylonEngine } from "../hook/useBabylonEngine";

interface Props {
  children: React.ReactNode;
}
function BabylonProvider({ children }: Props): React.ReactNode {
  const { canvasRef, engine, scene, loading } = useBabylonEngine();

  return (
    <BabylonContext.Provider value={{ engine, scene, canvasRef, loading }}>
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
