'use client';

import { getUserByUsername } from '@/actions/user';
import SendMessage from '@/components/send-message';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SendAnonymousMessage({
  username,
}: {
  username: string;
}) {
  const [isSent, setIsSent] = useState(false);
  const user = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUserByUsername({ username }),
  });

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
          <Button
            onClick={() => {
              setIsSent(false);
            }}
            name="Send another message"
          >
            Send another message
          </Button>
        </p>
      </div>
    );
  } else {
    return <SendMessage username={username} setIsSent={setIsSent} />;
  }
}
