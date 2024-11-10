import Link from "next/link";
import { Button } from "./ui/button";

export default function Appbar() {
  return (
    <div className="h-16 bg-purple-400 p-6 flex justify-between items-center">
      <div className="font-bold text-xl">
        Meta<span className="text-red-500">Verse</span>
      </div>
      <div className="flex gap-4">
        <Button>
          <Link href={"/auth/signin"}>Login</Link>
        </Button>
        <Button>
          <Link href={"auth/signup"}>Signup</Link>
        </Button>
      </div>
    </div>
  );
}
