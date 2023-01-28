import { useState } from "react";
import Head from "next/head";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import type { Session } from "next-auth";
import MyMessages from "../components/MyMessages";
import VerifyEmailBanner from "../components/VerifyEmailBanner";
import SendAnonymousMessage from "../components/SendAnonymousMessage";

const UsernamePage = ({
  user: userSession,
  username,
}: {
  username: string;
  user: Session["user"] | null;
}) => {
  const [isSent, setIsSent] = useState(false);

  const title =
    (userSession?.username !== username
      ? `Send message to @${username}`
      : `@${userSession?.username}`) + " | scrtmsg.me";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          property="og:image"
          content={`https://scrtmsg.me/api/og?username=${username}`}
        />
      </Head>
      <main className="mx-auto max-w-screen-md p-4">
        {userSession?.username === username ? (
          <div className="space-y-2">
            {!userSession.emailVerified && <VerifyEmailBanner />}

            <MyMessages username={username} />
          </div>
        ) : (
          <SendAnonymousMessage
            isSent={isSent}
            setIsSent={setIsSent}
            username={username}
          />
        )}
      </main>
    </>
  );
};

export default UsernamePage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  return {
    props: {
      username: context.query.username,
      user:
        {
          ...session?.user,
          emailVerified: session?.user?.emailVerified
            ? JSON.stringify(session?.user?.emailVerified)
            : null,
        } || null,
    },
  };
};
