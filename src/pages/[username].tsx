import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";
import Head from "next/head";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import type { Session } from "next-auth";
import Message from "../components/Message";
import Spinner from "../components/Spinner";
import { FaCheck, FaRegCopy, FaUndo } from "react-icons/fa";
import PublicMessage from "../components/PublicMessage";
import useScrollPosition from "../hooks/useScrollPosition";

const UsernamePage = ({
  user: userSession,
}: {
  user: Session["user"] | null;
}) => {
  const scrollPosition = useScrollPosition();
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const router = useRouter();
  const { username } = router.query;

  if (!username || typeof username !== "string") return;

  const sendMessageMutation = api.message.sendMessageToUsername.useMutation();
  const user = api.user.getUserByUsername.useQuery({ username });

  if (user.isLoading) return <>Loading...</>;

  const title =
    (!user.data
      ? `No username found`
      : userSession?.username !== user.data.username
      ? `Send message to @${user.data.username}`
      : `@${user.data.username}`) + " | scrtmsg.me";

  if (!user.data)
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <main className="mx-auto max-w-screen-md p-4">
          <h1 className="text-center text-xl font-bold">
            Username doesn&apos;t exists.
          </h1>
        </main>
      </>
    );

  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(`scrtmsg.me/${username}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  return (
    <>
      <Head>
        <title>{title}</title>
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
              const messages = api.message.getAllPublicMessages.useQuery({
                username: user.data.username,
              });

              return (
                <div className="mx-auto max-w-md space-y-8">
                  <div
                    className={`${
                      scrollPosition > 20
                        ? "bg-white pb-4 dark:bg-[#121212]"
                        : "bg-transparent"
                    } sticky top-16 space-y-4 py-0 transition-all duration-500 ease-in-out`}
                  >
                    <h1 className="text-center text-xl font-bold">
                      Send message to @{user.data.username}
                    </h1>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await sendMessageMutation.mutateAsync({
                          username,
                          message,
                        });
                        setMessage("");
                        setIsSent(true);
                      }}
                      className="flex flex-col gap-y-2"
                    >
                      <textarea
                        placeholder={`Send anonymous message to @${user.data.username}`}
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        disabled={sendMessageMutation.isLoading}
                        required
                      />
                      <button
                        type="submit"
                        disabled={sendMessageMutation.isLoading}
                      >
                        {sendMessageMutation.isLoading ? "Loading..." : "Send"}
                      </button>
                    </form>
                  </div>

                  {messages.data?.length === 0 ? (
                    <p className="text-center text-sm dark:text-slate-500">
                      No replied messages
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="text-center dark:text-slate-300">
                        Replied messages
                      </h4>
                      <div className="space-y-2">
                        {messages.data?.map((message) => (
                          <PublicMessage
                            message={message}
                            key={message.id}
                            username={username}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
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
