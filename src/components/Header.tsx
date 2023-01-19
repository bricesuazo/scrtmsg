import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const session = useSession();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <header className="mx-auto flex max-w-screen-md justify-between px-4 py-4">
      <Link href="/">scrtmsg.me</Link>

      
      
      <div className="flex items-center gap-x-2">
        <ActionIcon onClick={() => toggleColorScheme()} title="Toggle theme">
          {colorScheme === "dark" ? <FaMoon /> : <FaSun />}
        </ActionIcon>
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
