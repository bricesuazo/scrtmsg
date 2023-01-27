import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import * as React from "react";

export default function EmailVerification({
  username,
  token,
}: {
  username: string;
  token: string;
}) {
  const baseUrl = process.env.DOMAIN;

  return (
    <Html>
      <Head />
      <Preview>Please verify your email</Preview>
      <Section
        style={{
          backgroundColor: "#ffffff",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "20px 0 48px",
          }}
        >
          <Link href="https://scrtmsg.me/">
            <Img
              src="https://raw.githubusercontent.com/bricesuazo/scrtmsg/main/public/images/scrtmsg-logo.png"
              width="128"
              alt="Koala"
              style={{
                margin: "0 auto",
              }}
            />
          </Link>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "26px",
            }}
          >
            Hi @{username},
          </Text>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "26px",
            }}
          >
            You&apos;re almost set! Verify your email by tapping the button.
            Don&apos;t wait, this message is only valid for 3 hours.
          </Text>
          <Section
            style={{
              textAlign: "center" as const,
            }}
          >
            <Button
              pX={12}
              pY={12}
              style={{
                background:
                  "linear-gradient(138deg, rgba(167,121,223,1) 0%, rgba(59,45,228,1) 100%)",
                borderRadius: "3px",
                color: "#fff",
                fontSize: "16px",
                textDecoration: "none",
                textAlign: "center" as const,
                display: "block",
              }}
              href={`${baseUrl}/verify?token=${token}`}
            >
              Verify email
            </Button>
          </Section>

          <Container>
            <Text>
              or copy and paste this URL into your browser:
              <br />
              <Link href={`${baseUrl}/verify?token=${token}`}>
                {baseUrl}/verify?token={token}
              </Link>
            </Text>
          </Container>
          <Text
            style={{
              fontSize: "16px",
              lineHeight: "26px",
            }}
          >
            Best,
            <br />
            Brice Suazo - Creator of scrtmsg.me
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
