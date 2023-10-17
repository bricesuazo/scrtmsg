import { signOut } from '@/actions/auth';
import { getSession } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeToggle } from './theme-toggle';

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MoreVertical size={'1.2rem'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={session.user.username}>
                  @{session.user.username}
                </Link>
              </DropdownMenuItem>
              <form action={signOut}>
                <button type="submit" className="w-full">
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
