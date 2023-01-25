import { useRouter } from "next/router";
import { api } from "../utils/api";

const Verify = () => {
  const router = useRouter();

  const { token } = router.query as { token: string };

  if (!token || typeof token !== "string") {
    return <div>Invalid token</div>;
  }

  const verify = api.user.verifyEmail.useQuery(
    { token },
    { retry: false, refetchOnWindowFocus: false }
  );

  if (verify.isLoading) {
    return <div>Verifying...</div>;
  }

  if (verify.isError) {
    return <div>{verify.error.message || "Error verifying email"}</div>;
  }

  return <>Email verified!</>;
};

export default Verify;
