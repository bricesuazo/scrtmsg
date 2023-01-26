import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";
import Link from "next/link";
import Spinner from "../components/Spinner";

const ResetPassword = () => {
  const [resetPasswordCredentials, setResetPasswordCredentials] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const { token } = router.query;

  const resetPasswordMutation = api.user.resetPassword.useMutation();

  return (
    <main className="mx-auto max-w-screen-md p-4">
      {!token || typeof token !== "string" ? (
        <h1 className="text-center text-2xl font-bold">Invalid token</h1>
      ) : resetPasswordMutation.isSuccess ? (
        <>
          <p>Password reset successfully</p>
          <Link href="/signin">Sign in</Link>
        </>
      ) : (
        <form
          className="mx-auto flex max-w-md flex-col gap-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              resetPasswordCredentials.password !==
                resetPasswordCredentials.confirmPassword ||
              !resetPasswordCredentials.password
            )
              return;

            resetPasswordMutation.mutate({
              token,
              password: resetPasswordCredentials.password,
            });
          }}
        >
          <h2 className="text-center text-lg font-bold">Reset your password</h2>
          <div className="flex flex-col gap-y-1">
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              id="password"
              placeholder="Password"
              disabled={resetPasswordMutation.isLoading}
              value={resetPasswordCredentials.password}
              onChange={(e) =>
                setResetPasswordCredentials({
                  ...resetPasswordCredentials,
                  password: e.target.value,
                })
              }
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              required
              type="password"
              id="confirm-password"
              placeholder="Confirm password"
              disabled={resetPasswordMutation.isLoading}
              value={resetPasswordCredentials.confirmPassword}
              onChange={(e) =>
                setResetPasswordCredentials({
                  ...resetPasswordCredentials,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>
          {resetPasswordMutation.isError && (
            <div>{resetPasswordMutation.error.message}</div>
          )}
          <button
            type="submit"
            name="Reset password"
            disabled={resetPasswordMutation.isLoading}
            className="flex items-center justify-center bg-slate-100"
          >
            {resetPasswordMutation.isLoading ? (
              <Spinner className="m-1 h-4 w-4" />
            ) : (
              "Reset password"
            )}
          </button>
        </form>
      )}
    </main>
  );
};

export default ResetPassword;
