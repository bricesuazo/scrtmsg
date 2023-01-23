import type { Reply, User } from "@prisma/client";
import { api } from "../utils/api";
import Moment from "react-moment";
import Spinner from "./Spinner";
import { FaTrashAlt } from "react-icons/fa";

const Reply = ({
  reply,
  refetch,
}: {
  reply: Reply & {
    user: User;
  };
  refetch: () => void;
}) => {
  const deleteReplyMutation = api.message.deleteReply.useMutation();
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div>
        <p className="text-sm">{reply.reply}</p>
        <p className="text-xs text-slate-400 dark:text-slate-600">
          <Moment fromNow>{reply.createdAt}</Moment>
        </p>
      </div>
      <button
        onClick={async () => {
          await deleteReplyMutation.mutateAsync({ id: reply.id });
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
