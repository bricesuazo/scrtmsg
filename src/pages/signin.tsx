import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import { getServerAuthSession } from "../server/auth";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

const SignIn = () => {
  const [signInCredentials, setSignInCredentials] = useState({
    username: "",
    password: "",
  });

  return (
    <main>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          signIn("credentials", {
            redirect: false,
            username: signInCredentials.username,
            password: signInCredentials.password,
          });
        }}
      >
        <h2>Sign In</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={signInCredentials.username}
          onChange={(e) =>
            setSignInCredentials({
              ...signInCredentials,
              username: e.target.value,
            })
          }
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={signInCredentials.password}
          onChange={(e) =>
            setSignInCredentials({
              ...signInCredentials,
              password: e.target.value,
            })
          }
        />
        <button type="submit">Sign In</button>
      </form>
      <Link href="/signup">Sign Up here.</Link>
    </main>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (session && session.user) {
    return {
      redirect: {
        destination: `/${session.user.username}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
