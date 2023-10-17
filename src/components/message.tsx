'use client';

import { deleteMessage, replyMessage } from '@/actions/message';
import ReplyComponent from '@/components/reply';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Message, Reply } from '@/db/schema';
import { useMutation } from '@tanstack/react-query';
import { Edit, Loader2, MoreVertical, Send, Trash } from 'lucide-react';
import { useState } from 'react';
import Moment from 'react-moment';

import { Button } from './ui/button';
import { Input } from './ui/input';

export default function MessageComponent({
  message,
  refetch,
  username,
}: {
  message: Message & {
    replies: Reply[];
  };
  refetch: () => void;
  username: string;
}) {
  const replyMutation = useMutation({
    mutationKey: ['replyMessage', message.id],
    mutationFn: ({ messageId, reply }: { messageId: string; reply: string }) =>
      replyMessage({ messageId, reply }),
  });
  const deleteMutation = useMutation({
    mutationKey: ['deleteMessage', message.id],
    mutationFn: ({ messageId }: { messageId: string }) =>
      deleteMessage({ messageId }),
    onSuccess: () => {
      refetch();
      setDeleteConfirmationModal({
        ...deleteConfirmationModal,
        isOpen: false,
      });
    },
  });
  const [reply, setReply] = useState('');
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState<{
    id: string;
    message: string;
    isOpen: boolean;
  }>({
    id: '',
    message: '',
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Are you sure you want to delete this message? This action will
                also delete all replies to this message.{' '}
                <span className="font-bold">This action cannot be undone.</span>
              </p>

              <div className="mt-2 space-y-1 text-sm">
                <p className="text-slate-500 dark:text-slate-300">Message:</p>
                <p className="bg-slate-200 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {deleteConfirmationModal?.message}
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
              disabled={deleteMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate({
                  messageId: message.id,
                });
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="animate-spin m-1 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div key={message.id} className="space-y-2 rounded border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p>{message.message}</p>
            <div className="flex items-center gap-x-1">
              <p className="text-xs text-slate-400">
                {message.codeName || 'Anonymous'}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MoreVertical size="1.25rem" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Message</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="gap-x-2 truncate">
                <Edit className="h-4 w-4" />
                <span>Edit Message (Soon!)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteConfirmationModal({
                    id: message.id,
                    message: message.message,
                    isOpen: true,
                  });
                }}
                disabled={deleteMutation.isPending}
                className="gap-x-2 truncate"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4" />
                ) : (
                  <>
                    <Trash className="h-4 w-4 text-red-500 dark:text-red-800" />
                    <span className="text-red-500 dark:text-red-800">
                      Delete Message
                    </span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            setReply('');
            refetch();
          }}
        >
          <Input
            type="text"
            placeholder="Reply..."
            className="w-full"
            required
            value={reply}
            disabled={replyMutation.isPending}
            onChange={(e) => setReply((e.target as any).value)}
          />
          <Button
            size="icon"
            className="p-2"
            disabled={replyMutation.isPending}
            name="Send reply"
          >
            {replyMutation.isPending ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
