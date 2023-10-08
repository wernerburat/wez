import React, { useEffect, useRef, useState } from "react";
import {
  Engine,
  FiberArcRotateCamera,
  Scene,
  useBeforeRender,
  useClick,
  useHover,
} from "react-babylonjs";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { DynamicTexture } from "@babylonjs/core";

import type { ArcRotateCamera, Camera, TransformNode } from "@babylonjs/core";
import { Animation } from "@babylonjs/core/Animations";

const StartScale = new Vector3(0, 0, 0);
const DefaultScale = new Vector3(1, 1, 1);

type PostsWithUser = RouterOutputs["posts"]["getAll"];
type PostWithUser = RouterOutputs["posts"]["getAll"][number];
type SpinningBoxProps = {
  name: string;
  position: Vector3;
  hoveredColor: Color3;
  color: Color3;
  data: PostWithUser;
};
const SpinningBox = (props: SpinningBoxProps) => {
  // access Babylon scene objects with same React hook as regular DOM elements
  const boxRef = useRef<Mesh>(null);
  const prevDataRef = useRef<PostWithUser | null>(null);

  // Click:
  const [clicked, setClicked] = useState(false);
  useClick(() => setClicked((clicked) => !clicked), boxRef);

  const [boxScale, setBoxScale] = useState<Vector3>(StartScale);

  const [hovered, setHovered] = useState(false);
  useHover(
    () => setHovered(true),
    () => setHovered(false),
    boxRef,
  );

  const textureToUse = new DynamicTexture(
    "dynamic",
    {
      width: 512,
      height: 512,
    },
    boxRef.current?.getScene(),
    false,
    DynamicTexture.TRILINEAR_SAMPLINGMODE,
  );

  const post = props.data.post.content;

  // Split the post into lines considering whitespaces within leniency range
  const lines = [];
  let i = 0;
  while (i < post.length) {
    // If we're close enough to the end to not need to check for a whitespace
    if (i + 15 >= post.length) {
      lines.push(post.substring(i));
      break;
    }

    let end = i + 15;
    let hasWhitespace = false;

    // Look ahead within leniency range for a whitespace
    for (let j = i + 15; j > i; j--) {
      if (post[j] === " ") {
        end = j;
        hasWhitespace = true;
        break;
      }
    }

    lines.push(post.substring(i, end));

    // Move i past the segment we just added. If we broke on a whitespace, move past that as well.
    i = hasWhitespace ? end + 1 : end;
  }

  // Define a starting vertical position and an interval between each line
  const startY = 60;
  const intervalY = 50;

  lines.forEach((line, index) => {
    // Pick a random color (range of purple)
    textureToUse.drawText(
      line,
      30, // Starting X position (you can adjust as needed)
      startY + index * intervalY, // Adjusting Y position for each line
      "48px Lucida Console",
      "white",
      "transparent",
      true,
      true,
    );
  });

  const [enableAnim, setEnableAnim] = useState(false);
  const [cameraLook, setCameraLook] = useState<Vector3 | null>(null);

  useBeforeRender((scene) => {
    if (clicked && enableAnim) {
      console.log("on y va");
      const camera = boxRef.current?.getScene().activeCamera as ArcRotateCamera;
      console.log(camera);
      let deltaX = Math.abs(cameraLook!.x - camera.target.x);
      let deltaY = Math.abs(cameraLook!.y - camera.target.y);
      let deltaZ = Math.abs(cameraLook!.z - camera.target.z);

      if (deltaX > 0.01 || deltaY > 0.01 || deltaZ > 0.01) {
        camera.setTarget(Vector3.Lerp(camera.target, cameraLook!, 0.05));
      } else if (camera.target !== cameraLook) {
        setEnableAnim(false);
      }
    }
  });

  useEffect(() => {
    // Check if the data is different than before
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(props.data)) {
      setTimeout(() => {
        animateBoxScale(new Vector3(0, 0, 0), DefaultScale);
      }, 300);

      // Target the box on camera:
      setCameraLook(boxRef.current!.position);
      setEnableAnim(true);
    }
    // Update the ref to the current data for the next comparison
    prevDataRef.current = props.data;
  }, [props.data]);

  // Animation
  const animateBoxScale = (startScale: Vector3, endScale: Vector3) => {
    const animationBox = new Animation(
      "boxScaleAnimation",
      "scaling",
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const keyFrames = [];

    keyFrames.push({
      frame: 0,
      value: startScale,
    });
    // At the animation end
    keyFrames.push({
      frame: 30,
      value: endScale,
    });

    animationBox.setKeys(keyFrames);
    boxRef.current?.animations.push(animationBox);

    boxRef.current
      ?.getScene()
      .beginAnimation(boxRef.current, 0, 30, false, 1, () => {
        // Callback after the animation finishes
        setBoxScale(endScale); // Ensure the final state is set after animation completes
      });
  };

  // This will rotate the box on every Babylon frame based on sin of time
  const rpm = 5;
  useBeforeRender((scene) => {
    if (boxRef.current) {
      // Delta time smoothes the animation.
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();
      boxRef.current.rotation.y +=
        ((rpm / 60) * Math.PI * 2 * deltaTimeInMillis) / 1000;
      boxRef.current.rotation.x +=
        ((rpm / 60) * Math.PI * 2 * deltaTimeInMillis) / 1000;
    }
  });

  textureToUse.getAlphaFromRGB = true;
  textureToUse.update();

  return (
    <box
      name={props.name}
      ref={boxRef}
      size={3}
      position={props.position}
      scaling={boxScale}
    >
      <pbrMaterial
        name={`${props.name}-mat`}
        albedoTexture={textureToUse}
        albedoColor={props.color}
        emissiveColor={hovered ? props.hoveredColor : Color3.Blue()}
        useAlphaFromAlbedoTexture
        emissiveIntensity={0.1}
        metallic={0.9}
        lightmapTexture={textureToUse}
      ></pbrMaterial>
    </box>
  );
};

