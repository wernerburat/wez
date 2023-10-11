import { useRef, useCallback } from "react";
import { type StandardMaterial } from "@babylonjs/core";
import { type CreateBoxOptions } from "../type/MeshOptionsTypes";
import { type BabylonBox } from "../type/MeshTypes";
import { type TextEntry } from "../type/TextTypes";
import { useBabylonEngine } from "./useBabylonEngine";

type MeshCreator = (name: string, options?: CreateBoxOptions) => BabylonBox;

function useMeshManager(
  getMaterialForText: (text: string) => StandardMaterial | undefined,
  createMesh: MeshCreator,
) {
  const meshesMapRef = useRef(new Map<number, BabylonBox>());
  const { scene } = useBabylonEngine();

  const updateMeshes = useCallback(
    (textEntries: TextEntry[]) => {
      if (!scene) return;

      meshesMapRef.current.forEach((mesh, id) => {
        if (!textEntries.find((entry) => entry.id === id)) {
          mesh.dispose();
          meshesMapRef.current.delete(id);
        }
      });

      textEntries.forEach((entry, index) => {
        if (!meshesMapRef.current.has(entry.id)) {
          const mesh = createMesh(`mesh-${entry.id}`);
          meshesMapRef.current.set(entry.id, mesh);
        }
        const mesh = meshesMapRef.current.get(entry.id);
        if (!mesh) return;
        mesh.position.x = index;
        const material = getMaterialForText(entry.char);
        if (material) mesh.material = material;
      });
    },
    [scene, createMesh, getMaterialForText],
  );

  return { updateMeshes };
}

export default useMeshManager;
