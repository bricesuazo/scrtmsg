import { useState } from "react";
import { api } from "../utils/api";
import Link from "next/link";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";

const SignIn = () => {
  const [signUpCredentials, setSignUpCredentials] = useState({
    username: "",
    password: "",
    email: "",
  });
  const signUpMutate = api.user.signUp.useMutation();
  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signUpMutate.mutate(signUpCredentials);
        }}
      >
        <h2>Sign Up</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={signUpCredentials.email}
          onChange={(e) =>
            setSignUpCredentials({
              ...signUpCredentials,
              email: e.target.value,
            })
          }
          disabled={signUpMutate.isLoading}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={signUpCredentials.username}
          onChange={(e) =>
            setSignUpCredentials({
              ...signUpCredentials,
              username: e.target.value,
            })
          }
          disabled={signUpMutate.isLoading}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={signUpCredentials.password}
          onChange={(e) =>
            setSignUpCredentials({
              ...signUpCredentials,
              password: e.target.value,
            })
          }
          disabled={signUpMutate.isLoading}
        />
        <button type="submit" disabled={signUpMutate.isLoading}>
          {signUpMutate.isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>

      <Link href="/signin">Sign In here.</Link>
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
