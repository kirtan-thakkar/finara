import { auth } from "@/auth";
import ReportSetting from "@/models/reportSetting";
import { ConnectDb } from "@/app/lib/Mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { updateReportSettingSchema } from "@/app/validators/validateReport";
import { calculateNextReportDate } from "@/app/utils/helper";
export async function PATCH(request) {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized - please login to continue" },
        { status: 401 }
        );
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 404 }
        );
    }

    const body = await request.json();
    const data = updateReportSettingSchema.parse(body);

    const {isEnabled} = data;
    let nextReportDate = null;

    const existingReportSetting = await ReportSetting.findOne({
        userId : user._id
    })
    if(!existingReportSetting){
        return NextResponse.json({
            message:"Report settings not found for this user"
        },{status:404})
    }

    const frequency = existingReportSetting.frequency;
    if(isEnabled){
        const currentNextReportDate = existingReportSetting.nextReportDate;
        const now = new Date();
        if(!currentNextReportDate || currentNextReportDate < now){
            nextReportDate = calculateNextReportDate(existingReportSetting.lastSentDate);
        }else{
            nextReportDate = currentNextReportDate;
        }

        existingReportSetting.set({
            ...data,
            nextReportDate,
        });

        await existingReportSetting.save();

        return NextResponse.json({
            message:"Report settings updated and enabled",
            reportSetting: existingReportSetting
        })
    }

  } catch (err) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
