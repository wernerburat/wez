import React, { useRef, useState, useEffect } from "react";
import { useBeforeRender } from "react-babylonjs";
import {
  Vector3,
  ArcRotateCamera,
  Scene,
  Animation,
  BezierCurveEase,
  Mesh,
} from "@babylonjs/core";
import { CustomizedBox } from "./Box"; // Assuming you'll separate Box to its own module
import { moveActiveCamera, moveMesh } from "./Utils"; // Your moveActiveCamera utility

import type { RouterOutputs } from "~/utils/api";

type PostsWithUser = RouterOutputs["posts"]["getAll"];
type GeometryProps = {
  data: PostsWithUser;
  loading: boolean;
};

const calculateCircularPositions = (shapesLength: number) => {
  console.log(shapesLength);
  const positions: Vector3[] = [];

  const radius = shapesLength * 1.5;
  const angle = (2 * Math.PI) / shapesLength;

  for (let i = 0; i < shapesLength; i++) {
    const x = radius * Math.cos(i * angle);
    const z = radius * Math.sin(i * angle);
    positions.push(new Vector3(x, 0, z));
  }

  return positions;
};

export const Geometry = (props: GeometryProps) => {
  const prevDataRef = useRef<PostsWithUser | null>(null);
  const [shapes, setShapes] = useState<JSX.Element[]>([]);
  const activeCameraRef = useRef<ArcRotateCamera | null>(null);
  const activeSceneRef = useRef<Scene | null>(null);
  const [counter, setCounter] = useState(0);
  const easing = new BezierCurveEase(0.4, 0.0, 0.2, 1.0);

  const [boxesScaledUp, setBoxesScaledUp] = useState<number>(0);

  const handleBoxScaledUp = () => {
    setBoxesScaledUp((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      !props.loading &&
      JSON.stringify(props.data) !== JSON.stringify(prevDataRef.current)
    ) {
      const shapes = props.data.map((shape, index) => (
        <CustomizedBox
          key={shape.post.id}
          name={`box-${index}`}
          position={new Vector3(0, 0, 0)}
          onBoxClick={handleBoxClick}
          onAnimationEnd={handleBoxScaledUp} // Add this line
          data={shape}
          shouldDespawn={counter > 0}
        />
      ));

      setShapes(shapes);
      prevDataRef.current = props.data;
    }
  }, [props.data]);

  useEffect(() => {
    if (boxesScaledUp === shapes.length) {
      handleBecomeCircle();
    }
  }, [boxesScaledUp]);

  useBeforeRender((scene) => {
    if (
      !activeCameraRef.current &&
      scene.activeCamera instanceof ArcRotateCamera
    ) {
      activeCameraRef.current = scene.activeCamera;
    }

    if (!activeSceneRef.current) {
      activeSceneRef.current = scene;
    }
  });

  const handleBoxClick = (position: Vector3) => {
    if (activeCameraRef.current) {
      moveActiveCamera(activeCameraRef.current, position);
      setCounter((counter) => counter + 1);
    }
  };

  const handleBecomeCircle = () => {
    if (activeCameraRef.current && activeSceneRef.current) {
      const meshes = activeSceneRef.current.getActiveMeshes();
      const positions: Vector3[] = calculateCircularPositions(meshes.length);
      if (positions.length === meshes.length) {
        for (let i = 0; i < meshes.data.length; i++) {
          if (meshes.data[i]) {
            const mesh = meshes.data[i];
            const position = positions[i];
            if (position && mesh) {
              moveMesh(mesh, position);
            }
          }
        }
      }
    }
  };

  const removeBox = (mesh: Mesh) => {
    if (activeSceneRef.current) {
      Animation.CreateAndStartAnimation(
        "box-disappear",
        mesh,
        "scaling",
        60,
        120,
        Vector3.One(),
        Vector3.Zero(),
        Animation.ANIMATIONLOOPMODE_CONSTANT,
        easing,
      );
      // Dispose
      setTimeout(() => {
        mesh?.dispose();
      }, 1200);
    }
  };

  return <>{shapes}</>;
};
