import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { MenuProvider } from "~/contexts/MenuContext";
import { DragDropProvider } from "~/components/wezbabylon/context/DragDropContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <DragDropProvider>
        <Toaster position="bottom-center" />
        <MenuProvider>
          <Component {...pageProps} />
        </MenuProvider>
      </DragDropProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
