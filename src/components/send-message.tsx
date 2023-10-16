"use client";

import { Dispatch, SetStateAction, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { Switch } from "./ui/switch";
import PublicMessage from "./public-message";
import { Input } from "./ui/input";
export default function SendMessage({
  username,
  setIsSent,
}: {
  username: string;
  setIsSent: Dispatch<SetStateAction<boolean>>;
}) {
  const [input, setInput] = useState<{
    message: string;
    codeName: string | null;
    isCodeNameEnable: boolean;
  }>({
    message: "",
    codeName: null,
    isCodeNameEnable: false,
  });

  // const sendMessageMutation = api.message.sendMessageToUsername.useMutation();

  // const messages = api.message.getAllPublicMessages.useQuery({
  //   username,
  // });
  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="sticky top-16 z-10 space-y-4 bg-white py-0 pb-4 transition-all duration-75 ease-in-out dark:bg-[#121212]">
        <h1 className="text-center text-xl font-bold">
          Send message to @{username}
        </h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendMessageMutation.mutateAsync({
              username,
              message: input.message,
              codeName: input.codeName,
            });
            setInput({ message: "", codeName: null, isCodeNameEnable: false });
            setIsSent(true);
          }}
          className="flex flex-col gap-y-2"
        >
          <ReactTextareaAutosize
            cacheMeasurements
            placeholder={`Send anonymous message to @${username}`}
            onChange={(e) => setInput({ ...input, message: e.target.value })}
            value={input.message}
            disabled={sendMessageMutation.isLoading}
            required
            minRows={2}
            maxRows={10}
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isLoading}
            className="bg-slate-100"
            name="Send message"
          >
            {sendMessageMutation.isLoading ? "Loading..." : "Send"}
          </button>

          {sendMessageMutation.isError && (
            <p className="text-sm text-red-500">
              {sendMessageMutation.error.message}
            </p>
          )}

          <p className="mt-2 flex items-center justify-center gap-x-2">
            <Switch
              checked={input.isCodeNameEnable}
              onCheckedChange={(checked) =>
                setInput({
                  ...input,
                  isCodeNameEnable: checked,
                })
              }
              id="codename-checkbox"
            >
              <span className="sr-only">Add code name</span>
              <span
                className={`${
                  input.isCodeNameEnable ? "translate-x-3" : "-translate-x-1"
                } inline-block h-3 w-3 transform rounded-full bg-white transition`}
              />
            </Switch>
            <label
              htmlFor="codename-checkbox"
              className={`text-sm ${
                input.isCodeNameEnable
                  ? "text-slate-900 dark:text-slate-50"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Add code name
            </label>
          </p>

          {input.isCodeNameEnable && (
            <div className="flex flex-col">
              <label htmlFor="codename">
                Add a code name
                <span className="pointer-events-none select-none text-red-500">
                  {" "}
                  *
                </span>
              </label>
              <Input
                type="text"
                id="codename"
                placeholder="Code name"
                onChange={(e) =>
                  setInput({ ...input, codeName: e.target.value })
                }
                value={input.codeName || ""}
                disabled={sendMessageMutation.isLoading}
                required={input.isCodeNameEnable}
              />
            </div>
          )}
        </form>
      </div>

      <div className="space-y-4">
        {messages.isLoading ? (
          <>
            <div className="mx-auto mt-10 h-4 w-32 animate-pulse bg-slate-300 p-1 dark:bg-slate-700" />
            <div className="space-y-2">
              {/* {[...Array(10)].map((_, index) => (
                <LoadingMessage key={index} isOwned={false} />
              ))} */}
            </div>
          </>
        ) : !messages.data?.length ? (
          <p className="text-center text-sm dark:text-slate-500">
            No replied messages
          </p>
        ) : (
          <>
            <p className="text-center dark:text-slate-300">Replied messages</p>
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