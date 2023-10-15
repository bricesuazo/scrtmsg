import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { LogOut } from "lucide-react";
import { getSession } from "@/auth";
import { Button } from "./ui/button";
import { signOut } from "@/actions/auth";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="mx-auto flex max-w-screen-md items-center justify-between p-4">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="scrtmsg.me logo"
          className="min-w-min"
          width={32}
          height={32}
        />
      </Link>

      <div className="flex items-center gap-x-2">
        <ThemeToggle />
        {!session ? (
          <>
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="default">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </>
        ) : (
          <div className="space-x-2">
            <Link
              href={`/${session.user.username}`}
              className="truncate text-sm sm:text-base"
            >
              @{session.user.username}
            </Link>
            <form action={signOut}>
              <Button type="submit" className="p-3">
                <LogOut className="h-3 w-3" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
