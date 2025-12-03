import { NextResponse } from "next/server"

export async function GET(request){
    console.log("Cron Job run at ", new Date())
    return NextResponse.json({
        message:"Cron Job Executed Successfully"
    },{status:200});
}