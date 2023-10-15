import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const Overlay = ({ children }: Props): React.ReactNode => {
  const [style, setStyle] = useState({} as React.CSSProperties);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only if user is not typing in an input field
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "o") {
        setStyle((prev) => {
          if (prev.opacity === 1) {
            return { ...prev, opacity: 0 };
          } else {
            return { ...prev, opacity: 1 };
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // If enabled is true, set style to visible:

  return (
    <div
      className="overlay pointer-events-none fixed left-0 top-0 flex h-full w-full opacity-0 transition-opacity duration-500 ease-in-out"
      style={style}
    >
      {children}
    </div>
  );
};

export default Overlay;
