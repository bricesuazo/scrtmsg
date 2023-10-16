"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import LoadingMessage from "./loading-message";
import MessageComponent from "./message";
import { useQuery } from "@tanstack/react-query";
import { getAllMessagesWithReplies } from "@/actions/user";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export default function MyMessages({ username }: { username: string }) {
  const messages = useQuery({
    queryKey: ["messages", username],
    queryFn: () => getAllMessagesWithReplies({ username }),
  });
  const [isCopied, setIsCopied] = useState(false);

  const copyUsername = (username: string) => {
    (navigator as any).clipboard.writeText(`scrtmsg.me/${username}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-y-2 max-w-screen-md mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Input
            type="text"
            value={isCopied ? "Copied" : `scrtmsg.me/${username}`}
            className="truncate"
            readOnly
            onClick={() => copyUsername(username)}
            disabled={isCopied}
          />
          <Button
            className="hidden sm:flex"
            onClick={() => copyUsername(username)}
            disabled={isCopied}
            size="icon"
            variant="secondary"
          >
            {!isCopied ? <Copy size="1rem" /> : <Check size="1rem" />}
          </Button>
        </div>
        <Button
          onClick={() => messages.refetch()}
          disabled={messages.isLoading || messages.isRefetching}
          variant="outline"
        >
          <RefreshCw
            className={cn(
              "w-4 sm:mr-1",
              (messages.isLoading || messages.isRefetching) && "animate-spin"
            )}
          />

          <p className="hidden sm:block">Refresh</p>
        </Button>
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
