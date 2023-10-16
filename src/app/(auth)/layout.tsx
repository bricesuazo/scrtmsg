import { redirect } from "next/navigation";

import { getSession } from "@/auth";

export default async function AuthLayout(props: React.PropsWithChildren) {
  const session = await getSession();

  if (session) redirect("/");

  return <>{props.children}</>;
}
