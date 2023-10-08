import { ReactNode, useState } from "react";
import PostsMain from "~/pages/postsmain";
import ChipModMain from "~/pages/chipmodmain";
import Menu from "~/components/Menu";
import { Title } from "~/components/Title";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("");

  return (
    <div>
      {currentView === "" && (
        <Title className="flex justify-center">Wez Stuff</Title>
      )}
      <Menu setCurrentView={setCurrentView} />
      {currentView === "feed" && <PostsMain />}
      {currentView === "moosik" && <ChipModMain />}
    </div>
  );
}
