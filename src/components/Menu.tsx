import { useEffect } from "react";
import { useMenu } from "../contexts/MenuContext";

const Menu: React.FC = () => {
  const { isMenuOpen, openMenu, closeMenu } = useMenu();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && isMenuOpen ? closeMenu() : openMenu();

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeMenu, openMenu]);

  return (
    <div>
      {/* Icon to open menu */}
      <div
        onClick={openMenu}
        style={{ position: "fixed", top: "10px", left: "10px" }}
      >
        ≡
      </div>

      {/* Actual Menu */}
      {isMenuOpen && (
        <div
          className="menu"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            zIndex: 1000,
          }}
        >
          Menu is Open!
          {/* Add more menu content here */}
        </div>
      )}
    </div>
  );
};

export default Menu;
