import "@styles/normalize.css";
import "@styles/tailwind.css";
import { Metadata } from "next";
import { ClientProviders } from "@components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "CICI Label",
  description: "Fashion of the present",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono text-white bg-black antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
