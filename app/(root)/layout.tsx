import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/user.actions";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/auth/sign-in");

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />

      <section className="flex h-screen flex-1 flex-col">
        <MobileNavigation {...currentUser} />

        <Header />

        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
