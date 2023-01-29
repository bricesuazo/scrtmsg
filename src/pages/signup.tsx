import { useState } from "react";
import { api } from "../utils/api";
import Link from "next/link";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import Head from "next/head";
import Spinner from "../components/Spinner";
import { FaRegCheckCircle } from "react-icons/fa";

const SignIn = () => {
  const [signUpCredentials, setSignUpCredentials] = useState<{
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    isSignedUp: boolean;
  }>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    isSignedUp: false,
  });
  const signUpMutate = api.user.signUp.useMutation();

  return (
    <>
      <Head>
        <meta property="og:image" content="https://scrtmsg.me/api/og" />
      </Head>
      <main className="mx-auto max-w-screen-md p-4">
        {signUpCredentials.isSignedUp || true ? (
          <div className="mx-auto flex max-w-md flex-col gap-y-4">
            <FaRegCheckCircle
              size={52}
              className="mx-auto text-blue-500 dark:text-blue-300"
            />
            <p className="text-center">
              You have successfully signed up. Please check your email to verify
              your account.
            </p>
          </div>
        ) : (
          <form
            className="mx-auto flex max-w-md flex-col gap-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                signUpCredentials.password !== signUpCredentials.confirmPassword
              )
                return alert("Passwords do not match");
              if (signUpCredentials.username.length < 3)
                return alert("Username must be at least 3 characters long");
              if (signUpCredentials.password.length < 8)
                return alert("Password must be at least 8 characters long");
              await signUpMutate
                .mutateAsync({
                  username: signUpCredentials.username,
                  password: signUpCredentials.password,
                  email: signUpCredentials.email,
                })
                .then(() => {
                  setSignUpCredentials({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    email: "",
                    isSignedUp: true,
                  });
                });
            }}
          >
            <h2 className="text-center text-lg font-bold">
              Sign up to scrtmsg.me
            </h2>

            <div className="flex flex-col gap-y-1">
              <label htmlFor="email">
                Email
                <span className="pointer-events-none select-none text-red-500">
                  {" "}
                  *
                </span>
              </label>
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
              <label htmlFor="username">
                Username
                <span className="pointer-events-none select-none text-red-500">
                  {" "}
                  *
                </span>
              </label>
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
              <label htmlFor="password">
                Password
                <span className="pointer-events-none select-none text-red-500">
                  {" "}
                  *
                </span>
              </label>
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
            <div className="flex flex-col gap-y-1">
              <label htmlFor="confirm-password">
                Confirm password
                <span className="pointer-events-none select-none text-red-500">
                  {" "}
                  *
                </span>
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm Password"
                required
                value={signUpCredentials.confirmPassword}
                onChange={(e) =>
                  setSignUpCredentials({
                    ...signUpCredentials,
                    confirmPassword: e.target.value,
                  })
                }
                disabled={signUpMutate.isLoading}
              />
            </div>
            {/* {signUpMutate.error &&
            JSON.parse(signUpMutate.error?.message).map(
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
            )} */}

            {signUpMutate.error && (
              <p className="text-center text-red-500">
                {signUpMutate.error?.message}
              </p>
            )}
            <button
              type="submit"
              disabled={signUpMutate.isLoading}
              className="flex items-center justify-center bg-slate-100"
              name="Sign up"
            >
              {signUpMutate.isLoading ? (
                <Spinner className="m-1 h-4 w-4" />
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/signin" className="font-bold">
                Sign In here.
              </Link>
            </p>
          </form>
        )}
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
