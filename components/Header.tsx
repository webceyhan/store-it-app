import Image from "next/image";
import { signOutUser } from "@/lib/actions/user.actions";
import FileUploader from "./FileUploader";
import Search from "./Search";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader />

        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="Sign Out"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
}
