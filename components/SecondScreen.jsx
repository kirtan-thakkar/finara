"use client";
// https://www.fancycomponents.dev/docs/components/filter/gooey-svg-filter
// https://ui.tailus.io/?ref=shadway#
// https://tweakcn.com/editor/theme?p=dashboard
// https://lucide-animated.com/?ref=shadway   

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BlurFade } from "./ui/blur-fade";
import { Highlighter } from "@/components/ui/highlighter";
import { Outfit } from "next/font/google";
import { localFont } from "next/font/local";
import {ExpandableCard} from "@/components/ui/expandable-card";

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

const SecondPage = () => {
  return (
    <div className="mt-8">
      <div className="">
        <h2
          className={`${outfit.className} text-2xl sm:text-4xl md:text-5xl text-center font-medium tracking-tighter ${outfit.className} opacity-98`}
        >
          Finnara helps you...
        </h2>
        <div className="container  min-h-[680px] flex flex-col justify-center items-center gap-4 p-8 max-w-6xl mx-auto">
          <div className="flex justify-center items-center gap-4 ">
            <div className="flex justify-start items-center mx-auto ">
              <div className="">
                <ExpandableCard
                  title="Track Expenses"
                  src="https://cdn.badtz-ui.com/images/components/expandable-card/haunted-house.webp"
                  description="Smart Spending"
                  classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
                >
                  <h4 className={`${outfit.className}`}>Monitor Your Daily Spending</h4>
                  <p className={`${outfit.className}`}>
                    Keep track of every purchase with our intuitive expense tracking system. 
                    Categorize spending and see where your money goes each month.
                  </p>
                  <h4 className={`${outfit.className}`}>Smart Budget Alerts</h4>
                  <p className={`${outfit.className}`}>
                    Get notified when you're approaching budget limits or spending more 
                    than usual in any category.
                  </p>
                </ExpandableCard>
              </div>
            </div>
            <div className="flex justify-start items-center mx-auto ">
              <div className="">
                <ExpandableCard
                  title="Analyze Patterns"
                  src="https://cdn.badtz-ui.com/images/components/expandable-card/haunted-house.webp"
                  description="Data Insights"
                  classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
                >
                  <h4 className={`${outfit.className}`}>Visual Spending Reports</h4>
                  <p className={`${outfit.className}`}>
                    See detailed charts and graphs showing your spending patterns 
                    over time with beautiful, easy-to-understand visualizations.
                  </p>
                  <h4 className={`${outfit.className}`}>Monthly Comparisons</h4>
                  <p className={`${outfit.className}`}>
                    Compare spending across different months and categories to identify 
                    trends and make better financial decisions.
                  </p>
                </ExpandableCard>
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-center items-center max-w-6xl">
            <div className="">
              <ExpandableCard
                title="Achieve Goals"
                src="https://cdn.badtz-ui.com/images/components/expandable-card/haunted-house.webp"
                description="Financial Success"
                classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
              >
                <h4 className={`${outfit.className}`}>Set Savings Targets</h4>
                <p className={`${outfit.className}`}>
                  Create specific savings goals and track your progress with 
                  visual indicators and milestone celebrations.
                </p>
                <h4 className={`${outfit.className}`}>Automated Planning</h4>
                <p className={`${outfit.className}`}>
                  Get personalized recommendations on how much to save each month 
                  to reach your financial goals on time.
                </p>
              </ExpandableCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SecondPage;
