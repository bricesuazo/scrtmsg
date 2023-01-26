import { useState } from "react";
import { api } from "../utils/api";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";

const ForgotPassword = () => {
  const [input, setInput] = useState("");

  const forgotPasswordMutation = api.user.forgotPassword.useMutation();

  if (forgotPasswordMutation.isSuccess)
    return (
      <main className="mx-auto max-w-md p-4">
        <h2>Check your email</h2>
        <p>We&apos;ve sent you an email with a link to reset your password.</p>
      </main>
    );

  return (
    <main className="mx-auto max-w-md p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!input || !input.length) return;

          forgotPasswordMutation.mutate({ input });
        }}
      >
        <h2>Forgot your password</h2>
        <div>
          <label htmlFor="username/email">Username or email</label>
          <input
            id="username/email"
            required
            onChange={(e) => setInput(e.target.value)}
            disabled={forgotPasswordMutation.isLoading}
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
            forgotPasswordMutation.isLoading || forgotPasswordMutation.isSuccess
          }
          name="Reset email"
        >
          {forgotPasswordMutation.isLoading ? "Loading..." : "Send reset email"}
        </button>
      </form>
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
