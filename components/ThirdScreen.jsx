import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BlurFade } from "./ui/blur-fade";
import { Highlighter } from "@/components/ui/highlighter";
import { Outfit } from "next/font/google";
import { localFont } from "next/font/local";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const ThirdPage = () => {
  return (
    <div className="container mt-6 h-screen bg-black">
      <div className="flex bg-amber-200 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 ">
        <h1
          className={`text-3xl sm:text-5xl md:text-6xl text-center font-medium tracking-tighter ${outfit.className} mt-4 text-white `}
        >
          Track everything you <br></br>need in your pocket.
        </h1>
      </div>
      <div className="max-w-5xl mt-6 bg-amber-400 h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-10 ">
        <div className="dark">
          <Tabs defaultValue="overview" className="max-w-5xl mx-auto h-[500px]">
            <TabsList className="!h-20 !rounded-4xl ">
              <TabsTrigger
                value="overview"
                className={`w-[300px] !h-16 !rounded-xl ${outfit.className}`}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className={`w-[300px] !h-24 !rounded-xl ${outfit.className}`}
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className={`w-[300px] !h-16  ${outfit.className}`}
              >
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" >
              <div className="h-[400px] rounded-[48px] border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Overview
                  </h3>
                  <p
                    className={`${outfit.className} text-sm text-muted-foreground`}
                  >
                    View your key metrics and recent project activity. Track
                    progress across all your active projects.
                  </p>
                </div>
                <div className="p-6 pt-0 text-muted-foreground text-sm">
                  You have 12 active projects and 3 pending tasks.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="h-[400px] rounded-[48px] border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Track performance and user engagement metrics. Monitor
                    trends and identify growth opportunities.
                  </p>
                </div>
                <div className="p-6 pt-0 text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reports">
              <div className="h-[400px] rounded-[48px] border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Reports
                  </h3>
                  <p
                    className={`${outfit.className} text-sm text-muted-foreground`}
                  >
                    Generate and download your detailed reports. Export data in
                    multiple formats for analysis.
                  </p>
                </div>
                <div className="p-6 pt-0 text-muted-foreground text-sm">
                  You have 5 reports ready and available to export.
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
