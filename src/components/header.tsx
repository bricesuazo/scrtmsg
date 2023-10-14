import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { LogOut } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Button } from "./ui/button";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="mx-auto flex max-w-screen-md items-center justify-between px-4 py-4">
      <Link href="/">
        <Image src="/logo.png" alt="scrtmsg.me logo" width={32} height={32} />
      </Link>

      <div className="flex items-center gap-x-2">
        <ThemeToggle />
        {!session ? (
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        ) : (
          <div className="space-x-2">
            <Link
              href={`/${session.user.id}`}
              className="truncate text-sm sm:text-base"
            >
              @{session.user.id}
            </Link>
            <form action="/api/auth/logout" method="post">
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
