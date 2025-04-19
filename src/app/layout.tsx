import Sidebar from "./components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex flex-row max-lg:flex-col min-h-screen">
        <Sidebar />
        {/* Main content */}
        <main className="m-4 flex-1">{children}</main>
      </body>
    </html>
  );
}
