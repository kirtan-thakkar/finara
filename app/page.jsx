import FifthScreen from "@/components/fifthScreen";
import FourthPage from "@/components/fourthscreen";
import HeroPage from "@/components/HeroSection";
import SecondPage from "@/components/SecondScreen";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import FooterSection from "@/components/footer";
import { ReactLenis, useLenis } from 'lenis/react'
export default async function Home() {
  
  return (
    <ReactLenis root>
      <main>
      <HeroPage />
      <SecondPage />
      <FourthPage />
      <FifthScreen />
      <FooterSection />
    </main>

    </ReactLenis>
  );
}
