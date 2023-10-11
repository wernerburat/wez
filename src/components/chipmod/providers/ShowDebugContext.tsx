import { createContext, useContext, useState } from "react";

type ShowDebugProviderProps = {
  children: React.ReactNode;
};

interface ShowDebugContextProps {
  debugging: boolean;
  toggleDebugging: () => void;
}
export const ShowDebugContext = createContext<
  ShowDebugContextProps | undefined
>(undefined);

export const ShowDebugProvider: React.FC<ShowDebugProviderProps> = ({
  children,
}) => {
  const [debugging, setDebugging] = useState(false);
  const toggleDebugging = () => setDebugging((prev) => !prev);

  return (
    <ShowDebugContext.Provider value={{ debugging, toggleDebugging }}>
      {children}
    </ShowDebugContext.Provider>
  );
};

export const useShowDebug = () => {
  const context = useContext(ShowDebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
};
