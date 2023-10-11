import React, { useCallback, useEffect, useRef, useState } from "react";
import { DynamicTexture, StandardMaterial, type Mesh } from "@babylonjs/core";
import { useBabylon } from "./context/BabylonContext";
import { type TextEntry } from "./type/TextTypes";
import useMeshBuilder from "./hook/useMeshBuilder";
import useMaterialCache from "./hook/useMaterialCache";

type BabylonBox = Mesh;

const TextBox: React.FC = () => {
  const { scene, loading } = useBabylon();
  const [textEntries, setTextEntries] = useState<TextEntry[]>([]);
  const { createBox } = useMeshBuilder();
  const boxesMapRef = useRef(new Map<number, BabylonBox>());
  const { getMaterialForText } = useMaterialCache();

  // Material cache
  const sharedMaterialRef = useRef<StandardMaterial | null>(null);
  if (!sharedMaterialRef.current && scene) {
    sharedMaterialRef.current = new StandardMaterial("SharedMat", scene);
  }
  const materialCacheRef = useRef(new Map<string, StandardMaterial>());

  // Texture cache
  const textureCacheRef = useRef(new Map<string, DynamicTexture>());

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
        let material;

        // Check if material for this character exists in the cache
        if (materialCacheRef.current.has(text)) {
          material = materialCacheRef.current.get(text);
        } else {
          // If not, create it and store in cache
          const texture = new DynamicTexture(
            `texture-${text}`,
            512,
            scene,
            true,
          );
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

          material = new StandardMaterial(`material-${text}`, scene);
          material.diffuseTexture = texture;

          materialCacheRef.current.set(text, material);
          textureCacheRef.current.set(text, texture); // Store the texture in its cache as well if you might need it later
        }

        // Assign the material to the box
        if (material) box.material = material;
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
