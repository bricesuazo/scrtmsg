import SigninForm from "@/components/signin-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await getSession();

  if (session) redirect("/");

  return <SigninForm />;
}
