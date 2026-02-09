import FifthScreen from "@/components/fifthScreen";
import FourthPage from "@/components/fourthscreen";
import HeroPage from "@/components/HeroSection";
import SecondPage from "@/components/SecondScreen";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import FooterSection from "@/components/footer";
export default async function Home() {
  
  return (
    <main>
      <HeroPage />
      <SecondPage />
      <FourthPage />
      <FifthScreen />
      <FooterSection />
    </main>
  );
}
