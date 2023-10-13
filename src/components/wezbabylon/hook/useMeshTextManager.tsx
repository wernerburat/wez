import { useRef, useCallback } from "react";
import { type StandardMaterial } from "@babylonjs/core";
import { type CreateBoxOptions } from "../type/MeshOptionsTypes";
import { type BabylonBox } from "../type/MeshTypes";
import { type TextEntry } from "../type/TextTypes";
import { useBabylon } from "../context/BabylonContext";

type MeshCreator = (name: string, options?: CreateBoxOptions) => BabylonBox;

function useMeshTextManager(
  getMaterialForText: (text: string) => StandardMaterial | undefined,
  createMesh: MeshCreator,
) {
  const meshesMapRef = useRef(new Map<number, BabylonBox>());
  const { scene } = useBabylon();

  const disposeUnusedMeshes = useCallback((textEntries: TextEntry[]) => {
    meshesMapRef.current.forEach((mesh, id) => {
      if (!textEntries.find((entry) => entry.id === id)) {
        mesh.dispose();
        meshesMapRef.current.delete(id);
      }
    });
  }, []);

  const createOrUpdateMeshes = useCallback(
    (textEntries: TextEntry[]) => {
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
    [createMesh, getMaterialForText],
  );

  const synchronizeMeshesWithText = useCallback(
    (textEntries: TextEntry[]) => {
      if (!scene) return;

      disposeUnusedMeshes(textEntries);
      createOrUpdateMeshes(textEntries);
    },
    [scene, disposeUnusedMeshes, createOrUpdateMeshes],
  );

  return { synchronizeMeshesWithText };
}

export default useMeshTextManager;
