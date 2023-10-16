"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import SendMessage from "./send-message";

export default function SendAnonymousMessage({
  username,
}: {
  username: string;
}) {
  const [isSent, setIsSent] = useState(false);
  //   const user = api.user.getUserByUsername.useQuery({ username });

  if (user.isLoading) {
    return (
      <div className="flex h-screen justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user.isError) {
    return <div>{user.error.message}</div>;
  }

  if (!user.data) {
    return <h1 className="text-center text-xl text-red-500">User not found</h1>;
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-center text-xl font-bold">
          Message sent to @{username}
        </h1>
        <p>
          <button
            onClick={() => {
              setIsSent(false);
            }}
            name="Send another message"
          >
            Send another message
          </button>
        </p>
      </div>
    );
  } else {
    return <SendMessage username={username} setIsSent={setIsSent} />;
  }
}
