import LandingAppbar from "@/components/LandingAppbar";

export default function Landing() {
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
