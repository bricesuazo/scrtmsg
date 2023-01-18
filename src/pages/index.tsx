import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Home: NextPage = () => {
  const session = useSession();
  return (
    <main>
      <h1>Get message from anonymous.</h1>
      <Link href="/signin">Sign in</Link>
      {session.status === "authenticated" && (
        <button
          onClick={() => {
            signOut();
          }}
        >
          Log out
        </button>
      )}
    </main>
  );
};

export default Home;
