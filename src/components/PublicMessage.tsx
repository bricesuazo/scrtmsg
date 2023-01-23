import type { Message, Reply, User } from "@prisma/client";
import Moment from "react-moment";

const PublicMessage = ({
  message,
  username,
}: {
  message: Message & {
    replies: (Reply & {
      user: User;
    })[];
  };
  username: string;
}) => {
  return (
    <div className="rounded border p-4 dark:border-slate-800">
      <p>{message.message}</p>
      <p className="text-xs text-slate-400">Anonymous</p>
      <Moment fromNow className="text-xs text-slate-400 dark:text-slate-600">
        {message.createdAt}
      </Moment>

      {message.replies.map((reply) => {
        return (
          <div key={reply.id} className="px-4 py-2">
            <p>{reply.reply}</p>
            <p className="text-xs text-slate-400">@{username}</p>
            <Moment
              fromNow
              className="text-xs text-slate-400 dark:text-slate-600"
            >
              {reply.createdAt}
            </Moment>
          </div>
        );
      })}
    </div>
  );
};

export default PublicMessage;
