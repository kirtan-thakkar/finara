"use client";
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TextEffect } from '@/components/ui/text-effect';
import { AnimatedGroup } from '@/components/ui/animated-group';

gsap.registerPlugin(ScrollTrigger);

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

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
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
          <div
            className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div
            className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div
            className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        
        <section className="hero-section">
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                    <span className="text-foreground text-sm font-medium tracking-tight">Introducing AI Budget Tracking</span>
                    <span
                      className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div
                      className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div
                        className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <div className="max-w-[1056px] mx-auto flex flex-col justify-center items-center gap-2 md:gap-4 mt-8">
                  <h1
                    className={`text-5xl sm:text-6xl md:text-7xl xl:text-[5.25rem] text-center font-medium tracking-tighter ${outfit.className} opacity-90 max-w-4xl text-balance max-md:font-semibold`}
                  >
                    Track Where Your{" "}
                    <Highlighter action="underline" color="#FF9800">
                      Money
                    </Highlighter>{" "}
                    Goes. <br></br>
                    <span className="text-6xl md:text-7xl xl:text-[5.25rem]">
                      <MagneticText
                        text="Effortlessly"
                        hoverText="Seamlessly"
                        className={
                          "opacity-95 text-5xl sm:text-6xl md:text-7xl xl:text-[5.25rem]"
                        }
                      />
                    </span>
                  </h1>

                  <div className="relative flex flex-col items-center justify-center gap-10 max-w-[612px]">
                    <p
                      className={`${outfit.className} mx-auto text-lg max-w-2xl font-medium opacity-80 text-center text-balance mt-8`}
                    >
                      Track your income and expenses, visualize spending patterns, and
                      manage everything from a single, organized dashboard. Designed to
                      help you understand your spending habits through clear data,
                      charts, and reports.
                    </p>

                    <AnimatedGroup
                      variants={{
                        container: {
                          visible: {
                            transition: {
                              staggerChildren: 0.05,
                              delayChildren: 0.75,
                            },
                          },
                        },
                        ...transitionVariants,
                      }}
                      className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                      <div
                        key={1}
                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                        <ShimmerButton 
                          background="#1B2BB8" 
                          shimmerDuration="4s" 
                          shimmerSize="0.15rem"
                          className="rounded-xl px-5 text-base h-11">
                          Start Tracking for Free
                        </ShimmerButton>
                      </div>
                    </AnimatedGroup>
                  </div>
                </div>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}>
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20 w-full flex justify-center items-center">
                <div className="w-[320px] sm:w-[480px] md:w-[640px] lg:w-[800px] xl:w-[1000px] 2xl:w-[1203px] max-w-6xl">
                  <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                    <Safari 
                      url="www.finara.com/dashboard" 
                      imageSrc="https://placehold.co/1200x750?text=Hello+World"
                      className="aspect-15/8 relative rounded-2xl border-border/25 border"
                    />
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
};
export default HeroPage;
