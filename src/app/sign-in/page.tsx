import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SigninForm from "@/components/signin-form";

export default async function SignIn() {
  const session = await auth();

  if (session) redirect("/");

  return <SigninForm />;
}
