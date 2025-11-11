"use client";

import Home from "./home-page";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "cicilabel.com";

export default function Page() {
  return <Home domain={DOMAIN} slug="home" />;
}
