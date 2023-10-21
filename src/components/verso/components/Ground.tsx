import {
  PhysicsAggregate,
  PhysicsShapeType,
  StandardMaterial,
} from "@babylonjs/core";
import { useEffect } from "react";
import { useBabylon } from "~/components/wezbabylon/context/BabylonContext";
import useMeshBuilder from "~/components/wezbabylon/hook/useMeshBuilder";

function Ground() {
  const { scene } = useBabylon();
  const { createGround } = useMeshBuilder();

  useEffect(() => {
    if (scene) {
      const ground = createGround("ground", {
        width: 100,
        height: 100,
        subdivisions: 50,
      });
      const groundMaterial = new StandardMaterial("groundMat", scene);
      groundMaterial.wireframe = true;
      ground.material = groundMaterial;

      new PhysicsAggregate(
        ground,
        PhysicsShapeType.BOX,
        { mass: 0, restitution: 0 },
        scene,
      );
    }
  }, [scene]);

  return <></>;
}

export default Ground;
