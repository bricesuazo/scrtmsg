import { getSession } from '@/auth';
import SendAnonymousMessage from '@/components/send-anonymous-message';
import type { Metadata } from 'next';

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
    <main className="max-w-screen-md mx-auto p-4">
      <SendAnonymousMessage
        username={username}
        isImTheUsername={session?.user.username === username}
      />
    </main>
  );
}
