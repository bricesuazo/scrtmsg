import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const OpenSansBold = fetch(
  new URL("../../../public/font/OpenSans-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const OpenSansRegular = fetch(
  new URL("../../../public/font/OpenSans-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const OpenSansBoldData = await OpenSansBold;
  const OpenSansRegularData = await OpenSansRegular;

  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");
  if (username) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundImage: "linear-gradient(135deg, #a578dd, #3c2de3)",
            fontFamily: "OpenSans-Regular",
            color: "#eee",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#eee",
              borderRadius: "100%",
              padding: "2rem",
            }}
          >
            <img
              width="128"
              height="128"
              src="https://raw.githubusercontent.com/bricesuazo/scrtmsg/main/public/images/scrtmsg-logo.png"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "-1rem",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: 42,
                fontFamily: "OpenSans-Regular",
                fontWeight: 200,
              }}
            >
              Send anonymous message to
            </h1>
            <h1 style={{ fontSize: 58 }}>@{username}</h1>
            <p
              style={{
                fontSize: 24,
                fontFamily: "OpenSans-Regular",
                fontWeight: 200,
              }}
            >
              scrtmsg.me
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: "OpenSans-Bold",
            data: OpenSansBoldData,
            style: "normal",
            weight: 500,
          },
          {
            name: "OpenSans-Regular",
            data: OpenSansRegularData,
            style: "normal",
            weight: 200,
          },
        ],
      }
    );
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "linear-gradient(135deg, #a578dd, #3c2de3)",
          fontFamily: "OpenSans-Regular",
          color: "#eee",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#eee",
            borderRadius: "100%",
            padding: "2rem",
          }}
        >
          <img
            width="128"
            height="128"
            src="https://raw.githubusercontent.com/bricesuazo/scrtmsg/main/public/images/scrtmsg-logo.png"
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "-1rem",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: 64 }}>scrtmsg.me</h1>
          <p
            style={{
              fontSize: 18,
              fontFamily: "OpenSans-Regular",
              fontWeight: 200,
            }}
          >
            Get message from anonymous.
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "OpenSans-Bold",
          data: OpenSansBoldData,
          style: "normal",
          weight: 500,
        },
        {
          name: "OpenSans-Regular",
          data: OpenSansRegularData,
          style: "normal",
          weight: 200,
        },
      ],
    }
  );
}
