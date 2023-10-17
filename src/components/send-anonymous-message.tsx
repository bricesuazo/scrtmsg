'use client';

import { getUserByUsername } from '@/actions/user';
import SendMessage from '@/components/send-message';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function SendAnonymousMessage({
  username,
  isImTheUsername,
}: {
  username: string;
  isImTheUsername: boolean;
}) {
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

  return <SendMessage username={username} isImTheUsername={isImTheUsername} />;
}
