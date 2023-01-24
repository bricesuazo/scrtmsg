import type { Reply, User } from "@prisma/client";
import { api } from "../utils/api";
import Moment from "react-moment";
import Spinner from "./Spinner";
import { FaTrashAlt } from "react-icons/fa";

const Reply = ({
  reply,
  refetch,
  username,
}: {
  reply: Reply;
  refetch: () => void;
  username: string;
}) => {
  const deleteReplyMutation = api.message.deleteReply.useMutation();
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div>
        <p className="text-sm">{reply.reply}</p>
        <div className="flex items-center gap-x-1">
          <p className="text-xs text-slate-400">@{username}</p>
          <p className="pointer-events-none select-none text-slate-400 dark:text-slate-600">
            ·
          </p>
          <Moment
            fromNow
            className="text-xs text-slate-400 dark:text-slate-600"
          >
            {reply.createdAt}
          </Moment>
        </div>
      </div>
      <button
        onClick={async () => {
          await deleteReplyMutation.mutateAsync({ replyId: reply.id });
          refetch();
        }}
        disabled={deleteReplyMutation.isLoading}
      >
        {deleteReplyMutation.isLoading ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <FaTrashAlt className="text-red-500 dark:text-red-800" />
        )}
      </button>
    </div>
  );
};

export default Reply;
