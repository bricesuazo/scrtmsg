import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const session = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="mx-auto flex max-w-screen-md items-center justify-between px-4 py-4">
      <Link href="/">scrtmsg.me</Link>

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
                  <Link href={`/${session.data.user?.username}`}>
                    @{session.data.user?.username}
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/signin" });
                    }}
                    className="px-3 py-3 sm:px-4 sm:py-2"
                  >
                    <FaSignOutAlt className="h-4 w-4 sm:hidden" />
                    <p className="hidden sm:block">Log out</p>
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
