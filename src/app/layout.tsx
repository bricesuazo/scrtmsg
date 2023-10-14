import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Header from "@/components/header";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const runtime = "edge";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "scrtmsg.me | Get message from anonymous.",
  description: "Get message from anonymous.",
  metadataBase: new URL("https://scrtmsg.me/"),
  openGraph: {
    type: "website",
    url: "https://scrtmsg.me/api/og",
    title: "scrtmsg.me | Get message from anonymous.",
    description: "Get message from anonymous.",
    images: [
      {
        url: "https://scrtmsg.me/og.png",
        width: 1200,
        height: 630,
        alt: "scrtmsg.me | Get message from anonymous.",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  console.log("🚀 ~ file: layout.tsx:39 ~ session:", session);

  // if (session && session) redirect("/welcome");

  return (
    <html lang="en">
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="sticky top-0 z-20">
            <Header />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
