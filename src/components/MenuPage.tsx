// components/MenuPage.tsx
import React, { useState } from "react";
import { MenuButton } from "~/components/MenuButton";

type MenuPageType = "default" | "additional";

interface MenuPageProps {
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

const MenuPage: React.FC<MenuPageProps> = ({ setCurrentView }) => {
  const [currentPage, setCurrentPage] = useState<MenuPageType>("default");

  if (currentPage === "default") {
    return (
      <div className="menu-page-default">
        <div className="menu">
          <div className="buttons-container flex gap-4">
            <MenuButton
              label="Feed"
              view="feed"
              setCurrentView={setCurrentView}
            />
            <MenuButton
              label="Moosik"
              view="moosik"
              setCurrentView={setCurrentView}
            />
            <MenuButton label="Home" view="" setCurrentView={setCurrentView} />
            <button onClick={() => setCurrentPage("additional")}>Page 2</button>
          </div>
        </div>
      </div>
    );
  } else if (currentPage === "additional") {
    return (
      <div className="menu-page-additional">
        <button onClick={() => setCurrentPage("default")}>
          Back to Main Menu
        </button>
      </div>
    );
  }

  return null;
};

export default MenuPage;
