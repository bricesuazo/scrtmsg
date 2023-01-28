import { api } from "../utils/api";
import SendMessage from "./SendMessage";
import type { Dispatch, SetStateAction } from "react";
import Spinner from "./Spinner";

const SendAnonymousMessage = ({
  isSent,
  setIsSent,
  username,
}: {
  isSent: boolean;
  setIsSent: Dispatch<SetStateAction<boolean>>;
  username: string;
}) => {
  const user = api.user.getUserByUsername.useQuery({ username });

  if (user.isLoading) {
    return <Spinner />;
  }

  if (user.isError) {
    return <div>{user.error.message}</div>;
  }

  if (!user.data) {
    return <div>User not found</div>;
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-center text-xl font-bold">
          Message sent to @{username}
        </h1>
        <p>
          <button
            onClick={() => {
              setIsSent(false);
            }}
            name="Send another message"
          >
            Send another message
          </button>
        </p>
      </div>
    );
  } else {
    return <SendMessage username={username} setIsSent={setIsSent} />;
  }
};

export default SendAnonymousMessage;
