import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  return <div>page</div>;
}
