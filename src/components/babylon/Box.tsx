import {
  Color3,
  FresnelParameters,
  Mesh,
  Vector3,
  Animation,
  BezierCurveEase,
  DynamicTexture,
} from "@babylonjs/core";
import { useEffect, useRef, useState } from "react";
import { useClick } from "react-babylonjs";
import { RouterOutputs } from "~/utils/api";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const CustomizedBox = (props: {
  name: string;
  position: Vector3;
  onBoxClick: (position: Vector3) => void;
  data: PostWithUser;
  shouldDespawn?: boolean;
  onAnimationEnd?: () => void;
}) => {
  const boxRef = useRef<Mesh | null>(null);
  const [clicked, setClicked] = useState(false);

  const easing = new BezierCurveEase(0.4, 0.0, 0.2, 1.0);

  const handleBoxClick = () => {
    setClicked((clicked) => !clicked);
    props.onBoxClick(boxRef.current?.position || Vector3.Zero());
  };

  useClick(handleBoxClick, boxRef);

  // Animation logic for spawning the box
  useEffect(() => {
    if (boxRef.current) {
      Animation.CreateAndStartAnimation(
        "box-appear",
        boxRef.current,
        "scaling",
        60,
        120,
        Vector3.Zero(),
        Vector3.One(),
        Animation.ANIMATIONLOOPMODE_CONSTANT,
        easing,
      );
      setTimeout(() => {
        props.onAnimationEnd?.();
      }, 1200);
    }
  }, []); // Empty dependency array to ensure it runs only once, on mount

  // Animation logic for despawning the box
  useEffect(() => {
    if (props.shouldDespawn && boxRef.current) {
      Animation.CreateAndStartAnimation(
        "box-disappear",
        boxRef.current,
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
        boxRef.current?.dispose();
      }, 120);
    }
  }, [props.shouldDespawn]);

  return (
    <box name={props.name} size={2} position={props.position} ref={boxRef}>
      <BoxMaterial data={props.data} />
    </box>
  );
};

export const BoxMaterial = (props: { data: PostWithUser }) => {
  const textureToUse = BoxTexture(props.data.post.content);
  return (
    <pbrMaterial
      name={`box-material`}
      albedoTexture={textureToUse}
      emissiveColor={Color3.Blue()}
      useAlphaFromAlbedoTexture
      emissiveIntensity={0.1}
      metallic={0.9}
      lightmapTexture={textureToUse}
    ></pbrMaterial>
  );
};

export const BoxTexture = (text: string) => {
  const textureToUse = new DynamicTexture("dynamic", {
    width: 512,
    height: 512,
  });
  setTextToTexture(text, textureToUse);

  return textureToUse;
};

const setTextToTexture = (text: string, texture: DynamicTexture) => {
  // Split the post into lines considering whitespaces within leniency range
  const lines = [];
  let i = 0;
  while (i < text.length) {
    // If we're close enough to the end to not need to check for a whitespace
    if (i + 15 >= text.length) {
      lines.push(text.substring(i));
      break;
    }

    let end = i + 15;
    let hasWhitespace = false;

    // Look ahead within leniency range for a whitespace
    for (let j = i + 15; j > i; j--) {
      if (text[j] === " ") {
        end = j;
        hasWhitespace = true;
        break;
      }
    }

    lines.push(text.substring(i, end));

    // Move i past the segment we just added. If we broke on a whitespace, move past that as well.
    i = hasWhitespace ? end + 1 : end;
  }

  // Define a starting vertical position and an interval between each line
  const startY = 60;
  const intervalY = 50;

  lines.forEach((line, index) => {
    // Pick a random color (range of purple)
    texture.drawText(
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
};
