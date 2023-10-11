"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SigninForm() {
  const [loading, setLoading] = useState(false);
  //   const [signInCredentials, setSignInCredentials] = useState<{
  //     username: string;
  //     password: string;
  //     loading: boolean;
  //     error: string | null;
  //   }>({
  //     username: "",
  //     password: "",
  //     loading: false,
  //     error: null,
  //   });

  return (
    <main className="mx-auto max-w-screen-md p-4">
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await signIn("google");
          setLoading(false);
        }}
      >
        {loading && <Loader2 className="animate-spin mr-1 h-4 w-4" />}
        Sign in with Google
      </Button>

      {/* <form
        className="mx-auto flex max-w-md flex-col gap-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          //   setSignInCredentials({
          //     ...signInCredentials,
          //     loading: true,
          //     error: null,
          //   });

          //   signIn("credentials", {
          //     username: signInCredentials.username,
          //     password: signInCredentials.password,
          //     redirect: false,
          //   }).then((res) => {
          //     if (res?.ok) {
          //       router.reload();
          //     } else if (res?.error) {
          //       setSignInCredentials({
          //         ...signInCredentials,
          //         error: res.error,
          //       });
          //     }
          //   });
        }}
      >
        <h2 className="text-center text-lg font-bold">Sign in to scrtmsg.me</h2>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="username">
            Username
            <span className="pointer-events-none select-none text-red-500">
              {" "}
              *
            </span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
            disabled={signInCredentials.loading}
            value={signInCredentials.username}
            onChange={(e) =>
              setSignInCredentials({
                ...signInCredentials,
                username: e.target.value.toLowerCase(),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="password">
            Password
            <span className="pointer-events-none select-none text-red-500">
              {" "}
              *
            </span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            disabled={signInCredentials.loading}
            value={signInCredentials.password}
            onChange={(e) =>
              setSignInCredentials({
                ...signInCredentials,
                password: e.target.value,
              })
            }
          />
          <Link
            href="/forgot-password"
            className="w-fit self-end text-sm text-slate-500 dark:text-slate-300"
          >
            Forgot password?
          </Link>
        </div>
        {signInCredentials.error && (
          <p className="text-center text-red-500">{signInCredentials.error}</p>
        )}
        <button
          type="submit"
          disabled={signInCredentials.loading}
          className="flex items-center justify-center bg-slate-100"
          name="Sign in"
        >
          {signInCredentials.loading ? (
            <Spinner className="m-1 h-4 w-4" />
          ) : (
            "Sign In"
          )}
        </button>
        <p className="mt-4 text-center">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-bold">
            Sign Up here.
          </Link>
        </p>
      </form> */}
    </main>
  );
}
