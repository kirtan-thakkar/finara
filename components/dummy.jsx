"use client";

import { signIn, signOut } from "next-auth/react";

export default function DummyClient({ session }) {
  return (
    <div>
      {session?.user ? (
        <>
          <h1>Welcome, {session.user.name}</h1>
          <h2>Email: {session.user.email}</h2>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1>Not signed in</h1>
          <p>Please sign in</p>

          <button
            onClick={() => signIn("google")}
            className="bg-[#4285F4] text-white px-4 py-2 rounded-lg"
          >
            Sign In
          </button>
        </>
      )}
    </div>
  );
}
