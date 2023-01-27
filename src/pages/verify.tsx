import { useRouter } from "next/router";
import { api } from "../utils/api";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";

const Verify = () => {
  const router = useRouter();

  const { token } = router.query;

  if (!token || typeof token !== "string") {
    return (
      <main className="mx-auto max-w-screen-md space-y-2 p-4">
        <FaRegTimesCircle size={52} className="mx-auto text-red-500" />
        <h1 className="text-center text-xl font-bold">Invalid token</h1>
      </main>
    );
  }

  const verify = api.user.verifyEmail.useQuery(
    { token },
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  if (verify.isLoading) {
    return <div>Verifying...</div>;
  }

  if (verify.isError) {
    return (
      <main className="mx-auto max-w-screen-md space-y-2 p-4">
        <FaRegTimesCircle size={52} className="mx-auto text-red-500" />
        <h1 className="text-center text-xl font-bold">
          {verify.error.message || "Error verifying email"}
        </h1>
      </main>
    );
  }

  if (verify.isSuccess) {
    setTimeout(() => {
      router.push("/signin");
    }, 2000);
  }

  return (
    <main className="mx-auto max-w-screen-md space-y-2 p-4">
      <>
        <FaRegCheckCircle
          size={52}
          className="mx-auto text-blue-500 dark:text-blue-300"
        />
        <div>
          <h1 className="text-center text-xl font-bold">Email verified!</h1>
          <p className="text-center">Redirecting...</p>
        </div>
      </>
    </main>
  );
};

export default Verify;
