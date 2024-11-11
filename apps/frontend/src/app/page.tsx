"use client"

import LandingAppbar from "@/components/LandingAppbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Landing() {
  const router = useRouter();
  useEffect(() => {
    if(localStorage.getItem("token")) {
      router.push('/home');
    }

  }, [])

  return (
    <div className="flex flex-col">
      <LandingAppbar />

      <section className="py-28 bg-gradient-to-r from-purple-200 via-red-300 to-purple-600 ">
        <h1 className="text-center text-4xl text-black font-bold">
          Welcome to Metaverse
        </h1>
      </section>
    </div>
  );
}
