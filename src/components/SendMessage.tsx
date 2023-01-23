import useScrollPosition from "../hooks/useScrollPosition";
import { api } from "../utils/api";
import PublicMessage from "./PublicMessage";
import { useState, type SetStateAction, type Dispatch } from "react";

const SendMessage = ({
  username,
  setIsSent,
}: {
  username: string;
  setIsSent: Dispatch<SetStateAction<boolean>>;
}) => {
  const scrollPosition = useScrollPosition();
  const [message, setMessage] = useState("");

  const sendMessageMutation = api.message.sendMessageToUsername.useMutation();

  const messages = api.message.getAllPublicMessages.useQuery({
    username,
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
          Send message to @{username}
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
            placeholder={`Send anonymous message to @${username}`}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            disabled={sendMessageMutation.isLoading}
            required
          />
          <button type="submit" disabled={sendMessageMutation.isLoading}>
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
          <h4 className="text-center dark:text-slate-300">Replied messages</h4>
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
};

export default SendMessage;
