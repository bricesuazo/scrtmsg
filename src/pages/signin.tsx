import { signIn } from "next-auth/react";
import Link from "next/link";
import { getServerAuthSession } from "../server/auth";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  Button,
  Container,
  Title,
  TextInput,
  PasswordInput,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FaAt, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) =>
        value.length < 3 ? "Username must be at least 3 characters long" : null,
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 characters long" : null,
    },
  });
  return (
    <main>
      <Container size="xs">
        <form
          onSubmit={form.onSubmit((values) =>
            signIn("credentials", {
              username: values.username,
              password: values.password,
            })
          )}
        >
          <Title align="center">Sign in to scrtmsg.me</Title>
          <TextInput
            withAsterisk
            label="Username"
            placeholder="bricesuazo"
            icon={<FaAt />}
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            icon={<FaLock />}
            {...form.getInputProps("password")}
            visibilityToggleIcon={({ reveal }) =>
              reveal ? <FaRegEyeSlash /> : <FaRegEye />
            }
          />
          <Flex justify="space-between">
            <Button type="submit" mt="sm">
              Sign In
            </Button>
            <Link href="/signup" className="font-bold">
              <Button mt="sm" variant="subtle">
                Create account
              </Button>
            </Link>
          </Flex>
        </form>
      </Container>
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
