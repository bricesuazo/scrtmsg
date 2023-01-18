import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";
import Head from "next/head";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import type { Session } from "next-auth";
import Moment from "react-moment";

const UsernamePage = ({
  user: userSession,
}: {
  user: Session["user"] | null;
}) => {
  const [isSent, setIsSent] = useState(true);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { username } = router.query;

  if (!username || typeof username !== "string") return;

  const sendMessageMutation = api.message.sendMessageToUsername.useMutation();
  const user = api.user.getUserByUsername.useQuery({ username });

  if (user.isLoading) return <>Loading...</>;
  if (!user.data) return <>Username doesn&apos;t exists.</>;
  const title = `@${user.data.username} | scrtmsg.me`;

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
              <>
                {messages.data?.length === 0 ? (
                  <p>No message</p>
                ) : (
                  messages.data?.map((message) => (
                    <div key={message.id}>
                      <p>{message.message}</p>
                      <Moment fromNow>{message.createdAt}</Moment>
                    </div>
                  ))
                )}
              </>
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

          return null;
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
