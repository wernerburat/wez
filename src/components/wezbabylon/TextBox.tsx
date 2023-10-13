import React, { useState } from "react";
import useMeshBuilder from "./hook/useMeshBuilder";
import useMaterialCache from "./hook/useMaterialCache";
import useMeshTextManager from "./hook/useMeshTextManager";
import { type TextEntry } from "./type/TextTypes";

const TextBox: React.FC = () => {
  const [textEntries, setTextEntries] = useState<TextEntry[]>([]);
  const { createBox } = useMeshBuilder();
  const { getMaterialForText } = useMaterialCache();
  const { synchronizeMeshesWithText } = useMeshTextManager(
    getMaterialForText,
    createBox,
  );

  const textChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    const newEntries = newText.split("").map((char, index) => {
      const existingEntry = textEntries[index];
      const id = existingEntry ? existingEntry.id : Date.now() + index;
      return { id, char };
    });
    setTextEntries(newEntries);
    synchronizeMeshesWithText(newEntries);
  };

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
