import { type PostProcess } from "@babylonjs/core";

type PostProcessProps = {
  postProcess: PostProcess;
  onParametersChange: (params: unknown) => void;
};

const PostProcessComponent = ({
  postProcess,
  onParametersChange,
}: PostProcessProps) => {
  return <div></div>;
};

export default PostProcessComponent;
