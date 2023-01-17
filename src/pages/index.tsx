import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main>
      <h1>Get message from anonymous.</h1>
      <Link href="/signin">Sign in</Link>
    </main>
  );
};

export default Home;
