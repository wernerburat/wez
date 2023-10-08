import { ReactNode, useState } from "react";
import { Title } from "~/components/Title";
import PostsMain from "~/pages/postsmain";
import ChipModMain from "~/pages/chipmodmain";
import { MenuButton } from "~/components/MenuButton";

const Menu: React.FC<{
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}> = ({ setCurrentView }) => (
  <>
    <Title className="flex justify-center">Wez Stuff</Title>
    <div className="menu">
      <div className="buttons-container flex gap-4">
        <MenuButton label="Feed" view="feed" setCurrentView={setCurrentView} />
        <MenuButton
          label="Moosik"
          view="moosik"
          setCurrentView={setCurrentView}
        />
      </div>
    </div>
  </>
);

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("");

  return (
    <div>
      {currentView === "feed" && <PostsMain />}
      {currentView === "moosik" && <ChipModMain />}
      {currentView === "" && <Menu setCurrentView={setCurrentView} />}
    </div>
  );
}
