import type { Message, Reply, User } from "@prisma/client";
import Moment from "react-moment";

const PublicMessage = ({
  message,
  username,
}: {
  message: Message & {
    replies: Reply[];
  };
  username: string;
}) => {
  return (
    <div className="rounded border p-4 dark:border-slate-800">
      <p>{message.message}</p>
      <div className="flex items-center gap-x-1">
        <p className="text-xs text-slate-400">Anonymous</p>
        <p className="text-slate-400 dark:text-slate-600">·</p>
        <Moment fromNow className="text-xs text-slate-400 dark:text-slate-600">
          {message.createdAt}
        </Moment>
      </div>

      {message.replies.map((reply) => {
        return (
          <div key={reply.id} className="px-4 py-2">
            <p>{reply.reply}</p>
            <div className="flex items-center gap-x-1">
              <p className="text-xs text-slate-400">@{username}</p>
              <p className="text-slate-400 dark:text-slate-600">·</p>
              <Moment
                fromNow
                className="text-xs text-slate-400 dark:text-slate-600"
              >
                {reply.createdAt}
              </Moment>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PublicMessage;
