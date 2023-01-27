import { FaRegEnvelope } from "react-icons/fa";
import { api } from "../utils/api";
import Spinner from "./Spinner";

const VerifyEmailBanner = ({ email }: { email: string }) => {
  const resendEmailVerification =
    api.user.resendVerificationEmail.useMutation();

  return (
    <div className="flex items-center justify-between rounded bg-slate-100 px-4 py-2 dark:bg-slate-800">
      <div className="flex items-center gap-x-2">
        <div className="rounded-full bg-slate-200 p-2 dark:bg-slate-700">
          <FaRegEnvelope size={18} />
        </div>
        <h1 className="">Please verify your email address.</h1>
      </div>

      {resendEmailVerification.isError && (
        <div className="text-sm text-red-500">
          {resendEmailVerification.error.message}
        </div>
      )}

      {resendEmailVerification.isSuccess ? (
        <div className="text-sm text-green-500">Email verification sent!</div>
      ) : (
        <button
          onClick={() => {
            resendEmailVerification.mutate({ email });
          }}
          disabled={resendEmailVerification.isLoading}
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
