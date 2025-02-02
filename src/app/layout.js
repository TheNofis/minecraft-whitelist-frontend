import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth System",
  description: "Authentication system with admin panel",
};

export default async function RootLayout({ children, params }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground`}
      >
        <ToastContainer theme="dark" autoClose={3000} />
        {children}
      </body>
    </html>
  );
}
