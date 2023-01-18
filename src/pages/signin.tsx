import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const SignIn = () => {
  const [signInCredentials, setSignInCredentials] = useState({
    username: "",
    password: "",
  });

  const { data } = useSession();
  return (
    <main>
      <form
        onSubmit={() => {
          signIn("credentials", { ...signInCredentials, callbackUrl: "/" });
        }}
      >
        <h2>Sign In</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={signInCredentials.username}
          onChange={(e) =>
            setSignInCredentials({
              ...signInCredentials,
              username: e.target.value,
            })
          }
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={signInCredentials.password}
          onChange={(e) =>
            setSignInCredentials({
              ...signInCredentials,
              password: e.target.value,
            })
          }
        />
        <button type="submit">Sign In</button>
      </form>
      {data && (
        <button
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </button>
      )}
      <Link href="/signup">Sign Up here.</Link>
    </main>
  );
};

export default SignIn;
