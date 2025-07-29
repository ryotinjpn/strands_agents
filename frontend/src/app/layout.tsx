import type { Metadata } from "next";
import ThemeProvider from '../components/ThemeProvider';

export const metadata: Metadata = {
  title: "となりのぽっぽくん",
  description: "AIアシスタント となりのぽっぽくん",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
