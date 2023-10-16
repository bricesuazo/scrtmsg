import type { Metadata } from "next";

import { getSession } from "@/auth";
import MyMessages from "@/components/my-messages";
import SendAnonymousMessage from "@/components/send-anonymous-message";

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string };
}): Promise<Metadata> {
  const session = await getSession();

  return {
    title:
      session?.user.username !== username
        ? `Send a secret message to @${username}`
        : `@${username} | scrtmsg.me`,
    openGraph: {
      images: [`https://scrtmsg.me/api/og?username=${username}`],
    },
  };
}

export default async function UserPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const session = await getSession();

  return (
    <main>
      {session?.user.username === username ? (
        <div className="space-y-2">
          <MyMessages username={username} />
        </div>
      ) : (
        <SendAnonymousMessage username={username} />
      )}
    </main>
  );
}
