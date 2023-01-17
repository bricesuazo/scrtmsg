import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [signInCredentials, setSignInCredentials] = useState({
    username: "",
    password: "",
  });
  return (
    <form
      onSubmit={() => {
        async () => {
          await signIn("credentials", signInCredentials);
        };
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
  );
};

export default SignIn;
