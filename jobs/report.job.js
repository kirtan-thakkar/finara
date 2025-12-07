import { ConnectDb } from "@/app/lib/Mongodb";
import ReportSetting from "@/models/reportSetting";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
export async function processReportJob() {
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

    const now = new Date();
    const firstDayOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const firstDayOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    try {
      const reportCursor = await ReportSetting.find({
        isEnabled: true,
        nextReportDate: { $lte: now },
      }).populate("userId").cursor();
      console.log("Processing reports for users with due reports");
      
      for await(const setting of reportCursor){
        const user = setting.userId;
        if (!user) {
          console.log("User not found for report setting:", setting._id);
          continue;
        }
        const report = await generateReportService
      }

    } catch (error) {
      return NextResponse.json(
        {
          message: "Error",
          error: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in processReportJob:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
        date: new Date().toISOString().split("T")[0],
      },
      { status: 500 }
    );
  }
}

async function generateMonthlyReport(user, transactions, startDate, endDate) {
  try {
    const report = {
      userId: user._id,
      userEmail: user.email,
      period: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
      totalTransactions: transactions.length,
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      categoryBreakdown: {},
      paymentMethodBreakdown: {},
      transactionsByType: {
        INCOME: 0,
        EXPENSE: 0,
      },
    };

    transactions.forEach((transaction) => {
      const amount = Math.abs(transaction.amount);

      if (transaction.type === "INCOME") {
        report.totalIncome += amount;
        report.transactionsByType.INCOME++;
      } else if (transaction.type === "EXPENSE") {
        report.totalExpenses += amount;
        report.transactionsByType.EXPENSE++;
      }

      if (transaction.category) {
        if (!report.categoryBreakdown[transaction.category]) {
          report.categoryBreakdown[transaction.category] = 0;
        }
        report.categoryBreakdown[transaction.category] += amount;
      }

      if (transaction.paymentMethod) {
        if (!report.paymentMethodBreakdown[transaction.paymentMethod]) {
          report.paymentMethodBreakdown[transaction.paymentMethod] = 0;
        }
        report.paymentMethodBreakdown[transaction.paymentMethod] += amount;
      }
    });

    report.netBalance = report.totalIncome - report.totalExpenses;
    report.totalIncome = Math.round(report.totalIncome * 100) / 100;
    report.totalExpenses = Math.round(report.totalExpenses * 100) / 100;
    report.netBalance = Math.round(report.netBalance * 100) / 100;
    return report;
  } catch (error) {
    console.error("Error generating monthly report:", error);
    throw error;
  }
}
