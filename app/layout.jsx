// app/layout.jsx
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import clsx from "clsx";
import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { Providers } from "./providers";
import ClientLayout from "./client-layout"; // Import the client layout

import { RoomProvider } from "../app/RoomContext";
import { ToastContainer } from "react-toastify";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: {
    default: "HeyGen Interactive Avatar SDK Demo",
    template: `%s - HeyGen Interactive Avatar SDK Demo`,
  },
  icons: {
    icon: "/heygen-logo.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} font-sans`}
    >
      <head />
      <body className={clsx("min-h-screen bg-background antialiased")}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <RoomProvider>
            <ClientLayout>{children}</ClientLayout>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

          </RoomProvider>
        </Providers>
      </body>
    </html>
  );
}
