import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const session = useSession();
  return (
    <header className="mx-auto flex max-w-screen-md justify-between px-4 py-4">
      <Link href="/">scrtmsg.me</Link>

      <div className="">
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
                      signOut();
                    }}
                  >
                    Log out
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
