import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const [signInCredentials, setSignInCredentials] = useState({
    username: "",
    password: "",
  });
  const [signUpCredentials, setSignUpCredentials] = useState({
    username: "",
    password: "",
  });
  return (
    <>
      <Head>
        <title>scrtmsg.me | Get message from anonymous.</title>
        <meta name="description" content="Get message from anonymous." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={() => {}}></form>
    </>
  );
};

export default Home;
