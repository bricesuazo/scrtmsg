import { Fragment, useState } from "react";
import type { Reply, Message } from "@prisma/client";
import { FaEllipsisV, FaRegTrashAlt, FaTelegramPlane } from "react-icons/fa";
import Moment from "react-moment";
import { api } from "../utils/api";
import Spinner from "./Spinner";
import ReplyComponent from "./Reply";
import { Menu, Transition } from "@headlessui/react";

const MessageComponent = ({
  message,
  refetch,
  username,
}: {
  message: Message & {
    replies: Reply[];
  };
  refetch: () => void;
  username: string;
}) => {
  const replyMutation = api.message.reply.useMutation();
  const deleteMutation = api.message.delete.useMutation();
  const [reply, setReply] = useState("");

  return (
    <div
      key={message.id}
      className="space-y-2 rounded border p-4 dark:border-slate-800"
    >
      <div className="flex items-center justify-between">
        <div>
          <p>{message.message}</p>
          <div className="flex items-center gap-x-1">
            <p className="text-xs text-slate-400">
              {message.codeName || "Anonymous"}
            </p>
            <p className="pointer-events-none select-none text-slate-400 dark:text-slate-600">
              ·
            </p>
            <Moment
              fromNow
              className="text-xs text-slate-400 dark:text-slate-600"
            >
              {message.createdAt}
            </Moment>
          </div>
        </div>

        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="bg-slate-100 p-2 text-slate-400 hover:bg-slate-200">
            <FaEllipsisV />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded bg-slate-50 p-2 shadow-sm dark:bg-slate-900">
              <Menu.Item>
                {({ active, close }) => (
                  <button
                    className={`flex w-full items-center gap-x-2 p-2 text-left text-sm ${
                      active && "bg-slate-100"
                    }`}
                    onClick={async () => {
                      await deleteMutation.mutateAsync({ id: message.id });
                      refetch();
                      close();
                    }}
                    disabled={deleteMutation.isLoading}
                    name="Delete message"
                  >
                    {deleteMutation.isLoading ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <>
                        <FaRegTrashAlt className="h-4 w-4 text-red-500 dark:text-red-800" />{" "}
                        <span className="text-red-500 dark:text-red-800">
                          Delete Message
                        </span>
                      </>
                    )}
                  </button>
                )}
              </Menu.Item>
              {/* <Menu.Item disabled>
                <button
                  className="flex w-full items-center gap-x-2 p-2 text-left text-sm"
                  disabled
                >
                  <FaEdit className="h-4 w-4" />{" "}
                  <span>Edit Message (coming soon!)</span>
                </button>
              </Menu.Item> */}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div>
        {message.replies.length === 0 ? (
          <p className="text-center text-xs text-slate-500">No reply</p>
        ) : (
          message.replies.map((reply) => {
            return (
              <ReplyComponent
                key={reply.id}
                reply={reply}
                username={username}
                refetch={refetch}
              />
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
          className="w-full"
          required
          value={reply}
          disabled={replyMutation.isLoading}
          onChange={(e) => setReply(e.target.value)}
        />
        <button
          className="p-2"
          disabled={replyMutation.isLoading}
          name="Send reply"
        >
          {replyMutation.isLoading ? (
            <Spinner className="h-5 w-5" />
          ) : (
            <FaTelegramPlane size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageComponent;
