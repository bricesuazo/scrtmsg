import ReactTextareaAutosize from "react-textarea-autosize";
import { api } from "../utils/api";
import PublicMessage from "./PublicMessage";
import { useState, type SetStateAction, type Dispatch } from "react";
import LoadingMessage from "./LoadingMessage";

const SendMessage = ({
  username,
  setIsSent,
}: {
  username: string;
  setIsSent: Dispatch<SetStateAction<boolean>>;
}) => {
  const [message, setMessage] = useState("");

  const sendMessageMutation = api.message.sendMessageToUsername.useMutation();

  const messages = api.message.getAllPublicMessages.useQuery({
    username,
  });
  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="sticky top-16 z-50 space-y-4 bg-white py-0 pb-4 transition-all duration-75 ease-in-out dark:bg-[#121212]">
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
          <ReactTextareaAutosize
            placeholder={`Send anonymous message to @${username}`}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            disabled={sendMessageMutation.isLoading}
            required
            minRows={2}
            maxRows={10}
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isLoading}
            className="bg-slate-100"
            name="Send message"
          >
            {sendMessageMutation.isLoading ? "Loading..." : "Send"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {messages.isLoading ? (
          <>
            <div className="mx-auto mt-10 h-4 w-32 animate-pulse bg-slate-300 p-1 dark:bg-slate-700" />
            <div className="space-y-2">
              {[...Array(10)].map((_, index) => (
                <LoadingMessage key={index} isOwned={false} />
              ))}
            </div>
          </>
        ) : !messages.data?.length ? (
          <p className="text-center text-sm dark:text-slate-500">
            No replied messages
          </p>
        ) : (
          <>
            <p className="text-center dark:text-slate-300">Replied messages</p>
            <div className="space-y-2">
              {messages.data?.map((message) => (
                <PublicMessage
                  message={message}
                  key={message.id}
                  username={username}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SendMessage;
