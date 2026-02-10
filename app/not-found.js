import Link from "next/link";
import localFont from "next/font/local";
import { Meteors } from "@/components/ui/meteors";
import { Nav } from "@/components/Navbar";
const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Variable.woff2",
      style: "normal",
    },
  ],
});

export default function NotFound() {
  return (
    <>
      <Nav className="z-10 sticky top-0" />
      <div
        className={`relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background ${generalSans.className}`}
      >
        <Meteors number={30} />
        <div className="z-10 text-center px-6">
          <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-black to-gray-400 dark:from-white dark:to-slate-800 pointer-events-none select-none">
            404
          </h1>
          <div className="max-w-md mx-auto -mt-4 md:-mt-8">
        
            <p className="mt-4 text-base md:text-lg text-muted-foreground text-balance">
              The page you're looking for seems to have been archived or never
              existed. Let's get your finances back on track.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <h2 className={generalSans.className}>
                <Link
                href="/"
                className={`inline-flex h-12 items-center justify-center rounded-full bg-[#1B2BB8] px-20 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1B2BB8]/90 hover:shadow-xl active:scale-95 w-full sm:w-auto ${generalSans.className}`}
              >
               Home
              </Link>
              </h2>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>
      </div>
    </>
  );
}
