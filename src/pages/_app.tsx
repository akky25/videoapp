import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "~/Components/ThemeProvider";
import Head from "next/head";
import { LoadingProvider } from "~/Components/LoadingProvider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider>
          <LoadingProvider>
            <Component {...pageProps} />
          </LoadingProvider>
        </ThemeProvider>
      </SessionProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
