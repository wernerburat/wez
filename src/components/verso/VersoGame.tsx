import {
  FollowCamera,
  SceneLoader,
  type Mesh,
  StandardMaterial,
  PhysicsAggregate,
  PhysicsShapeType,
  Vector3,
  PhysicsShape,
  BoundingInfo,
  PhysicsShapeMesh,
  PhysicsShapeConvexHull,
  TransformNode,
} from "@babylonjs/core";
import useMeshBuilder from "../wezbabylon/hook/useMeshBuilder";
import { useVehicleControls } from "./hooks/useVehicleControls";
import { useBabylon } from "../wezbabylon/context/BabylonContext";
import { useEffect, useRef } from "react";
import "@babylonjs/loaders/glTF";
import useInputManager from "./hooks/useInputManager";
import { VehicleAction } from "./hooks/adapters/KeyboardToVehicleAdapter";
import Ground from "./components/Ground";
import Vehicle from "./components/Vehicle";

function VersoGame() {
  const { createBox, createGround } = useMeshBuilder();
  const { scene, engine } = useBabylon();

  return <InputViewer />;
}

export default VersoGame;

const InputViewer = () => {
  const { scene } = useBabylon();
  const { getActions } = useInputManager();

  return (
    <>
      <Ground />
      <Vehicle />
      <div className="w-100 h-100 pointer-events-none absolute m-10 overflow-hidden bg-slate-500">
        {getActions().includes(VehicleAction.TURN_RIGHT) && <div>Right</div>}
        {getActions().includes(VehicleAction.TURN_LEFT) && <div>Left</div>}
        {getActions().includes(VehicleAction.ACCELERATE) && (
          <div>Accelerate</div>
        )}
        {getActions().includes(VehicleAction.BRAKE) && <div>Brake</div>}
      </div>
    </>
  );
};
