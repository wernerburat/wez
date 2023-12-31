import { useState } from "react";
import PostsMain from "~/pages/postsmain";
import Menu from "~/components/Menu";
import { Title } from "~/components/Title";
import MenuPage from "~/components/MenuPage";
import BabylonProvider from "~/components/wezbabylon/babylon/BabylonProvider";
import BabylonWrapper from "~/components/wezbabylon/babylon/BabylonWrapper";
import Overlay from "~/components/wezbabylon/components/Overlay";
import DroppableZoneWrapper from "~/components/wezbabylon/components/DroppableZoneWrapper";
import PostProcessManagerZones from "~/components/wezbabylon/components/PostProcessManagerZones";
import { PostProcessProvider } from "~/components/wezbabylon/context/PostProcessContext";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("moosik");

  return (
    <div>
      {currentView === "" && (
        <>
          <Title className="flex justify-center">Wez Stuff</Title>
          <div className="flex justify-center pt-10">
            <MenuPage setCurrentView={setCurrentView} />
          </div>
        </>
      )}
      <Menu setCurrentView={setCurrentView} />
      {currentView === "feed" && <PostsMain />}
      {currentView === "moosik" && (
        <>
          <BabylonProvider>
            <PostProcessProvider>
              <BabylonWrapper />
              <Overlay>
                <DroppableZoneWrapper layout={"quadrant"}>
                  <PostProcessManagerZones />
                </DroppableZoneWrapper>
              </Overlay>
            </PostProcessProvider>
          </BabylonProvider>
        </>
      )}
    </div>
  );
}
