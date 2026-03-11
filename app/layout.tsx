import "./globals.css";
 import { Navbar } from "@/app/components/navbar";
import ForceNavbarRefresh from "@/app/components/force-navbar-refresh";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <ForceNavbarRefresh />
        {children}
      </body>
    </html>
  );
}
