import { type Mesh } from "@babylonjs/core";
import { useMotionDynamics } from "./useMotionDynamics";

export function useVehiclePhysics(vehicleMesh?: Mesh) {
  const motionDynamics = useMotionDynamics(vehicleMesh);
}
