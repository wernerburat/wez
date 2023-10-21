import { Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";
import useInputManager from "./useInputManager";
import { useEffect } from "react";
import { VehicleAction } from "./adapters/KeyboardToVehicleAdapter";

export function useVehicleControls(vehicleMesh?: Mesh) {
  const { getActions, inputType } = useInputManager();

  useEffect(() => {
    if (!vehicleMesh) return; // Exit if the vehicleMesh is not available

    const localForward = new Vector3(0, 0, 1);
    vehicleMesh.computeWorldMatrix(true);
    const worldForward = Vector3.TransformNormal(
      localForward,
      vehicleMesh.getWorldMatrix(),
    );
    worldForward.normalize();
    const forceMagnitude = 10;
    const forceVector = worldForward.scale(forceMagnitude);

    const handleControlChange = (controlActions: VehicleAction[]) => {
      if (controlActions.includes(VehicleAction.ACCELERATE)) {
      }

      vehicleMesh.physicsBody?.applyForce(
        forceVector,
        vehicleMesh.getAbsolutePosition(),
      );
    };

    const handleActions = () => {
      const actions = getActions();

      if (actions) {
        handleControlChange(actions);
      }
    };

    handleActions();
  }, [getActions, vehicleMesh]);
}
