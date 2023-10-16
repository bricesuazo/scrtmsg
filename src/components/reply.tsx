'use client';

import { deleteReply } from '@/actions/reply';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Reply as ReplyType } from '@/db/schema';
import { useMutation } from '@tanstack/react-query';
import { Edit, Loader2, MoreVertical, Trash } from 'lucide-react';
import { useState } from 'react';
import Moment from 'react-moment';

export default function Reply({
  reply,
  refetch,
  username,
}: {
  reply: ReplyType;
  refetch: () => void;
  username: string;
}) {
  const deleteReplyMutation = useMutation({
    mutationKey: ['deleteReply', reply.id],
    mutationFn: ({ replyId }: { replyId: string }) => deleteReply({ replyId }),
  });
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState<{
    id: string;
    reply: string;
    isOpen: boolean;
  }>({
    id: '',
    reply: '',
    isOpen: false,
  });
  return (
    <>
      <AlertDialog
        open={deleteConfirmationModal.isOpen}
        onOpenChange={(open) =>
          setDeleteConfirmationModal({
            ...deleteConfirmationModal,
            isOpen: open,
          })
        }
      >
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reply</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Are you sure you want to delete this reply?{' '}
                <span className="font-bold">This action cannot be undone.</span>
              </p>

              <div className="mt-2 space-y-1 text-sm">
                <p className="text-slate-500 dark:text-slate-300">Reply:</p>
                <p className="bg-slate-200 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {deleteConfirmationModal?.reply}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setDeleteConfirmationModal({
                  ...deleteConfirmationModal,
                  isOpen: false,
                })
              }
              disabled={deleteReplyMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
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
              disabled={deleteReplyMutation.isPending}
            >
              {deleteReplyMutation.isPending && (
                <Loader2 className="m-1 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button disabled>
                <Edit className="h-5 w-5" />{' '}
                <span className="w-full">Edit Message (coming soon!)</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteConfirmationModal({
                  isOpen: true,
                  reply: reply.reply,
                  id: reply.id,
                });
              }}
              disabled={deleteReplyMutation.isPending}
            >
              {deleteReplyMutation.isPending ? (
                <Loader2 className="h-5 w-5" />
              ) : (
                <>
                  <Trash className="h-4 w-4 text-red-500 dark:text-red-800" />{' '}
                  <span className="text-red-500 dark:text-red-800">
                    Delete Reply
                  </span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
