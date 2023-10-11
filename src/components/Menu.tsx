import { useEffect } from "react";
import { useMenu } from "../contexts/MenuContext";
import MenuPage from "./MenuPage";

interface MenuProps {
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

const Menu: React.FC<MenuProps> = ({ setCurrentView }) => {
  const { isMenuOpen, openMenu, closeMenu } = useMenu();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && toggleMenu();

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen, openMenu, closeMenu]);

  const toggleMenu = () => (isMenuOpen ? closeMenu() : openMenu());

  const menuStyle = isMenuOpen
    ? {
        transform: "translateX(0%)",
        transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
        opacity: "1",
      }
    : {
        transform: "translateX(-100%)",
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        opacity: "0",
      };

  return (
    <div>
      <div
        onClick={toggleMenu}
        className="absolute left-2 top-2 z-50 flex h-8 w-8 cursor-pointer items-center
        justify-center rounded-sm bg-slate-200 shadow-xl transition-colors duration-300
      hover:bg-slate-300"
      >
        <span className=" text-slate-900">≡</span>
      </div>
      <div style={{ overflow: "hidden" }}>
        {/* Actual Menu */}
        <div
          className="menu fixed inset-0 z-40 flex bg-slate-600 bg-opacity-70 p-4 pl-10"
          style={{
            ...menuStyle,
          }}
        >
          <MenuPage setCurrentView={setCurrentView} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
