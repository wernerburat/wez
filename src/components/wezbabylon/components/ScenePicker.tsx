import { useState } from "react";

export default function ScenePicker() {
  const [currentScene, setCurrentScene] = useState("TextBox");

  return (
    <>
      <div className="scene-picker absolute z-10 h-full w-full overflow-hidden ">
        <input
          type="radio"
          name="scene"
          id="TextBox"
          onChange={() => setCurrentScene("TextBox")}
        />
        <label htmlFor="TextBox">TextBox</label>
      </div>
    </>
  );
}
