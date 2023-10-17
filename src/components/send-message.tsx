'use client';

import { sendMessageToUsername } from '@/actions/message';
import { getAllPublicMessages } from '@/actions/user';
import LoadingMessage from '@/components/loading-message';
import PublicMessage from '@/components/public-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { sendAnonymousMessageSchema } from '@/lib/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

export default function SendMessage({ username }: { username: string }) {
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof sendAnonymousMessageSchema>>({
    resolver: zodResolver(sendAnonymousMessageSchema),
    defaultValues: {
      message: '',
      codeName: null,
      isCodeNameEnable: false,
    },
  });

  const sendMessageMutation = useMutation({
    mutationKey: ['sendMessage', username],
    mutationFn: ({
      username,
      message,
      codeName,
    }: {
      username: string;
      message: string;
      codeName: string | null;
    }) =>
      sendMessageToUsername({
        username,
        message,
        codeName,
      }),
    onSuccess: async () => {
      await messages.refetch();
      form.reset();
      setIsSent(true);
    },
  });

  const messages = useQuery({
    queryKey: ['messages', username],
    queryFn: () => getAllPublicMessages({ username }),
  });

  function onSubmit(values: z.infer<typeof sendAnonymousMessageSchema>) {
    sendMessageMutation.mutate({
      username,
      message: values.message,
      codeName: values.codeName,
    });
  }
  return (
    <div className="space-y-8">
      {isSent ? (
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
      ) : (
        <div className="space-y-4 py-0 pb-4 transition-all duration-75 ease-in-out">
          <h1 className="text-center text-xl font-bold">
            Send message to @{username}
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Send anonymous message to @${username}`}
                        {...field}
                        disabled={sendMessageMutation.isPending}
                        required
                        rows={4}

                        // maxRows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={sendMessageMutation.isPending}
                name="Send message"
              >
                {sendMessageMutation.isPending ? 'Loading...' : 'Send'}
              </Button>

              {sendMessageMutation.isError && (
                <p className="text-sm text-red-500">
                  {sendMessageMutation.error.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="isCodeNameEnable"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-x-2 justify-center">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        >
                          <span className="sr-only">Add code name</span>
                          <span
                            className={`${
                              form.getValues().isCodeNameEnable
                                ? 'translate-x-3'
                                : '-translate-x-1'
                            } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </FormControl>
                      <FormLabel>Add code name</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.getValues().isCodeNameEnable && (
                <FormField
                  control={form.control}
                  name="codeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Code name
                        <span className="pointer-events-none select-none text-red-500">
                          {' '}
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code name"
                          disabled={sendMessageMutation.isPending}
                          required={form.getValues().isCodeNameEnable}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>
      )}

      <div className="space-y-4">
        {messages.isLoading ? (
          <>
            <div className="mx-auto mt-10 h-4 w-32 animate-pulse bg-slate-300 p-1 dark:bg-slate-700" />
            <div className="space-y-2">
              {[...Array(10)].map((_, index) => (
                <LoadingMessage key={index} isOwned={false} />
              ))}
            </div>
          </>
        ) : !messages.data?.length ? (
          <p className="text-center text-sm dark:text-slate-500">
            No replied messages
          </p>
        ) : (
          <>
            <p className="text-center text-muted-foreground text-xs">
              Messages
            </p>
            <div className="space-y-2">
              {messages.data?.map((message) => (
                <PublicMessage
                  message={message}
                  key={message.id}
                  username={username}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
