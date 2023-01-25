import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";
import Head from "next/head";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import type { Session } from "next-auth";
import SendMessage from "../components/SendMessage";
import MyMessages from "../components/MyMessages";

const UsernamePage = ({
  user: userSession,
}: {
  user: Session["user"] | null;
}) => {
  const [isSent, setIsSent] = useState(false);

  const router = useRouter();
  const { username } = router.query;

  if (!username || typeof username !== "string") return;

  const user = api.user.getUserByUsername.useQuery({ username });

  if (user.isLoading) return <>Loading...</>;

  if (!user.data)
    return (
      <main className="mx-auto max-w-screen-md p-4">
        <h1 className="text-center text-xl font-bold">
          Username doesn&apos;t exists.
        </h1>
      </main>
    );

  const title =
    (userSession?.username !== user.data.username
      ? `Send message to @${user.data.username}`
      : `@${user.data.username}`) + " | scrtmsg.me";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          property="og:image"
          content={`https://scrtmsg.me/api/og?username=${user.data.username}`}
        />
      </Head>
      <main className="mx-auto max-w-screen-md p-4">
        {(() => {
          if (userSession?.username === user.data.username) {
            return <MyMessages username={username} />;
          } else {
            if (isSent) {
              return (
                <div className="flex flex-col items-center gap-y-4">
                  <h1 className="text-center text-xl font-bold">
                    Message sent to @{user.data.username}
                  </h1>
                  <p>
                    <button
                      onClick={() => {
                        setIsSent(false);
                      }}
                    >
                      Send another message
                    </button>
                  </p>
                </div>
              );
            } else {
              return <SendMessage username={username} setIsSent={setIsSent} />;
            }
          }
        })()}
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
    props: { user: session?.user || null },
  };
};
