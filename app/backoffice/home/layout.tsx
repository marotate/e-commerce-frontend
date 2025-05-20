import "../../globals.css";
import { SideBar } from "./components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="flex gap-2">
          <SideBar />
          <div className="flex-1">{children}</div>
        </div>
  );
}
