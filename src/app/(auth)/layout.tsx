import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout(props: React.PropsWithChildren) {
  const session = await getSession();

  if (session) redirect("/");

  return <>{props.children}</>;
}
