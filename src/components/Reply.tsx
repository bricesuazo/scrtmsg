import type { Reply as ReplyType } from "@prisma/client";
import { api } from "../utils/api";
import Moment from "react-moment";
import Spinner from "./Spinner";
import { FaEdit, FaEllipsisV, FaRegTrashAlt } from "react-icons/fa";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

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
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState<{
    id: string;
    reply: string;
    isOpen: boolean;
  }>({
    id: "",
    reply: "",
    isOpen: false,
  });
  return (
    <>
      <Transition appear show={deleteConfirmationModal?.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() =>
            setDeleteConfirmationModal({
              ...deleteConfirmationModal,
              isOpen: false,
            })
          }
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-slate-50 p-6 text-left align-middle transition-all dark:bg-slate-900 dark:text-white">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Delete Reply
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      Are you sure you want to delete this reply?{" "}
                      <span className="font-bold">
                        This action cannot be undone.
                      </span>
                    </p>

                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-slate-500 dark:text-slate-300">
                        Reply:
                      </p>
                      <p className="bg-slate-200 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {deleteConfirmationModal?.reply}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteConfirmationModal({
                          ...deleteConfirmationModal,
                          isOpen: false,
                        })
                      }
                      className="h-full dark:bg-slate-900"
                      disabled={deleteReplyMutation.isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="flex w-16 items-center justify-center rounded bg-red-500 p-2 text-white hover:bg-red-600 dark:bg-red-600 hover:dark:bg-red-500"
                      onClick={async () => {
                        await deleteReplyMutation.mutateAsync({
                          replyId: reply.id,
                        });
                        refetch();
                        setDeleteConfirmationModal({
                          ...deleteConfirmationModal,
                          isOpen: false,
                        });
                      }}
                      disabled={deleteReplyMutation.isLoading}
                    >
                      {deleteReplyMutation.isLoading ? (
                        <Spinner className="m-1 h-4 w-4" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
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
                {({ active }) => (
                  <button
                    className={`flex w-full items-center gap-x-2 p-2 text-left text-sm ${
                      active && "bg-slate-100"
                    }`}
                    onClick={() => {
                      setDeleteConfirmationModal({
                        isOpen: true,
                        reply: reply.reply,
                        id: reply.id,
                      });
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
    </>
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
