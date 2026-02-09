import { Outfit } from "next/font/google";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import localFont from "next/font/local";
const outfit = Outfit({
  subsets: ["latin"],
});
const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  weight: "100 900",
  style: "normal",
});
const FifthScreen = () => {
  return (
    <div className="h-[600px] mt-[-30] flex flex-col gap-12">
      <div className="grow flex items-center justify-center px-5">
        <div className="max-w-3xl">
          <h1
            className={`${generalSans.className}  font-medium text-black tracking-tighter text-4xl md:text-5xl lg:text-6xl mb-8 opacity-85`}
          >
            Use Finara to track smarter, save better, and make every dollar work
            for you.
          </h1>
          <Link href="/dashboard">
            <ShimmerButton
              background="#1B2BB8"
              shimmerDuration="4s"
              shimmerSize="0.15rem"
              className="gap-2"
            >
              Start Tracking for Free <span className="ml-1"><ArrowRight className="size-4 inline" /></span>
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default FifthScreen;
