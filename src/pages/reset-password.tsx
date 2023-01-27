import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";
import Link from "next/link";
import Spinner from "../components/Spinner";
import { FaRegCheckCircle } from "react-icons/fa";

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
        <h1 className="text-center text-2xl font-bold text-red-500">
          Invalid token
        </h1>
      ) : resetPasswordMutation.isSuccess ? (
        <div className="mx-auto max-w-md space-y-2">
          <FaRegCheckCircle
            size={52}
            className="mx-auto text-blue-500 dark:text-blue-300"
          />
          <div className="flex flex-col justify-center gap-y-1">
            <h1 className="text-center text-xl font-bold">
              Password reset successfully
            </h1>
            <Link href="/signin" className="text-center">
              <button>Sign in</button>
            </Link>
          </div>
        </div>
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
            <label htmlFor="password">
              Password
              <span className="pointer-events-none select-none text-red-500">
                {" "}
                *
              </span>
            </label>
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
            <label htmlFor="confirm-password">
              Confirm password
              <span className="pointer-events-none select-none text-red-500">
                {" "}
                *
              </span>
            </label>
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
            <div className="text-center text-red-500">
              {resetPasswordMutation.error.message}
            </div>
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
