import { useState } from "react";
import { type PostProcess } from "@babylonjs/core";
import { usePostProcesses, shaders } from "../context/PostProcessContext";

type PostProcessProps = {
  postProcess: PostProcess;
};

const PostProcessComponent = ({ postProcess }: PostProcessProps) => {
  const [active, setActive] = useState(false);
  const { updatePostProcess, attachPostProcess, detachPostProcess } =
    usePostProcesses();

  const shader = shaders.find((s) => s.name === postProcess.name);

  const handleParameterChange = (paramName: string, value: number) => {
    // TODO: You can update the postProcess with the new parameter value here
    console.log(`Updated parameter ${paramName} to value ${value}`);
    updatePostProcess(postProcess, paramName, value);
  };

  return (
    <>
      <div className="flex flex-row">
        <input
          type="checkbox"
          className="mr-2"
          onChange={(e) => {
            if (e.target.checked) {
              attachPostProcess(postProcess);
            } else {
              detachPostProcess(postProcess);
            }
            setActive(e.target.checked);
          }}
          checked={active}
          name={postProcess.name}
          id={postProcess.name}
          value={postProcess.name}
        ></input>
        <label htmlFor={postProcess.name}>{postProcess.name}</label>
      </div>
      {/* {parameters} */}
      {/* Display parameters if they exist for the shader */}
      {shader && Object.keys(shader.parameters).length > 0 && (
        <div className="parameters">
          <h3>Parameters:</h3>
          {Object.entries(shader.parameters).map(([paramName, paramType]) => (
            <div key={paramName} className="parameter">
              <label htmlFor={`${postProcess.name}-${paramName}`}>
                {paramName}
              </label>
              {paramType === "float" && (
                <input
                  type="range"
                  min="0"
                  max="2000" // Adjust min and max values as per your needs
                  step="0.01"
                  id={`${postProcess.name}-${paramName}`}
                  onChange={(e) =>
                    handleParameterChange(paramName, Number(e.target.value))
                  }
                />
              )}
              {/* Add more controls for other paramTypes if needed in the future */}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PostProcessComponent;
