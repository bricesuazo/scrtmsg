import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import Head from "next/head";
import Header from "../components/Header";
// import { useState } from "react";
import { type AppProps } from "next/app";
// import { getCookie, setCookie } from 'cookies-next';
import {
  MantineProvider,
  // type ColorScheme,
  // ColorSchemeProvider,
} from "@mantine/core";
// import {type GetServerSidePropsContext } from "next";

function App(
  props: AppProps & { session: Session | null }
  // props: AppProps & { session: Session | null; colorScheme: ColorScheme }
) {
  const { Component, pageProps } = props;
  // const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  // const toggleColorScheme = (value?: ColorScheme) => {
  //   const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
  //   setColorScheme(nextColorScheme);
  //   setCookie('theme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  // };
  return (
    <>
      <Head>
        <title>scrtmsg.me | Get message from anonymous.</title>
        <meta name="description" content="Get message from anonymous." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}> */}
      {/* <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS> */}
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <SessionProvider session={props.session}>
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
      </MantineProvider>
      {/* </ColorSchemeProvider> */}
    </>
  );
}

// App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
//   colorScheme: getCookie('theme', ctx) || 'dark',
// });

export default api.withTRPC(App);
