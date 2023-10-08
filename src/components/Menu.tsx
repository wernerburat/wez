import { useEffect } from "react";
import { useMenu } from "../contexts/MenuContext";
import MenuPage from "./MenuPage";
import { AutoAnimate } from "./auto-animate";

interface MenuProps {
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

const Menu: React.FC<MenuProps> = ({ setCurrentView }) => {
  const { isMenuOpen, openMenu, closeMenu } = useMenu();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && isMenuOpen ? closeMenu() : openMenu();

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen, openMenu, closeMenu]);

  return (
    <div>
      {/* Icon to open menu */}
      <div
        onClick={openMenu}
        style={{ position: "fixed", top: "10px", left: "10px" }}
      >
        ≡
      </div>
      <div style={{ overflow: "hidden" }}>
        <AutoAnimate>
          {/* Actual Menu */}
          {isMenuOpen && (
            <div
              className="menu"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "30vw",
                height: "50vh",
                background: "rgba(100, 0, 0, 0.7)",
                color: "white",
                zIndex: 1000,
              }}
            >
              <MenuPage setCurrentView={setCurrentView} />
            </div>
          )}
        </AutoAnimate>
      </div>
    </div>
  );
};

export default Menu;
