import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBabylon } from "./context/BabylonContext";
import useMeshBuilder from "./hook/useMeshBuilder";
import { DynamicTexture, StandardMaterial, type Mesh } from "@babylonjs/core";

type TextEntry = {
  id: number;
  char: string;
};

type BabylonBox = Mesh; // Replace with a specific BabylonJS type if available

const TextBox: React.FC = () => {
  const { scene, loading } = useBabylon();
  const [textEntries, setTextEntries] = useState<TextEntry[]>([]);
  const { createBox } = useMeshBuilder();
  const boxesMapRef = useRef(new Map<number, BabylonBox>());

  const textChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    const newEntries = newText.split("").map((char, index) => {
      const existingEntry = textEntries[index];
      const id = existingEntry ? existingEntry.id : Date.now() + index;
      return { id, char };
    });

    setTextEntries(newEntries);
  };

  const addTextToBox = useCallback(
    (box: BabylonBox, text: string) => {
      if (scene) {
        const texture = new DynamicTexture("dynamic texture", 512, scene, true);
        texture.drawText(
          text,
          null,
          400,
          "bold 72px Arial",
          "white",
          "transparent",
          true,
          true,
        );
        const material = new StandardMaterial("Mat", scene);
        material.diffuseTexture = texture;
        box.material = material;
      }
    },
    [scene],
  );

  useEffect(() => {
    if (loading ?? !scene) return;

    boxesMapRef.current.forEach((box, id) => {
      if (!textEntries.find((entry) => entry.id === id)) {
        box.dispose();
        boxesMapRef.current.delete(id);
      }
    });

    textEntries.forEach((entry, index) => {
      if (!boxesMapRef.current.has(entry.id)) {
        const box = createBox(`box-${entry.id}`, { size: 1 });
        boxesMapRef.current.set(entry.id, box);
      }
      const box = boxesMapRef.current.get(entry.id);
      if (!box) return;
      box.position.x = index;
      addTextToBox(box, entry.char);
    });
  }, [createBox, textEntries, scene, loading, addTextToBox]);

  return (
    <div className="pointer-events-none absolute flex h-full w-full flex-row overflow-hidden">
      <div className="flex w-full items-end justify-end overflow-hidden">
        <input
          className="pointer-events-auto flex w-full justify-end bg-slate-700 p-2 font-mono text-lg font-bold text-slate-200 outline-none"
          onChange={textChange}
        ></input>
      </div>
    </div>
  );
};

export default TextBox;
