"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BlurFade } from "./ui/blur-fade";
import { Highlighter } from "@/components/ui/highlighter";
import { Outfit } from "next/font/google";
import { localFont } from "next/font/local";
import { Marquee } from "@/components/ui/marquee"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Bonny = localFont({
  src: "../public/fonts/Bonny-Variable.woff2",
  weight: "600",
  style: "normal",
});

const items = [
  {
    name: "Category Insights",
    title: "Clear spending breakdown",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-2.webp",
    body: "Understand where your money goes with category-wise tracking.",
  },
  {
    name: "Monthly Overview",
    title: "See the full picture",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-1.webp",
    body: "Get a clear summary of your spending for each month.",
  },
  {
    name: "Manual Entries",
    title: "Intentional tracking",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-5.webp",
    body: "Log expenses manually to stay aware and in control.",
  },
  {
    name: "Visual Summaries",
    title: "At-a-glance clarity",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-4.webp",
    body: "Simple visuals help you spot patterns instantly.",
  },
  {
    name: "Privacy First",
    title: "No bank access",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-2.webp",
    body: "Your financial data stays yours. No bank connections required.",
  },
];

function TestimonialCard({ item }) {
  return (
    <div className="relative flex h-full w-[16rem] sm:w-[18rem] md:w-[20rem] flex-col items-start justify-between rounded-xl border border-neutral-200 bg-white p-3 md:p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900">
      <div className="mb-3 md:mb-4 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
        {item.body}
      </div>
      <div className="mt-auto flex items-center gap-3 md:gap-4">
        <div className="relative h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className={`text-xs md:text-sm font-medium text-neutral-950 dark:text-neutral-50 ${outfit.className} tracking-tight`}>
            {item.name}
          </div>
          <div className={`text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 ${outfit.className}`}>
            {item.title}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MarqueeDemo() {
  return (
    <div className="relative w-full max-w-[500px] sm:max-w-[600px] md:max-w-[750px] overflow-hidden">
      <div className="from-background absolute inset-y-0 left-0 z-10 w-16 md:w-30 bg-gradient-to-r to-transparent" />
      <div className="from-background absolute inset-y-0 right-0 z-10 w-16 md:w-30 bg-gradient-to-l to-transparent" />
      <Marquee className="py-1 md:py-2" direction="left">
        {[...items, ...items].map((item, index) => (
          <TestimonialCard key={index} item={item} />
        ))}
      </Marquee>
      <Marquee className="py-1 md:py-2" direction="right">
        {[...items, ...items].map((item, index) => (
          <TestimonialCard key={index} item={item} />
        ))}
      </Marquee>
    </div>
  )
}

const ThirdPage = () => {
  const containerRef = useRef(null);

  useGSAP(()=>{
    const curr = containerRef.current;
    gsap.from

  },[])
  return (
    <div className="container h-full pb-12">
      <div className="flex max-w-4xl mx-auto px-4  sm:px-6 md:px-8 lg:px-12 mb-12 ">
        <h1
          className={`text-3xl sm:text-5xl md:text-6xl text-center font-medium tracking-tighter ${outfit.className} mt-24 text-white `}
        >
          Track everything you <br></br>need in your pocket.
        </h1>
      </div>
      <div className="max-w-5xl mt-6 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-12">
        <div className="dark">
          <Tabs defaultValue="overview" className="w-full max-w-3xl mx-auto">
            <TabsList className="!h-auto md:!h-20 w-full !rounded-2xl md:!rounded-4xl mb-4 md:mb-8 flex flex-col md:flex-row gap-1 md:gap-0 p-1 md:p-1">
              <TabsTrigger
                value="overview"
                className={`w-full flex-1 !h-auto md:!h-24 !rounded-xl ${outfit.className} text-xl md:text-2xl py-4 md:py-0`}
              >
                <div className="w-full px-2 md:px-4">
                  <h5
                    className={`${outfit.className} text-left text-base md:text-lg font-medium tracking-tight`}
                  >
                    Spending Clarity
                  </h5>
                  <p className={`${outfit.className} text-left text-xs md:text-sm opacity-70`}>
                    See where your money<br className="hidden md:block"></br>actually goes
                  </p>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className={`w-full flex-1 !h-auto md:!h-24 !rounded-xl ${outfit.className} text-xl md:text-2xl py-4 md:py-0`}
              >
                <div className="w-full px-2 md:px-4">
                  <h5
                    className={`${outfit.className} text-left text-base md:text-lg font-medium tracking-tight`}
                  >
                    Auto-categorised
                  </h5>
                  <p className={`${outfit.className} text-left text-xs md:text-sm opacity-70`}>
                    All your transactions will be<br className="hidden md:block"></br>safely sorted instantly.
                  </p>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className={`w-full flex-1 !h-auto md:!h-24 !rounded-xl ${outfit.className} text-xl md:text-2xl py-4 md:py-0`}
              >
                <div className="w-full px-2 md:px-4">
                  <h5
                    className={`${outfit.className} text-left text-base md:text-lg font-medium tracking-tight`}
                  >
                    Smart tips by AI
                  </h5>
                  <p className={`${outfit.className} text-left text-xs md:text-sm opacity-70`}>
                    Get AI-generated tips<br className="hidden md:block"></br>tailored to your habits.
                  </p>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="min-h-[300px] md:min-h-[400px] rounded-2xl md:rounded-3xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="flex h-full justify-center items-center p-4 md:p-8">
                  <div className="flex relative w-full h-full flex-col justify-start items-center text-center">
                    <h3
                      className={`${outfit.className} tracking-tight text-xl sm:text-2xl md:text-3xl font-medium text-white`}
                    >
                      Clear visibility into your spending
                    </h3>
                    <div className="w-12 md:w-16 h-[2px] bg-neutral-700 rounded-full mt-3 md:mt-4 mb-4 md:mb-6"></div>
                    <MarqueeDemo />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="min-h-[300px] md:min-h-[400px] rounded-2xl md:rounded-3xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="flex px-6 md:pl-10 py-6 md:pt-10 relative w-full md:w-[35%] h-auto md:h-full flex-col items-start justify-start border-b md:border-b-0 md:border-r border-neutral-800">
                    <h3
                      className={`${outfit.className} font-medium tracking-tight text-xl sm:text-2xl md:text-3xl text-white`}
                    >
                      Filter by <br className="hidden md:block"></br>category & time
                    </h3>
                  </div>
                  <div className="flex w-full md:w-[65%] py-4 h-full flex-col items-start justify-center">
                    <div className="w-full flex items-center py-3 md:py-5">
                      <div className="flex justify-start gap-3 md:gap-5 items-center w-full px-4 md:px-6">
                        <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Image
                            src="/starbucks.jpg"
                            alt="Starbucks logo"
                            width={200}
                            height={200}
                            className="rounded-lg w-8 h-8 md:w-12 md:h-12 object-cover"
                          />
                        </div>
                        <div className={`flex-1 ${outfit.className} font-medium tracking-tight min-w-0`}>
                          <h2 className="text-base md:text-lg leading-5 text-white">Starbucks</h2>
                          <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mt-1 truncate">Food & Drinks &nbsp;&nbsp; May 22</p>
                        </div>
                        <div className={`${outfit.className} font-medium tracking-tight flex-shrink-0`}>
                          <p className="text-base md:text-lg text-red-500">-$6.80</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full px-4 md:px-6"><div className="h-[1px] bg-neutral-800 w-full"></div></div>
                    <div className="w-full flex items-center py-3 md:py-5">
                      <div className="flex justify-start gap-3 md:gap-5 items-center w-full px-4 md:px-6">
                        <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Image
                            src="/netflix.jpg"
                            alt="Netflix logo"
                            width={200}
                            height={200}
                            className="rounded-lg w-8 h-8 md:w-12 md:h-12 object-cover"
                          />
                        </div>
                        <div className={`flex-1 ${outfit.className} font-medium tracking-tight min-w-0`}>
                          <h2 className="text-base md:text-lg leading-5 text-white">Netflix</h2>
                          <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mt-1 truncate">Entertainment &nbsp;&nbsp; May 19</p>
                        </div>
                        <div className={`${outfit.className} font-medium tracking-tight flex-shrink-0`}>
                          <p className="text-base md:text-lg text-red-500">-$13.99</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full px-4 md:px-6"><div className="h-[1px] bg-neutral-800 w-full"></div></div>
                    <div className="w-full flex items-center py-3 md:py-5">
                      <div className="flex justify-start gap-3 md:gap-5 items-center w-full px-4 md:px-6">
                        <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Image
                            src="/google.jpg"
                            alt="Income logo"
                            width={200}
                            height={200}
                            className="rounded-lg w-8 h-8 md:w-12 md:h-12 object-cover"
                          />
                        </div>
                        <div className={`flex-1 ${outfit.className} font-medium tracking-tight min-w-0`}>
                          <h2 className="text-base md:text-lg leading-5 text-white">May salary</h2>
                          <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mt-1 truncate">Income &nbsp;&nbsp; May 18</p>
                        </div>
                        <div className={`${outfit.className} font-medium tracking-tight flex-shrink-0`}>
                          <p className="text-base md:text-lg text-green-500">+$2,800.00</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full px-4 md:px-6"><div className="h-[1px] bg-neutral-800 w-full"></div></div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reports">
              <div className="min-h-[300px] md:min-h-[400px] rounded-2xl md:rounded-3xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-[45%] h-auto md:h-full flex flex-col items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-neutral-800">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-full mb-3 md:mb-4">
                      <img
                        src="https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-5.webp"
                        alt="Mary Smith"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className={`${outfit.className} text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-white`}>
                      Mary Smith
                    </h3>
                    <p className={`${outfit.className} text-xs md:text-sm text-white/60 mt-1`}>
                      Female &nbsp;&nbsp; In college
                    </p>
                    <div className="w-full mt-4 md:mt-6 space-y-2 hidden md:block">
                      <div className="flex gap-2">
                        <div className="h-3 bg-neutral-700 rounded-full flex-1"></div>
                        <div className="h-3 bg-neutral-700 rounded-full w-16"></div>
                        <div className="h-3 bg-neutral-700 rounded-full w-20"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 bg-neutral-700 rounded-full w-32"></div>
                        <div className="h-3 bg-neutral-700 rounded-full flex-1"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 bg-neutral-700 rounded-full flex-1"></div>
                        <div className="h-3 bg-neutral-700 rounded-full w-24"></div>
                      </div>
                    </div>
                    <div className={`${outfit.className} flex items-center gap-2 mt-4 md:mt-6 text-xs text-white/40`}>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12"/>
                      </svg>
                      SAVING MEMORY
                    </div>
                    <span className={`${outfit.className} bg-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1 rounded-full border border-violet-500/30 mt-3 md:mt-4`}>
                      Coming Soon
                    </span>
                  </div>
                  <div className="w-full md:w-[55%] h-auto md:h-full flex flex-col p-3 md:p-4">
                    <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4">
                      <div className="flex justify-end">
                        <div className={`${outfit.className} bg-neutral-700 text-white px-3 md:px-4 py-2 rounded-2xl rounded-tr-sm text-xs md:text-sm max-w-[85%] md:max-w-[80%]`}>
                          How do I start investing?
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className={`${outfit.className} text-white text-xs md:text-sm font-medium`}>
                          Great question! 👋
                        </p>
                        <p className={`${outfit.className} text-white/80 text-xs md:text-sm leading-relaxed`}>
                          To start investing, it's best to begin with these 3 simple steps:
                        </p>
                        <p className={`${outfit.className} text-white/80 text-xs md:text-sm leading-relaxed`}>
                          1. Understand your goals – Are you saving for a house, a holiday, or long-term wealth.....
                        </p>
                        <div className="flex items-center gap-3 mt-2 md:mt-3 text-white/40">
                          <button className="hover:text-white/60 transition-colors">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                          <button className="hover:text-white/60 transition-colors">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="hover:text-white/60 transition-colors">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className={`${outfit.className} bg-neutral-800 border border-neutral-700 text-white/70 px-3 md:px-4 py-2 rounded-2xl rounded-tr-sm text-xs md:text-sm max-w-[85%] md:max-w-[80%]`}>
                          How should I split my income?
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-4 flex items-center gap-2 bg-neutral-800 rounded-full px-3 md:px-4 py-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span className={`${outfit.className} text-white/50 text-xs md:text-sm flex-1`}>Ask anything</span>
                      <button className="w-7 h-7 md:w-8 md:h-8 bg-violet-500 rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ThirdPage;
