import { ConnectDb } from "@/app/lib/Mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { calculateSavingsRate, generateReportService } from "@/app/utils/helper";
import { Transactions } from "@/models/Transaction";
import mongoose from "mongoose";
export async function POST(request, { params }) {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "Unauthorized - please login to continue",
        },
        { status: 401 }
      );
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found in database",
        },
        { status: 404 }
      );
    }
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { message: "Missing required parameters: from and to dates" },
        { status: 400 }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    if (fromDate > toDate) {
      return NextResponse.json(
        { message: "From date cannot be after to date" },
        { status: 400 }
      );
    }

    toDate.setHours(23, 59, 59, 999);

    // Generate report using the service function
    const reportData = await generateReportService(user._id, fromDate, toDate);

    if (!reportData) {
      return NextResponse.json({
        message: "No transactions found for the specified period",
        data: {
          period: {
            from: fromDate.toISOString().split("T")[0],
            to: toDate.toISOString().split("T")[0],
          },
          summary: {
            totalIncome: 0,
            totalExpense: 0,
            availableBalance: 0,
            savingsRate: "0%",
          },
          topCategories: [],
          generatedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      message: "Report generated successfully",
      data: {
        ...reportData,
        summary: {
          ...reportData.summary,
          savingsRate: `${reportData.summary.savingsRate}%`,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
