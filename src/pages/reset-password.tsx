import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";

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

  if (!token || typeof token !== "string") {
    return <div>Invalid token</div>;
  }

  const resetPasswordMutation = api.user.resetPassword.useMutation();

  return (
    <div>
      <form
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
        <label htmlFor="password">Password</label>
        <input
          required
          type="password"
          id="password"
          disabled={resetPasswordMutation.isLoading}
          value={resetPasswordCredentials.password}
          onChange={(e) =>
            setResetPasswordCredentials({
              ...resetPasswordCredentials,
              password: e.target.value,
            })
          }
        />
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          required
          type="password"
          id="confirm-password"
          disabled={resetPasswordMutation.isLoading}
          value={resetPasswordCredentials.confirmPassword}
          onChange={(e) =>
            setResetPasswordCredentials({
              ...resetPasswordCredentials,
              confirmPassword: e.target.value,
            })
          }
        />
        {resetPasswordMutation.isError && (
          <div>{resetPasswordMutation.error.message}</div>
        )}
        <button type="submit" name="Reset password">
          Reset password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
