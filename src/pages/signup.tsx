import { useState } from "react";
import { api } from "../utils/api";
import Link from "next/link";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { signIn } from "next-auth/react";
import Head from "next/head";

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
              onChange={(e) =>
                setSignUpCredentials({
                  ...signUpCredentials,
                  username: e.target.value.toLowerCase(),
                })
              }
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
          {signUpMutate.error && (
            <p className="text-center text-red-500">
              {signUpMutate.error.message}
            </p>
          )}
          <button
            type="submit"
            disabled={signUpMutate.isLoading}
            className="bg-slate-100"
          >
            {signUpMutate.isLoading ? "Loading..." : "Sign Up"}
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
