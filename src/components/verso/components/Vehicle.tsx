import {
  FollowCamera,
  SceneLoader,
  Vector3,
  PhysicsAggregate,
  PhysicsShapeMesh,
  type Mesh,
  type Scene,
} from "@babylonjs/core";
import { useEffect, useState } from "react";
import { useBabylon } from "~/components/wezbabylon/context/BabylonContext";
import { useVehicleControls } from "../hooks/useVehicleControls";

function Vehicle() {
  const { scene } = useBabylon();
  const [car, setCar] = useState<Mesh>();
  useVehicleControls(car);

  const loadCarMesh = (scene: Scene) => {
    let newCar: Mesh | null = null;
    let carShape = null;
    SceneLoader.ImportMesh("", "/verso/models/", "car.glb", scene, (meshes) => {
      newCar = meshes[1] as Mesh;
      newCar.rotate(new Vector3(0, 1, 0), Math.PI / 2);
      newCar.bakeCurrentTransformIntoVertices();
      carShape = new PhysicsShapeMesh(newCar, scene);
      newCar.position = new Vector3(0, 5, 0);

      if (newCar && carShape) {
        new PhysicsAggregate(
          newCar,
          carShape,
          { mass: 1, restitution: 0 },
          scene,
        );
      }
      setCar(newCar);
    });
  };

  useEffect(() => {
    if (scene && !car) {
      loadCarMesh(scene);
    } else if (car && scene?.activeCamera instanceof FollowCamera) {
      scene.activeCamera.lockedTarget = car;
      scene.activeCamera.radius = 10;
      scene.activeCamera.attachControl();
    }
  }, [scene, car]);

  return <></>;
}

export default Vehicle;
