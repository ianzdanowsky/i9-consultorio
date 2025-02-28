import "~/styles/globals.css";
import { Providers } from "./providers";
import { auth } from "~/server/auth/index";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster"

export const metadata: Metadata = {
  title: process.env.CUSTOMER_NAME,
  description: process.env.CUSTOMER_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const session = await auth();

  return (
    <Providers session={session}>
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
    </Providers>
  );
}
