import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();
  return (
    <main>
      <h1>Get message from anonymous.</h1>
    </main>
  );
};

export default Home;
