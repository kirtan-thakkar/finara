"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BlurFade } from "./ui/blur-fade";
import { Highlighter } from "@/components/ui/highlighter";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

const FourthPage = ()=>{
    return(

        <div className="`">
            <h1>This is the fourth screen</h1>
        </div>
    )
}
export default FourthPage;