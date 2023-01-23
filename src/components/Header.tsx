import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FaDesktop, FaMoon, FaSignOutAlt, FaSun } from "react-icons/fa";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Spinner from "./Spinner";

const Header = () => {
  const session = useSession();
  const { theme, setTheme } = useTheme();

  const Icon = () => {
    switch (theme) {
      case "light":
        return <FaSun className="h-3 w-3" />;
      case "dark":
        return <FaMoon className="h-3 w-3" />;
      case "system":
        return <FaDesktop className="h-3 w-3" />;
      default:
        return <FaDesktop className="h-3 w-3" />;
    }
  };

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
        {/* <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="hidden sm:block"
        >
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select> */}
        <Menu
          as="div"
          className="relative inline-block text-left transition-colors"
        >
          <Menu.Button as={Fragment}>
            {({ open }) => (
              <button
                className={`${
                  open ? "bg-slate-50" : "bg-transparent hover:bg-slate-50"
                } rounded-full bg-transparent p-3 transition-colors dark:bg-transparent`}
              >
                <Icon />
              </button>
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 flex origin-top-right flex-col gap-y-1 rounded bg-slate-50 p-2 dark:bg-slate-900">
              {[
                {
                  title: "system",
                  icon: <FaDesktop />,
                },
                { title: "dark", icon: <FaMoon /> },
                { title: "light", icon: <FaSun /> },
              ].map((theme) => (
                <Menu.Item key={theme.title}>
                  {({ active }) => (
                    <button
                      className={`${
                        active && "bg-blue-500"
                      } flex w-24 items-center gap-x-2 rounded bg-transparent p-2 text-slate-500 dark:bg-transparent dark:text-slate-300`}
                      onClick={() => setTheme(theme.title)}
                    >
                      {theme.icon}
                      {theme.title.charAt(0).toLocaleUpperCase() +
                        theme.title.slice(1)}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        {(() => {
          switch (session.status) {
            case "loading":
              return (
                <div className="item item flex w-12 items-center justify-center">
                  <Spinner />
                </div>
              );
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
