"use client";

import { Check, Copy, Loader2, Undo2 } from "lucide-react";
import { useState } from "react";
import LoadingMessage from "./loading-message";
import MessageComponent from "./message";

export default function MyMessages({ username }: { username: string }) {
  const messages = api.message.getAllMessagesWithReplies.useQuery();
  const [isCopied, setIsCopied] = useState(false);

  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(`scrtmsg.me/${username}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-shrink-0 items-center gap-x-2">
          <input
            type="text"
            value={isCopied ? "Copied" : `scrtmsg.me/${username}`}
            className="truncate"
            readOnly
            onClick={() => copyUsername(username)}
            disabled={isCopied}
          />
          <button
            className="hidden p-3 sm:block"
            onClick={() => copyUsername(username)}
            disabled={isCopied}
            name="Copy username"
          >
            {!isCopied ? (
              <Copy size={12} className="dark:text-slate-200" />
            ) : (
              <Check size={12} className="dark:text-slate-200" />
            )}
          </button>
        </div>
        <button
          onClick={() => messages.refetch()}
          disabled={messages.isRefetching}
          className="flex w-auto items-center justify-center sm:w-20"
          name="Refresh"
        >
          {messages.isRefetching ? (
            <Loader2 className="m-1 h-4 w-3 animate-spin" />
          ) : (
            <>
              <div className="p-1 sm:hidden">
                <Undo2 className="w-3 dark:text-slate-300" />
              </div>
              <p className="hidden sm:block">Refresh</p>
            </>
          )}
        </button>
      </div>
      {messages.isLoading ? (
        <>
          {[...Array(10)].map((_, index) => (
            <LoadingMessage key={index} isOwned={true} />
          ))}
        </>
      ) : messages.data?.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No message</p>
      ) : (
        messages.data?.map((message) => (
          <MessageComponent
            message={message}
            key={message.id}
            refetch={messages.refetch}
            username={username}
          />
        ))
      )}
    </div>
  );
}
