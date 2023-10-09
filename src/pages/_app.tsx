import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { MenuProvider } from "~/contexts/MenuContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-center" />
      <MenuProvider>
        <Component {...pageProps} />
      </MenuProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
