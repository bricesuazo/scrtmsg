import { useState } from "react";
import { api } from "../utils/api";
import Link from "next/link";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";

const SignIn = () => {
  const [signUpCredentials, setSignUpCredentials] = useState({
    username: "",
    password: "",
    email: "",
  });
  const signUpMutate = api.user.signUp.useMutation();
  return (
    <main >
      <form
       
        onSubmit={(e) => {
          e.preventDefault();
          signUpMutate.mutate(signUpCredentials);
        }}
      >
        <h2 >Sign up to scrtmsg.me</h2>

        <div >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={signUpCredentials.email}
            onChange={(e) =>
              setSignUpCredentials({
                ...signUpCredentials,
                email: e.target.value,
              })
            }
            disabled={signUpMutate.isLoading}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
            value={signUpCredentials.username}
            onChange={(e) =>
              setSignUpCredentials({
                ...signUpCredentials,
                username: e.target.value,
              })
            }
            disabled={signUpMutate.isLoading}
          />
        </div>

        <div >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            value={signUpCredentials.password}
            onChange={(e) =>
              setSignUpCredentials({
                ...signUpCredentials,
                password: e.target.value,
              })
            }
            disabled={signUpMutate.isLoading}
          />
        </div>
        <button type="submit" disabled={signUpMutate.isLoading}>
          {signUpMutate.isLoading ? "Loading..." : "Sign Up"}
        </button>
        <p >
          Already have an account?{" "}
          <Link href="/signin">
            Sign In here.
          </Link>
        </p>
      </form>
    </main>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(context);

  if (session && session.user) {
    return {
      redirect: {
        destination: `/${session.user.username}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
