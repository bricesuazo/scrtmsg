import { useRouter } from "next/router";
import { api, getBaseUrl } from "../utils/api";
import { useState } from "react";
import Head from "next/head";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import type { Session } from "next-auth";
import Message from "../components/Message";
import Spinner from "../components/Spinner";
import { FaCheck, FaRegCopy, FaUndo } from "react-icons/fa";
import SendMessage from "../components/SendMessage";

const UsernamePage = ({
  user: userSession,
}: {
  user: Session["user"] | null;
}) => {
  const [isSent, setIsSent] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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

  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(`scrtmsg.me/${username}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const title =
    (userSession?.username !== user.data.username
      ? `Send message to @${user.data.username}`
      : `@${user.data.username}`) + " | scrtmsg.me";

  const og = `https://scrtmsg.me/api/og?username=${user.data.username}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={og} />
      </Head>
      <main className="mx-auto max-w-screen-md p-4">
        {(() => {
          if (userSession?.username === user.data.username) {
            const messages = api.message.getAllMessagesWithReplies.useQuery();

            return (
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-shrink-0 items-center gap-x-2">
                    <input
                      type="text"
                      value={isCopied ? "Copied" : `scrtmsg.me/${username}`}
                      className="truncate"
                      readOnly
                      onClick={() => copyUsername(username)}
                      disabled={isCopied}
                    />
                    <button
                      className="hidden p-3 sm:block"
                      onClick={() => copyUsername(username)}
                      disabled={isCopied}
                    >
                      {!isCopied ? (
                        <FaRegCopy size={12} className="dark:text-slate-200" />
                      ) : (
                        <FaCheck size={12} className="dark:text-slate-200" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => messages.refetch()}
                    disabled={messages.isRefetching}
                    className="flex w-auto items-center justify-center sm:w-20"
                  >
                    {messages.isRefetching ? (
                      <Spinner className="m-1 h-4 w-4" />
                    ) : (
                      <>
                        <div className="p-1 sm:hidden">
                          <FaUndo className="w-3 dark:text-slate-300" />
                        </div>
                        <p className="hidden sm:block">Refresh</p>
                      </>
                    )}
                  </button>
                </div>

                {messages.data?.length === 0 ? (
                  <p className="text-center text-sm text-slate-500">
                    No message
                  </p>
                ) : (
                  messages.data?.map((message) => (
                    <Message
                      message={message}
                      key={message.id}
                      refetch={messages.refetch}
                      username={username}
                    />
                  ))
                )}
              </div>
            );
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
