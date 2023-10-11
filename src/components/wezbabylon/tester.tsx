import React, { useEffect } from "react";
import { MeshBuilder, Vector3 } from "@babylonjs/core";
import { useBabylon } from "./context/BabylonContext";

const Tester = () => {
  const { scene, loading, canvasRef, engine } = useBabylon();

  useEffect(() => {
    if (loading) return;
    const box = MeshBuilder.CreateBox("box", {}, scene);
    box.position = new Vector3(0, 0, 0);
    console.log("box", box);
  }, [scene, loading, canvasRef, engine]);

  return <></>;
};

export default Tester;
