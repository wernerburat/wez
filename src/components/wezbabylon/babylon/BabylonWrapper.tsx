import React from "react";
import { useBabylon } from "../context/BabylonContext";
import VersoGame from "../../verso/VersoGame";

const BabylonWrapper: React.FC = () => {
  const { scene, engine } = useBabylon();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {scene && engine && (
        <>
          <div className="pointer-events-none absolute flex w-full justify-center"></div>
          <VersoGame />
        </>
      )}
    </div>
  );
};

export default BabylonWrapper;
