import { useRouter } from "next/router";
import { api } from "../utils/api";
import { useState } from "react";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import type { Session } from "next-auth";
import Moment from "react-moment";

const UsernamePage = ({ user: userSession }: { user: Session["user"] }) => {
  const sendMessageMutation = api.message.sendMessageToUsername.useMutation();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { username } = router.query;

  if (!username || typeof username !== "string") return;

  const user = api.user.getUserByUsername.useQuery({ username });

  if (user.isLoading) return <>Loading...</>;
  if (!user.data) return <>Username doesn&apos;t exists.</>;
  const title = `@${user.data.username} | scrtmsg.me`;

  if (userSession?.username === user.data.username) {
    const messages = api.message.getMessages.useQuery();
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <div>
          {messages.data?.map((message) => (
            <div key={message.id}>
              <p>{message.message}</p>
              <Moment fromNow>{message.createdAt}</Moment>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>Send message to @{user.data.username}</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendMessageMutation.mutateAsync({ username, message });
            setMessage("");
          }}
        >
          <input
            type="text"
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            disabled={sendMessageMutation.isLoading}
          />
          <button type="submit" disabled={sendMessageMutation.isLoading}>
            {sendMessageMutation.isLoading ? "Loading..." : "Send"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UsernamePage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
};
