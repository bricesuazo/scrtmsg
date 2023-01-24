import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { getServerAuthSession } from "../server/auth";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

const SignIn = () => {
  const router = useRouter();
  const [signInCredentials, setSignInCredentials] = useState<{
    username: string;
    password: string;
    loading: boolean;
    error: string | null;
  }>({
    username: "",
    password: "",
    loading: false,
    error: null,
  });

  return (
    <main className="mx-auto max-w-screen-md p-4">
      <form
        className="mx-auto flex max-w-md flex-col gap-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSignInCredentials({
            ...signInCredentials,
            loading: true,
            error: null,
          });

          const res = await signIn("credentials", {
            username: signInCredentials.username,
            password: signInCredentials.password,
            redirect: false,
          });
          if (res?.ok) {
            router.reload();
          } else if (res?.error) {
            setSignInCredentials({
              ...signInCredentials,
              error: res.error,
            });
          }

          setSignInCredentials({ ...signInCredentials, loading: false });
        }}
      >
        <h2 className="text-center text-lg font-bold">Sign in to scrtmsg.me</h2>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
            disabled={signInCredentials.loading}
            value={signInCredentials.username}
            onChange={(e) =>
              setSignInCredentials({
                ...signInCredentials,
                username: e.target.value,
              })
            }
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
            disabled={signInCredentials.loading}
            value={signInCredentials.password}
            onChange={(e) =>
              setSignInCredentials({
                ...signInCredentials,
                password: e.target.value,
              })
            }
          />
        </div>
        {signInCredentials.error && (
          <p className="text-center text-red-500">{signInCredentials.error}</p>
        )}
        <button
          type="submit"
          disabled={signInCredentials.loading}
          className="bg-slate-100"
        >
          {signInCredentials.loading ? "Loading..." : "Sign In"}
        </button>
        <p className="mt-4 text-center">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-bold">
            Sign Up here.
          </Link>
        </p>
      </form>
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
