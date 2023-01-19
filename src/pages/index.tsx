import { Container, Title } from "@mantine/core";
import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main>
      <Container>
        <Title order={1} align="center">
          Get message from anonymous.
        </Title>
      </Container>
    </main>
  );
};

export default Home;
