import useMeshBuilder from "./hook/useMeshBuilder";
import { useBabylon } from "./context/BabylonContext";
import { useEffect } from "react";

const MeshRenderer: React.FC = () => {
  const { createBox } = useMeshBuilder();
  const { engine, scene } = useBabylon();

  useEffect(() => {
    if (engine && scene) {
      const box = createBox("box", { size: 2 });
      console.log(box);
      box.position.y = 1;
    }
  }, [engine, scene, createBox]);

  return null; // ou retournez d'autres éléments JSX si nécessaire.
};

export default MeshRenderer;
