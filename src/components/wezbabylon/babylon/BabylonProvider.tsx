import React from "react";
import { BabylonContext } from "../context/BabylonContext";
import { useBabylonEngineInitialization } from "../hook/useBabylonEngineInitialization";

interface Props {
  children: React.ReactNode;
}
function BabylonProvider({ children }: Props): React.ReactNode {
  const { canvasRef, engine, scene, loading } =
    useBabylonEngineInitialization();

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
