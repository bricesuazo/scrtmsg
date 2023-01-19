import {
  ActionIcon,
  Container,
  Flex,
  useMantineColorScheme,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const session = useSession();
  // const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <header>
      <Container>
        <Flex justify="space-between" align="center" py="md">
          <Link href="/">scrtmsg.me</Link>

          <Flex align="center" gap="md">
            <ActionIcon
              // onClick={() => toggleColorScheme()}
              title="Toggle theme"
            >
              {/* {colorScheme === "dark" ? <FaMoon /> : <FaSun />} */}
              <FaMoon />
            </ActionIcon>
            {(() => {
              switch (session.status) {
                case "loading":
                  return <>Loading...</>;
                case "unauthenticated":
                  return <Link href="/signin">Sign in</Link>;
                case "authenticated":
                  return (
                    <div>
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
          </Flex>
        </Flex>
      </Container>
    </header>
  );
};

export default Header;
