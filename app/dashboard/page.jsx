"use client";
import { Outfit } from "next/font/google";


const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export default function DashboardPage(){
    return(
        <div>
            <h1>Dashbaord!</h1>
        </div>
    )
}