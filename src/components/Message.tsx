import { useState } from "react";
import type { Reply, Message, User } from "@prisma/client";
import { FaTelegramPlane, FaTrashAlt } from "react-icons/fa";
import Moment from "react-moment";
import { api } from "../utils/api";
import Spinner from "./Spinner";
import ReplyComponent from "./Reply";

const MessageComponent = ({
  message,
  refetch,
}: {
  message: Message & {
    replies: (Reply & {
      user: User;
    })[];
  };
  refetch: () => void;
}) => {
  const replyMutation = api.message.reply.useMutation();
  const deleteMutation = api.message.delete.useMutation();
  const [reply, setReply] = useState("");

  return (
    <div
      key={message.id}
      className="space-y-4 rounded border p-4 dark:border-slate-800"
    >
      <div className="flex items-center justify-between">
        <div>
          <p>{message.message}</p>
          <Moment
            fromNow
            className="text-xs text-slate-400 dark:text-slate-600"
          >
            {message.createdAt}
          </Moment>
        </div>
        <button
          className="p-2"
          onClick={async () => {
            await deleteMutation.mutateAsync({ id: message.id });
            refetch();
          }}
          disabled={deleteMutation.isLoading}
        >
          {deleteMutation.isLoading ? (
            <Spinner />
          ) : (
            <FaTrashAlt className="text-red-500 dark:text-red-800" />
          )}
        </button>
      </div>
      <div className="">
        {message.replies.length === 0 ? (
          <p className="text-center text-xs text-slate-500">No reply</p>
        ) : (
          message.replies.map((reply) => {
            return (
              <ReplyComponent key={reply.id} reply={reply} refetch={refetch} />
            );
          })
        )}
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
          refetch();
        }}
      >
        <input
          type="text"
          placeholder="Reply..."
          className="flex-1"
          required
          value={reply}
          disabled={replyMutation.isLoading}
          onChange={(e) => setReply(e.target.value)}
        />
        <button className="p-2" disabled={replyMutation.isLoading}>
          {replyMutation.isLoading ? (
            <Spinner />
          ) : (
            <FaTelegramPlane size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageComponent;
