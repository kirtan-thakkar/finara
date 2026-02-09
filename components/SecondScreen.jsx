"use client";
import { Outfit } from "next/font/google";
import { ExpandableCard } from "@/components/ui/expandable-card";
import ThirdPage from "./ThirdScreen";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const SecondPage = () => {
  return (
    <div className="relative mt-8">
      {/* SecondScreen — sticky, stays pinned at top while ThirdScreen scrolls over it */}
      <div className="sticky top-0 z-[1]">
        <div className="min-h-screen flex flex-col justify-center items-center bg-background">
          <h2
            className={`${outfit.className} text-2xl sm:text-4xl md:text-5xl text-center font-medium tracking-tighter opacity-98 mb-16`}
          >
            Finnara helps you...
          </h2>
          <div className="container flex flex-col justify-center items-center gap-4 p-8 max-w-6xl mx-auto">
            <div className="flex justify-center items-center gap-4">
              <div className="flex justify-start items-center mx-auto">
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
              <div className="flex justify-start items-center mx-auto">
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

            <div className="w-full flex justify-center items-center max-w-6xl">
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

      <div className="relative z-[2] bg-black rounded-t-[60px] overflow-hidden">
        <ThirdPage />
      </div>
    </div>
  );
};
export default SecondPage;
