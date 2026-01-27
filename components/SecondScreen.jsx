"use client";
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
        <div className="container w-full min-h-[880px] flex flex-col justify-center items-center gap-4 p-4">
          {/* First Row - 2 columns */}
          <div className="w-full grid grid-cols-2 gap-4 max-w-6xl">
            <div className="flex justify-center items-center">
              <div className="max-w-md w-full">
                <ExpandableCard
                  title="Track Expenses"
                  src="https://cdn.badtz-ui.com/images/components/expandable-card/haunted-house.webp"
                  description="Smart Spending"
                  classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
                >
                  <h4>Monitor Your Daily Spending</h4>
                  <p>
                    Keep track of every purchase with our intuitive expense tracking system. 
                    Categorize spending and see where your money goes each month.
                  </p>
                  <h4>Smart Budget Alerts</h4>
                  <p>
                    Get notified when you're approaching budget limits or spending more 
                    than usual in any category.
                  </p>
                </ExpandableCard>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="max-w-md w-full">
                <ExpandableCard
                  title="Analyze Patterns"
                  src="https://cdn.badtz-ui.com/images/components/expandable-card/haunted-house.webp"
                  description="Data Insights"
                  classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
                >
                  <h4>Visual Spending Reports</h4>
                  <p>
                    See detailed charts and graphs showing your spending patterns 
                    over time with beautiful, easy-to-understand visualizations.
                  </p>
                  <h4>Monthly Comparisons</h4>
                  <p>
                    Compare spending across different months and categories to identify 
                    trends and make better financial decisions.
                  </p>
                </ExpandableCard>
              </div>
            </div>
          </div>
          
          {/* Second Row - 1 column centered */}
          <div className="w-full flex justify-center items-center max-w-6xl">
            <div className="max-w-md w-full">
              <ExpandableCard
                title="Achieve Goals"
                src="https://cdn.badtz-ui.com/images/components/expandable-card/haunted-house.webp"
                description="Financial Success"
                classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
              >
                <h4>Set Savings Targets</h4>
                <p>
                  Create specific savings goals and track your progress with 
                  visual indicators and milestone celebrations.
                </p>
                <h4>Automated Planning</h4>
                <p>
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
