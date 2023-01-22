import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "nprogress/nprogress.css";
import "../styles/globals.css";
import Head from "next/head";
import Header from "../components/Header";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider attribute="class">
        <SessionProvider session={session}>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
