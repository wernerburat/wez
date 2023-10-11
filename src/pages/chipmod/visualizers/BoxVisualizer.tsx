import { DynamicTexture, Mesh, Vector3 } from "@babylonjs/core";
import { useRef, useState } from "react";
import { useBeatEasing } from "../useBeatEasing";
import { useScene } from "react-babylonjs";
import useBeat from "~/components/chipmod/useBeat";
import { VisualizerProps } from "./VisType";

export const BoxVisualizer = ({ ...props }: VisualizerProps) => {
  // Scene setup:
  const scene = useScene();

  // Visualizer setup:
  const boxRef = useRef<Mesh | null>(null);
  const [texture, setTexture] = useState(new DynamicTexture("dt", 512, scene));

  // Easing setup:
  const [easingValue, animateBeat] = useBeatEasing(
    props.soundRef,
    "easeOutQuad",
    500,
  );

  const drawText = (text: string, x: number, y: number) => {
    texture.drawText(
      text,
      x,
      y,
      "bold 24px monospace",
      "white",
      "transparent",
      false,
      false,
    );
  };

  useBeat(props.bpm, 20, animateBeat);

  return (
    <box
      ref={boxRef}
      name="box-1"
      size={2}
      position={new Vector3(0, 0, 0)}
    ></box>
  );
};

export default BoxVisualizer;