const CIRCLE_RADIUS = 5;
type SpinningGroupProps = {
  data: PostsWithUser;
  postsLoading: boolean;
};
const SpinningGroup = (props: SpinningGroupProps) => {
  const boxGroupRef = useRef<TransformNode>(null);

  const calculateCircularPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    return new Vector3(
      CIRCLE_RADIUS * Math.sin(angle),
      0,
      CIRCLE_RADIUS * Math.cos(angle),
    );
  };

  useBeforeRender((scene) => {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();
    boxGroupRef.current?.rotate(Vector3.Up(), 0.0001 * deltaTimeInMillis);
    boxGroupRef.current?.rotate(Vector3.Right(), 0.0001 * deltaTimeInMillis);
  });

  return (
    <transformNode name="cubeGroup" ref={boxGroupRef}>
      {props.postsLoading && <box name="box" size={2} />}
      {!props.postsLoading &&
        props.data?.map((post, index) => (
          <SpinningBox
            key={`${post.post.id}`}
            name={`${post.post.id}`}
            position={calculateCircularPosition(index, props.data.length)}
            color={Color3.FromHexString("#C8F4F9")}
            hoveredColor={Color3.FromHexString("#3CACAE")}
            data={post}
          />
        ))}
    </transformNode>
  );
};

const CameraSetup = () => {
  const cameraRef = useRef<ArcRotateCamera>(null);

  useBeforeRender((scene) => {
    // if (cameraRef.current && scene) {
    //   const deltaTimeInMillis = scene.getEngine().getDeltaTime();
    //   const length = scene.getActiveMeshes()?.length;
    //   // Animate the new radius if length changes, using deltaTime to smooth it
    //   if (length > 0) {
    //     const newRadius = CIRCLE_RADIUS * length * 1.2;
    //     cameraRef.current.radius = Math.max(
    //       cameraRef.current.radius +
    //         ((newRadius - cameraRef.current.radius) * deltaTimeInMillis) / 1000,
    //       5,
    //     );
    //   }
    // }
  });

  return (
    <arcRotateCamera
      name="camera1"
      ref={cameraRef}
      alpha={Math.PI / 2}
      beta={Math.PI / (2 + 0.1)}
      radius={5}
      target={Vector3.Zero()}
    />
  );
};

export const SceneWithSpinningBoxes = () => {
  const [postsLength, setPostsLength] = useState(1);
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setPostsLength(data.length);
    }
  }, [data]);

  return (
    <Engine adaptToDeviceRatio antialias canvasId="babylon-canvas">
      <Scene>
        <CameraSetup />
        <hemisphericLight
          name="light1"
          intensity={0.8}
          direction={Vector3.Up()}
        />
        <SpinningGroup data={data!} postsLoading={postsLoading} />
      </Scene>
    </Engine>
  );
};

export default function RenderPage() {
  return <SceneWithSpinningBoxes />;
}
