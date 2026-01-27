"use client";
import { Nav } from "./Navbar";
import { Outfit } from "next/font/google";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { MagneticText } from "./morphing-cursor";
import { Highlighter } from "@/components/ui/highlighter";
import { BlurFade } from "./ui/blur-fade";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Safari } from "./ui/safari";
import { ProgressiveBlur } from "./ui/progressive-blur";
import { ShimmerButton } from "@/components/ui/shimmer-button"

gsap.registerPlugin(ScrollTrigger);

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const HeroPage = () => {
  const containerRef = useRef(null);
  useGSAP(() => {
    const curr = containerRef.current;
    if (!curr) return;
    gsap.to(curr,{
      scrollTrigger:containerRef.current,
      scale:1.05,
      duration:0.5,
      ease:"power3.out",
      y:2,
      yoyo:true,
      repeat:-1,

    })
  });
  return (
    <>
      <Nav className="z-10 sticky top-0" />
      <section className="hero-section max-w-7xl mx-auto min-h-screen flex flex-col gap-16 items-center px-4 pt-20 pb-16">
        <div className="max-w-[1056px] flex flex-col justify-center items-center gap-2 md:gap-4">
          <BlurFade delay={0.3} inView>
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl text-center font-medium tracking-tighter ${outfit.className} opacity-90 py-[-2] `}
            >
              Track Where Your{" "}
              <Highlighter action="underline" color="#FF9800">
                Money
              </Highlighter>{" "}
              Goes. <br></br>
              <span className="text-6xl">
                <MagneticText
                  text="Effortlessly"
                  hoverText="Seamlessly"
                  className={
                    "opacity-95 `text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
                  }
                />
              </span>
            </h1>
          </BlurFade>
          <div className="relative flex flex-col items-center justify-center gap-10 max-w-[612px]">
            <BlurFade delay={0.6} inView>
              <h5
                className={`${outfit.className} mx-auto text-sm sm:text-base  max-w-[280px] font-medium opacity-80 sm:max-w-[320px] md:max-w-[380px] lg:max-w-[445px] text-center`}
              >
                Track your income and expenses, visualize spending patterns, and
                manage everything from a single, organized dashboard.Designed to
                help you understand your spending habits through clear data,
                charts, and reports.
              </h5>
            </BlurFade>
            <BlurFade delay={0.9} inView>
              <div>
                <ShimmerButton background="#1B2BB8" shimmerDuration="4s" shimmerSize="0.15rem">
                  Start Tracking for Free
                </ShimmerButton>
              </div>
            </BlurFade>
          </div>
        </div>
        <div className="w-full flex justify-center items-center px-4">
          <BlurFade delay={1.2} inView>
            <div className="w-[320px] sm:w-[480px] md:w-[640px] lg:w-[800px] xl:w-[1000px] 2xl:w-[1203px]">
              <Safari url="www.finara.com/dashboard" imageSrc="https://placehold.co/1200x750?text=Hello+World"/>
            </div>
          </BlurFade>
        </div>
      </section>
    </>
  );
};
export default HeroPage;
