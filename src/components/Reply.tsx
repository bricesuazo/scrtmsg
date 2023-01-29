import type { Reply as ReplyType } from "@prisma/client";
import { api } from "../utils/api";
import Moment from "react-moment";
import Spinner from "./Spinner";
import { FaEdit, FaEllipsisV, FaRegTrashAlt } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
const Reply = ({
  reply,
  refetch,
  username,
}: {
  reply: ReplyType;
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
      <Menu as="div" className="relative inline-block">
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right space-y-1 rounded bg-slate-50 p-2 shadow-sm dark:bg-slate-900">
            <Menu.Item disabled>
              {({ active, disabled }) => (
                <button
                  className={`${
                    active && "dark:hover:bg-slate-500"
                  } flex w-full items-center gap-x-2 p-2 text-left text-sm disabled:dark:hover:bg-slate-800`}
                  disabled={disabled}
                >
                  <FaEdit className="h-5 w-5" />{" "}
                  <span className="w-full">Edit Message (coming soon!)</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active, close }) => (
                <button
                  className={`flex w-full items-center gap-x-2 p-2 text-left text-sm ${
                    active && "bg-slate-100"
                  }`}
                  onClick={async () => {
                    await deleteReplyMutation.mutateAsync({
                      replyId: reply.id,
                    });
                    refetch();
                    close();
                  }}
                  disabled={deleteReplyMutation.isLoading}
                  name="Delete Reply"
                >
                  {deleteReplyMutation.isLoading ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <>
                      <FaRegTrashAlt className="h-4 w-4 text-red-500 dark:text-red-800" />{" "}
                      <span className="text-red-500 dark:text-red-800">
                        Delete Reply
                      </span>
                    </>
                  )}
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Reply;
