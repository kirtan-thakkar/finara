import { Nav } from "./Navbar";
import { Outfit } from "next/font/google";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { MagneticText } from "./morphing-cursor";
import { Highlighter } from "@/components/ui/highlighter";
import { BlurFade } from "./ui/blur-fade";
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const HeroPage = () => {
  return (
    <>
      <Nav className="z-10 sticky top-0" />
      <section className="hero-section max-w-7xl mx-auto h-screen flex flex-col justify-center gap-7 items-center px-4">
        <div className="max-w-[1056px]  max-h-[496px] flex flex-col justify-center items-center gap-2 md:gap-4  ">
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
                  className={"opacity-95 `text-2xl sm:text-4xl md:text-5xl lg:text-6xl"}
                />
              </span>
            </h1>
          </BlurFade>
          <div className="relative flex flex-col items-center justify-center gap-10 max-w-[612px] h-60">
            <BlurFade delay={0.6} inView>
              <h5
                className={`${outfit.className} mx-auto text-sm sm:text-base  max-w-[280px] font-medium opacity-80 sm:max-w-[320px] md:max-w-[380px] lg:max-w-[445px]`}
              >
                Track your income and expenses, visualize spending patterns, and
                manage everything from a single, organized dashboard.Designed to
                help you understand your spending habits through clear data,
                charts, and reports.
              </h5>
            </BlurFade>
            <BlurFade delay={0.9} inView>
              <InteractiveHoverButton>
                Start Tracking for Free
              </InteractiveHoverButton>
            </BlurFade>
          </div>
        </div>
        <div className="max-w-[1056px]  max-h-[496px] flex flex-col justify-center items-center gap-4 "></div>
      </section>
    </>
  );
};
export default HeroPage;
