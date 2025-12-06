import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {ConnectDb} from "@/app/lib/Mongodb";
import {User} from "@/models/User";
import Report from "@/models/reports";

export async function GET(request){
    try{
        await ConnectDb();
        const session = await auth();
        
        if(!session?.user?.email){
            return NextResponse.json({
                message:"Unauthorized"
            },{status:401})
        }
        
        const user = await User.findOne({email:session.user.email});
        if(!user){
            return NextResponse.json({
                message:"User not found in database"
            },{status:404})
        }
        const { searchParams } = new URL(request.url);
        const pageSize = parseInt(searchParams.get("pageSize") || "20", 10) || 20;
        const pageNumber = parseInt(searchParams.get("pageNumber") || "1", 10) || 1;

        const skip = (pageNumber - 1) * pageSize;
        const reports = await Report.find({ userId: user._id })
            .sort({ sentDate: -1, createdAt: -1 })
            .skip(skip)
            .limit(pageSize);

        const totalReports = await Report.countDocuments({ userId: user._id });
        const totalPages = Math.ceil(totalReports / pageSize);

        return NextResponse.json({
            message: "Reports fetched successfully",
            reports,
            pagination: {
                currentPage: pageNumber,
                pageSize,
                totalItems: totalReports,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
        })
    }catch(err){
        return NextResponse.json({
            message:"Internal Server Error",
            error : err.message
        },{status:500})
    }
}