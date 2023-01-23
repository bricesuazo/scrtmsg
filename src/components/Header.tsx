import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

const Header = () => {
  const session = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="mx-auto flex max-w-screen-md items-center justify-between px-4 py-4">
      <Link href="/">
        <Image
          src="/images/scrtmsg-logo.png"
          alt="scrtmsg.me logo"
          width={32}
          height={32}
        />
      </Link>

      <div className="flex items-center gap-x-2">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="hidden sm:block"
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        {(() => {
          switch (session.status) {
            case "loading":
              return <>Loading...</>;
            case "unauthenticated":
              return <Link href="/signin">Sign in</Link>;
            case "authenticated":
              return (
                <div className="space-x-2">
                  <Link
                    href={`/${session.data.user?.username}`}
                    className="truncate text-sm sm:text-base"
                  >
                    @{session.data.user?.username}
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/signin" });
                    }}
                    className="p-3"
                  >
                    <FaSignOutAlt className="h-3 w-3" />
                  </button>
                </div>
              );
          }
        })()}
      </div>
    </header>
  );
};

export default Header;
