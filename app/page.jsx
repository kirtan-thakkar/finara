//backgroung #1B2BB8 blue shade che 
import FourthPage from "@/components/fourthscreen";
import HeroPage from "@/components/HeroSection";
import SecondPage from "@/components/SecondScreen";
import ThirdPage from "@/components/ThirdScreen";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
export default async function Home() {
  
  return (
    <main>
      <HeroPage />
      <SecondPage />
      <ThirdPage />
      <FourthPage />
    </main>
  );
}
