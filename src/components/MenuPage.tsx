import React, { useState } from "react";
import { MenuButton } from "~/components/MenuButton";
import { Title } from "./Title";

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
          {/* <div className="pages">
            <button onClick={() => setCurrentPage("additional")}>Page 2</button>
          </div> */}
          <Title className="pb-4">
            <span>Navigate to</span>
          </Title>
          <div className="buttons-container align-start flex flex-col gap-4">
            <MenuButton
              className="flex justify-start"
              label="Home"
              view=""
              setCurrentView={setCurrentView}
            />
            <MenuButton
              className="flex justify-start"
              label="Feed"
              view="feed"
              setCurrentView={setCurrentView}
            />
            <MenuButton
              className="flex justify-start"
              label="Moosik"
              view="moosik"
              setCurrentView={setCurrentView}
            />
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
