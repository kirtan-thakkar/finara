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
    <div className="container mt-10 h-screen bg-black ">
      <div className="flex max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-12 ">
        <h1
          className={`text-3xl sm:text-5xl md:text-6xl text-center font-medium tracking-tighter ${outfit.className} mt-4 text-white `}
        >
          Track everything you <br></br>need in your pocket.
        </h1>
      </div>
      <div className="max-w-5xl mt-6 h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-12 ">
        <div className="dark">
          <Tabs defaultValue="overview" className="max-w-3xl mx-auto h-[500px]">
            <TabsList className="!h-20 !max-w-3xl !rounded-4xl mb-8">
              <TabsTrigger
                value="overview"
                className={`w-[300px] !h-24 !rounded-lg ${outfit.className} text-2xl`}
              >
                <div className="w-full px-4"><h5 className={`${outfit.className} text-left text-lg tracking-tight`}>Bank accounts</h5><p className={`${outfit.className} text-left text-sm`}>Safely connect to your all<br></br>your bank accounts.</p></div>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className={`w-[300px] !h-24 !rounded-lg ${outfit.className} text-2xl`}
              >
                <div className="w-full px-4"><h5 className={`${outfit.className} text-left text-lg tracking-tight`}>Auto-categorised</h5><p className={`${outfit.className} text-left text-sm`}>All your transactions will be<br></br>safely sorted instantly.</p></div>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className={`w-[300px] !h-24 !rounded-lg ${outfit.className} text-2xl`}
              >
               <div className="w-full px-4"><h5  className={`${outfit.className} text-left text-lg tracking-tight`}>Smart tips by AI</h5><p className={`${outfit.className} text-left text-sm`}>Get AI-generated tips  <br></br>tailored to your habits.</p></div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" >
              <div className="h-[400px] rounded-3xl border bg-card text-card-foreground shadow-sm">
                <div className="flex h-full justify-center items-center p-8 bg-amber-300">
                  <div className="flex w-full h-full flex-col items-start py-2 bg-violet-300">
                    <h3 className={`${outfit.className} tracking-tight text-xl `}>
                      Filter by <br></br>category & time
                    </h3>

                  </div>
                  <div className="flex w-full h-full flex-col items-start py-2 bg-violet-900">
                    <h3 className={`${outfit.className} tracking-tight text-xl `}>
                      Filter by <br></br>category & time
                    </h3>

                  </div>

                </div>
                <div className="p-6 pt-0 text-muted-foreground text-sm">
                  You have 12 active projects and 3 pending tasks.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="h-[400px] rounded-3xl border bg-card text-card-foreground shadow-sm">
                <div className="flex h-full justify-center items-center p-8 bg-amber-300">
                  <div className="flex !pl-10 !pt-8 relative w-[50%] h-full flex-col items-start py-2 bg-violet-300">
                    <h3 className={`${outfit.className} tracking-tight text-xl `}>
                      Filter by <br></br>category & time
                    </h3>

                  </div>
                  <div className="flex w-full pt-8 h-full flex-col items-start bg-violet-900">
                    <h3 className={`${outfit.className} tracking-tight text-xl `}>
                      Filter by <br></br>category & time
                    </h3>

                  </div>

                </div>
                <div className="p-6 pt-0 text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reports">
              <div className="h-[400px] rounded-3xl bg-card text-card-foreground shadow-sm">
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
