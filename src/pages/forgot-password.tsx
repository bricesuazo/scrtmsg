import { useState } from "react";
import { api } from "../utils/api";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import Spinner from "../components/Spinner";
import Link from "next/link";

const ForgotPassword = () => {
  const [input, setInput] = useState("");

  const forgotPasswordMutation = api.user.forgotPassword.useMutation();

  return (
    <main className="mx-auto max-w-screen-md p-4">
      {forgotPasswordMutation.isSuccess ? (
        <>
          <h2>Check your email</h2>
          <p>
            We&apos;ve sent you an email with a link to reset your password.
          </p>
        </>
      ) : (
        <form
          className="mx-auto flex max-w-md flex-col gap-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            if (!input || !input.length) return;

            forgotPasswordMutation.mutate({ input });
          }}
        >
          <h2 className="text-center text-lg font-bold">
            Forgot your password
          </h2>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="username/email">Username or email</label>
            <input
              id="username/email"
              required
              onChange={(e) => setInput(e.target.value)}
              disabled={forgotPasswordMutation.isLoading}
              value={input}
              placeholder="Username or email"
            />
          </div>
          {forgotPasswordMutation.isError && (
            <div className="text-red-500">
              {forgotPasswordMutation.error?.message}
            </div>
          )}

          <button
            type="submit"
            disabled={
              forgotPasswordMutation.isLoading ||
              forgotPasswordMutation.isSuccess
            }
            name="Reset email"
            className="flex items-center justify-center bg-slate-100"
          >
            {forgotPasswordMutation.isLoading ? (
              <Spinner className="m-1 h-4 w-4" />
            ) : (
              "Send reset email"
            )}
          </button>
          <p className="mt-4 text-center">
            Remembered your password?{" "}
            <Link href="/signin" className="font-bold">
              Sign in here.
            </Link>
          </p>
        </form>
      )}
    </main>
  );
};

export default ForgotPassword;

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
