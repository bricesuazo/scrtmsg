import { useState } from "react";
import { api } from "../utils/api";
import Link from "next/link";

const SignIn = () => {
  const [signUpCredentials, setSignUpCredentials] = useState({
    username: "",
    password: "",
    email: "",
  });
  const signUpMutate = api.user.signUp.useMutation();
  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signUpMutate.mutate(signUpCredentials);
        }}
      >
        <h2>Sign Up</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={signUpCredentials.email}
          onChange={(e) =>
            setSignUpCredentials({
              ...signUpCredentials,
              email: e.target.value,
            })
          }
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={signUpCredentials.username}
          onChange={(e) =>
            setSignUpCredentials({
              ...signUpCredentials,
              username: e.target.value,
            })
          }
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={signUpCredentials.password}
          onChange={(e) =>
            setSignUpCredentials({
              ...signUpCredentials,
              password: e.target.value,
            })
          }
        />
        <button type="submit">Sign Up</button>
      </form>

      <Link href="/signin">Sign In here.</Link>
    </main>
  );
};

export default SignIn;
