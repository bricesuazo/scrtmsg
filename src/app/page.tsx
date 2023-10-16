import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getSession } from "@/auth";

export default async function Home() {
  const session = await getSession();

  if (session)
    return (
      <>
        <main></main>
      </>
    );

  return (
    <>
      <main className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-screen-md flex-col items-center justify-center p-4">
        <section>
          <div className="relative mx-auto h-36 w-36 sm:h-48 sm:w-48">
            <Image src="/logo.png" alt="scrtmsg logo" fill sizes="100%" />
          </div>
          <div className="space-y-2 sm:space-y-4">
            <h1 className="text-center text-4xl font-bold sm:text-5xl">
              scrtmsg.me
            </h1>
            <p className="text-center">Get message from anonymous.</p>
            <div className="mx-auto flex w-fit items-center gap-x-4">
              <Link href="/sign-in">
                <button
                  className="rounded-full bg-gradient-to-br from-[#a678df] via-[#3b2de4] to-[#a678df] bg-size-200 bg-pos-0 px-8 py-2 font-bold text-white transition-all duration-1000 hover:bg-pos-100"
                  name="Sign up"
                >
                  Sign up
                </button>
              </Link>
              <Link
                href="https://github.com/bricesuazo/scrtmsg"
                target="_blank"
                className="rounded-full border border-transparent p-2 transition-all hover:border-slate-200 hover:opacity-75 dark:hover:border-slate-700"
              >
                <Github size={22} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p className="p-4 text-center text-slate-500 dark:text-slate-700">
          scrtmsg.me | © {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
