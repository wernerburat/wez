import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { MenuProvider } from "~/contexts/MenuContext";
import { DndContext } from "@dnd-kit/core";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <DndContext>
        <Toaster position="bottom-center" />
        <MenuProvider>
          <Component {...pageProps} />
        </MenuProvider>
      </DndContext>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
