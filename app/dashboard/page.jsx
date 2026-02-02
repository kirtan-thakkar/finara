"use client";
import { Outfit } from "next/font/google";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export default function DashboardPage(){
    return(
        <div>
            <h1>Dashbaord!</h1>
        </div>
    )
}