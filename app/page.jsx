import { auth } from "@/auth";
import DummyClient from "@/components/dummy";
import Navbar from "@/components/Navbar";
export default async function Home() {
  const session = await auth();

  return (
    <main className="p-10">
      <DummyClient session={session} />
      <h1 className="text-4xl shadow-inner font-bold">Initialising the frontend of the website!</h1>
    </main>
  );
}
