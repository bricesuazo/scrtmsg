import { useState } from "react";
import { api } from "../utils/api";
import Link from "next/link";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Spinner from "../components/Spinner";

const SignIn = () => {
  const [signUpCredentials, setSignUpCredentials] = useState<{
    username: string;
    password: string;
    email: string;
  }>({
    username: "",
    password: "",
    email: "",
  });
  const signUpMutate = api.user.signUp.useMutation();

  return (
    <>
      <Head>
        <meta property="og:image" content="https://scrtmsg.me/api/og" />
      </Head>
      <main className="mx-auto max-w-screen-md p-4">
        <form
          className="mx-auto flex max-w-md flex-col gap-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await signUpMutate
              .mutateAsync(signUpCredentials)
              .then(async (res) => {
                res &&
                  (await signIn("credentials", {
                    username: signUpCredentials.username,
                    password: signUpCredentials.password,
                  }));
              });
          }}
        >
          <h2 className="text-center text-lg font-bold">
            Sign up to scrtmsg.me
          </h2>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              value={signUpCredentials.email}
              onChange={(e) =>
                setSignUpCredentials({
                  ...signUpCredentials,
                  email: e.target.value.toLowerCase(),
                })
              }
              disabled={signUpMutate.isLoading}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              required
              value={signUpCredentials.username}
              onChange={(e) => {
                const regex = new RegExp(/^[a-zA-Z0-9_-]*$/);

                if (!regex.test(e.target.value.trim().toLowerCase())) return;

                setSignUpCredentials({
                  ...signUpCredentials,
                  username: e.target.value.trim().toLowerCase(),
                });
              }}
              disabled={signUpMutate.isLoading}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={signUpCredentials.password}
              onChange={(e) =>
                setSignUpCredentials({
                  ...signUpCredentials,
                  password: e.target.value,
                })
              }
              disabled={signUpMutate.isLoading}
            />
          </div>
          {signUpMutate.error &&
            JSON.parse(signUpMutate.error?.message || "[]").map(
              (e: {
                code: string;
                minimum: number;
                type: string;
                inclusive: boolean;
                exact: boolean;
                message: string;
                path: [string];
              }) => (
                <p className="text-center text-red-500" key={e.code}>
                  {e.path[0].charAt(0).toUpperCase() +
                    e.path[0].slice(1) +
                    " " +
                    e.message.split("String ")[1]}
                </p>
              )
            )}
          <button
            type="submit"
            disabled={signUpMutate.isLoading}
            className="flex items-center justify-center bg-slate-100"
          >
            {signUpMutate.isLoading ? (
              <Spinner className="m-1 h-4 w-4" />
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link href="/signin" className="font-bold">
              Sign In here.
            </Link>
          </p>
        </form>
      </main>
    </>
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
