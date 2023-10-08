import React from "react";
import { Engine, Scene } from "react-babylonjs";
import { Camera } from "~/components/babylon/Camera";
import { Geometry } from "~/components/babylon/Geometry";
import { api } from "~/utils/api";

export default function RenderPage() {
  return <SceneWithSpinningBoxes />;
}

export const SceneWithSpinningBoxes = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  return (
    <Engine adaptToDeviceRatio antialias canvasId="babylon-canvas">
      <Scene>
        <Camera />
        <Geometry data={data!} loading={postsLoading} />
      </Scene>
    </Engine>
  );
};
