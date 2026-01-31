"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BlurFade } from "./ui/blur-fade";
import { Highlighter } from "@/components/ui/highlighter";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  weight: "100 900",
  style: "normal",
});

const testimonials = [
  {
    id: "mary",
    name: "Mary Smith",
    date: "May 16, 2025",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-1.webp",
    quote: "Finara completely changed how I manage my money. I never realized how much I was overspending until I saw it clearly. Now I’m more confident with every financial decision I make.",
  },
  {
    id: "john",
    name: "John Doe",
    date: "May 12, 2025",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-2.webp",
    quote: "It’s so easy to understand where my money goes. I used to hate budgeting but Finara made it simple and stress free. The insights are clear and actually helpful for my day to day life.",
  },
  {
    id: "emily",
    name: "Emily Simson",
    date: "April 28, 2025",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-5.webp",
    quote: "This app gave me a new sense of control over my finances. I love how clean and easy everything feels to use. It’s like having a financial coach in my pocket all the time.",
  },
  {
    id: "bryan",
    name: "Bryan Yan",
    date: "April 20, 2025",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-4.webp",
    quote: "I’ve tried other apps before but Finara is the only one that stuck. Everything is automatic and feels super intuitive. The tips are surprisingly accurate and help me stay on track with my goals.",
  },
];

const FourthPage = () => {
  const [activeTab, setActiveTab] = useState("mary");
  const containerRef = useRef(null);

  const activeTestimonial = testimonials.find((t) => t.id === activeTab);

  useGSAP(() => {}, []);

  return (
    <div className="container h-full py-12 md:py-24 sm:mt-6 md:mt-18">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsContent value={activeTab} className="mt-0">
            <div className="flex flex-col items-start justify-center">
              <h2
                className={`${generalSans.className} text-2xl sm:text-3xl md:text-[40px] lg:text-[40px] text-left font-medium text-black leading-tightest max-w-6xl mb-3`}
              >
                "{activeTestimonial?.quote}"
              </h2>

              <div className="flex items-center gap-4 mt-6 md:mt-8">
                <div className="relative h-14 w-14 md:h-16 md:w-16 overflow-hidden rounded-full border border-neutral-200">
                  <img
                    src={activeTestimonial?.image}
                    alt={activeTestimonial?.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`${outfit.className} text-lg md:text-xl font-medium text-black/80 tracking-tight`}
                  >
                    {activeTestimonial?.name}
                  </span>
                  <span
                    className={`${outfit.className} text-base md:text-lg text-neutral-500`}
                  >
                    {activeTestimonial?.date}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsList className="!h-auto w-full !rounded-2xl md:!rounded-3xl mt-6 md:mt-8 flex flex-col sm:flex-row gap-1 sm:gap-0 p-1 md:p-2 bg-white border border-neutral-200 shadow-sm">
            {testimonials.map((testimonial) => (
              <TabsTrigger
                key={testimonial.id}
                value={testimonial.id}
                className={`w-full flex-1 !h-auto !rounded-xl md:!rounded-2xl ${outfit.className} py-3 md:py-4 transition-all duration-200
                  data-[state=active]:bg-neutral-100 data-[state=active]:shadow-sm
                  data-[state=inactive]:bg-transparent
                  hover:bg-neutral-50`}
              >
                <div className="w-full px-2 md:px-4 text-center">
                  <h5
                    className={`${outfit.className} text-base md:text-lg font-medium tracking-tight text-neutral-900 data-[state=active]:text-neutral-900`}
                  >
                    {testimonial.name}
                  </h5>
                  <p
                    className={`${outfit.className} text-sm md:text-base text-neutral-500 mt-0.5`}
                  >
                    {testimonial.date}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default FourthPage;