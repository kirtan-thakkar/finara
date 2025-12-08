import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConnectDb } from "@/app/lib/Mongodb";
import { User } from "@/models/User";

export async function GET(request){
    try{
        await ConnectDb();
        const session = await auth();
        if(!session.user.email){
            return NextResponse.json({
                message:"Not authorised! Please Login to continue"
            },{status:401})
        }

        const user = await User.findOne({ email: session.user.email });
        if(!user){
            return NextResponse.json({
                message:"No user found!"
            },{status:404})
        }
        
    }catch(error){
        return NextResponse.json({
            message:"Internal Server Error"
        },{status:500})
    }
}