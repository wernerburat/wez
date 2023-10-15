import { Matrix, Vector3, type Mesh, Axis } from "@babylonjs/core";
import { useCallback, useEffect, useState } from "react";
import useMeshBuilder from "../hook/useMeshBuilder";
import { useBabylon } from "../context/BabylonContext";

const CONSTANTS = {
  ACCELERATION: 0.005,
  DECELERATION: 0.007,
  FRICTION: 0.01,
  MAX_SPEED: 1,
  MAX_STEERING_ANGLE: 0.02,
  DEFAULT_DIRECTION: new Vector3(0, 0, 1),
};

export function useCar() {
  const { createPolyhedron } = useMeshBuilder();
  const { scene } = useBabylon();

  const [car, setCar] = useState<Mesh | undefined>();
  const [speed, setSpeed] = useState(0);
  const [frontDirection, setFrontDirection] = useState(
    CONSTANTS.DEFAULT_DIRECTION,
  );
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  // SETUP: Create and initialize the car.
  const initializeCar = useCallback(() => {
    const newCar = createPolyhedron("car", {
      size: 1,
      sizeX: 1,
      sizeY: 2,
      sizeZ: 4,
    });
    newCar.rotation.z = Math.PI / 2;
    setCar(newCar);
  }, [createPolyhedron]);

  // Adjust the steering direction based on the input
  const adjustFrontDirection = useCallback((adjustment: number) => {
    setFrontDirection((prevDirection) => {
      // Ensure the adjustment doesn't exceed the max steering angle
      const clampedAdjustment =
        Math.sign(adjustment) *
        Math.min(Math.abs(adjustment), CONSTANTS.MAX_STEERING_ANGLE);

      const rotationMatrix = new Matrix();
      Matrix.RotationAxisToRef(Axis.Y, clampedAdjustment, rotationMatrix);
      return Vector3.TransformNormal(prevDirection, rotationMatrix);
    });
  }, []);

  // CONTROLS: Register controls to handle user input.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((keys) => ({ ...keys, [event.key]: true }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((keys) => ({ ...keys, [event.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // UPDATE: Update the car's movement and rotation.
  const updateCar = useCallback(() => {
    if (!car) return;

    const moveVector = frontDirection.scale(speed);
    car.moveWithCollisions(moveVector);

    const angle = Math.acos(
      Vector3.Dot(
        frontDirection.normalize(),
        CONSTANTS.DEFAULT_DIRECTION.normalize(),
      ),
    );
    car.rotation.y = frontDirection.x < 0 ? -angle : angle;

    // Controls logic
    if (pressedKeys.w) {
      setSpeed((speed) =>
        Math.min(CONSTANTS.MAX_SPEED, speed + CONSTANTS.ACCELERATION),
      );
    }
    if (pressedKeys.s) {
      setSpeed((speed) =>
        Math.max(-CONSTANTS.MAX_SPEED, speed - CONSTANTS.DECELERATION),
      );
    }
    if (pressedKeys.a) {
      adjustFrontDirection(-CONSTANTS.MAX_STEERING_ANGLE);
    }
    if (pressedKeys.d) {
      adjustFrontDirection(CONSTANTS.MAX_STEERING_ANGLE);
    }
    if (!pressedKeys.w && !pressedKeys.s) {
      if (speed > 0) {
        setSpeed((speed) => Math.max(0, speed - CONSTANTS.FRICTION));
      } else if (speed < 0) {
        setSpeed((speed) => Math.min(0, speed + CONSTANTS.FRICTION));
      }
    }
  }, [adjustFrontDirection, car, frontDirection, pressedKeys, speed]);

  // Initialize the car and controls.
  useEffect(() => {
    if (scene && !car) initializeCar();

    if (scene) {
      scene.registerBeforeRender(updateCar);
      return () => scene.unregisterBeforeRender(updateCar);
    }
  }, [scene, car, initializeCar, updateCar]);

  return {
    car,
    setSpeed,
  } as const;
}
