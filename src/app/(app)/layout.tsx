import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-100 flex flex-row max-lg:flex-col min-h-screen">
      <Sidebar />
      {/* Main content */}
      <div className="m-4 flex flex-col flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
