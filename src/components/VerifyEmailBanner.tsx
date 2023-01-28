import { FaRegEnvelope } from "react-icons/fa";
import { api } from "../utils/api";
import Spinner from "./Spinner";

const VerifyEmailBanner = () => {
  const resendEmailVerification =
    api.user.resendVerificationEmail.useMutation();

  return (
    <div className="flex items-center justify-between gap-x-2 rounded bg-slate-100 px-2 py-2 dark:bg-slate-800 sm:px-3 sm:py-2">
      <div className="flex items-center gap-x-2">
        <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-700">
          <FaRegEnvelope className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <h1 className="text-xs sm:text-sm">
          Please verify your email address.
        </h1>
      </div>

      {resendEmailVerification.isError && (
        <div className="text-sm text-red-500">
          {resendEmailVerification.error.message}
        </div>
      )}

      {resendEmailVerification.isSuccess ? (
        <div className="w-28 text-center text-xs text-green-500 sm:w-fit sm:text-sm">
          Email verification sent!
        </div>
      ) : (
        <button
          onClick={() => {
            resendEmailVerification.mutate();
          }}
          disabled={resendEmailVerification.isLoading}
          className="w-28 bg-slate-200 text-xs hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 sm:w-max sm:text-sm"
        >
          {resendEmailVerification.isLoading ? (
            <Spinner />
          ) : (
            "Resend email verification"
          )}
        </button>
      )}
    </div>
  );
};

export default VerifyEmailBanner;
