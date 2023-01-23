import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";
import Head from "next/head";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import type { Session } from "next-auth";
import Message from "../components/Message";
import Spinner from "../components/Spinner";
import { FaCheck, FaRegCopy } from "react-icons/fa";

const UsernamePage = ({
  user: userSession,
}: {
  user: Session["user"] | null;
}) => {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("");

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
  const [isCopied, setIsCopied] = useState(false);

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
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="mx-auto max-w-screen-md p-4">
        {(() => {
          if (userSession?.username === user.data.username) {
            const messages = api.message.getMessages.useQuery();

            return (
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <input
                      type="text"
                      value={`scrtmsg.me/${username}`}
                      className="max-w-48 truncate"
                      readOnly
                    />
                    <button
                      className="p-3"
                      onClick={() => {
                        navigator.clipboard.writeText(`scrtmsg.me/${username}`);
                        setIsCopied(true);
                        setTimeout(() => {
                          setIsCopied(false);
                        }, 3000);
                      }}
                      disabled={isCopied}
                    >
                      {!isCopied ? (
                        <FaRegCopy size={12} className="text-slate-200" />
                      ) : (
                        <FaCheck size={12} className="text-slate-200" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => messages.refetch()}
                    disabled={messages.isRefetching}
                    className="flex w-20 items-center justify-center"
                  >
                    {messages.isRefetching ? (
                      <Spinner className="m-1 h-4 w-4" />
                    ) : (
                      "Refresh"
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
              // const messages =
              //   api.message.getPublicAndWithReplyMessages.useQuery({
              //     username: user.data.username,
              //   });

              return (
                <div className="mx-auto flex max-w-md flex-col gap-y-4">
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
                      placeholder={`Message to @${user.data.username}`}
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
