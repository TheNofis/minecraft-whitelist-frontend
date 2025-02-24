import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import LanguageSwitch from "@/components/LanguageSwitch";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mine And Tee",
  viewport: "width=device-width, initial-scale=1",
  description: `Присоединяйтесь к Mine And Tee

Это приватный серверу Minecraft, где вы можете наслаждаться игрой с друзьями в уютной и дружелюбной атмосфере.
Наш сервер имеет большое количество игроков, с которыми вы cможете приятно проводить время.`,
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <meta property="og:image" content="https://mineandtee.fun/logo.png" />
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground`}
      >
        <LanguageProvider>
          <ToastContainer theme="dark" autoClose={3000} />
          {children}
          <LanguageSwitch />
        </LanguageProvider>
      </body>
    </html>
  );
}
