import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "nprogress/nprogress.css";
import "../styles/globals.css";
import Head from "next/head";
import Header from "../components/Header";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import useScrollPosition from "../hooks/useScrollPosition";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  return (
    <>
      <Head>
        <title>scrtmsg.me | Get message from anonymous.</title>
        <meta name="description" content="Get message from anonymous." />
        <link
          rel="shortcut icon"
          href="/images/favicon/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="icon"
          href="/images/favicon/favicon.ico"
          type="image/x-icon"
        />
      </Head>
      <ThemeProvider attribute="class">
        <SessionProvider session={session}>
          <div
            className={`${
              scrollPosition > 20
                ? "bg-white dark:bg-[#121212]"
                : "bg-transparent"
            } sticky top-0 z-10 transition-colors`}
          >
            <Header />
          </div>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
