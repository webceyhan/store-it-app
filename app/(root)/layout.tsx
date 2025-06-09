import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser, signOutUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

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
        <MobileNavigation {...currentUser} signOutUser={signOutUser} />

        <Header />

        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
