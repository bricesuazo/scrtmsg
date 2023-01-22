import { useState } from "react";
import { Message } from "@prisma/client";
import { FaTelegramPlane } from "react-icons/fa";
import Moment from "react-moment";
import { api } from "../utils/api";

const ReplyInput = ({ message }: { message: Message }) => {
  const replyMutation = api.message.reply.useMutation();
  const [reply, setReply] = useState("");

  return (
    <div
      key={message.id}
      className="space-y-4 rounded border p-4 dark:border-slate-800"
    >
      <div className="">
        <p>{message.message}</p>
        <Moment fromNow className="text-sm text-slate-400 dark:text-slate-600">
          {message.createdAt}
        </Moment>
      </div>

      <form
        className="flex items-center gap-x-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await replyMutation.mutateAsync({
            messageId: message.id,
            reply,
          });
          setReply("");
        }}
      >
        <input
          type="text"
          placeholder="Reply..."
          className="flex-1"
          required
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button className="p-2" disabled={replyMutation.isLoading}>
          {replyMutation.isLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <FaTelegramPlane size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default ReplyInput;
