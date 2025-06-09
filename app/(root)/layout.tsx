import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen">
      <Sidebar />

      <section className="flex h-screen flex-1 flex-col">
        <MobileNavigation />

        <Header />

        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
