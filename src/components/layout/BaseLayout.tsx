import { Quicksand } from "next/font/google";
const quicksand = Quicksand({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: LayoutProps) {
  return (
    <main className={`w-full min-h-screen ${quicksand.className} text-white`}>
      {children}
    </main>
  );
}
