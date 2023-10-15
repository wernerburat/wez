import React, { useCallback, useEffect } from "react";
import { useBabylon } from "../context/BabylonContext";
import {
  ArcRotateCamera,
  type Scene,
  Vector3,
  StandardMaterial,
  FollowCamera,
} from "@babylonjs/core";
import { useCar } from "./useCar";
import useMeshBuilder from "../hook/useMeshBuilder";
const RacerScene: React.FC = () => {
  const { scene } = useBabylon();
  const { car } = useCar();
  const { createGround } = useMeshBuilder();

  const createCamera = useCallback((scene: Scene) => {
    const camera = new FollowCamera(
      "FollowCam",
      new Vector3(0, 10, -10),
      scene,
    );
    camera.radius = 25; // The distance to the target object.
    camera.heightOffset = 10; // The height above the target at which the camera should be placed.
    camera.rotationOffset = 180; // The viewing angle.
    camera.cameraAcceleration = 0.05; // How fast the camera moves to the target position.
    camera.maxCameraSpeed = 10; // The speed at max acceleration.
    return camera;
  }, []);

  const createNewGround = useCallback(
    (scene: Scene) => {
      const ground = createGround("ground", {
        width: 100,
        height: 200,
        subdivisionsX: 100,
        subdivisionsY: 200,
      });
      ground.position.y = -1;
      const material = new StandardMaterial("groundMat", scene);
      ground.material = material;

      material.wireframe = true;
      return ground;
    },
    [createGround],
  );

  useEffect(() => {
    if (scene && car) {
      scene.clearColor.set(0, 0.05, 0.15, 1);
      const ground = createNewGround(scene);

      // Add camera
      const camera = createCamera(scene);
      camera.lockedTarget = car;

      // Cleanup
      return () => {
        ground.dispose();
      };
    }
  }, [scene, createCamera, createNewGround, car]);

  return <></>;
};

export default RacerScene;
