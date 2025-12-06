import { ConnectDb } from "@/app/lib/Mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { calculateSavingsRate } from "@/app/utils/helper";
import { Transactions } from "@/models/Transaction";
import { generateInsightsAI } from "../../../utils/helper";
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

    const results = await Transactions.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user._id),
          date: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalIncome: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0],
                  },
                },
                totalExpense: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0],
                  },
                },
              },
            },
          ],
          categories: [
            {
              $match: {
                type: "EXPENSE",
                userId: new mongoose.Types.ObjectId(user._id),
                date: { $gte: fromDate, $lte: toDate },
              },
            },
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
              },
            },
            { $sort: { total: -1 } },
            { $limit: 5 },
          ],
        },
      },
      {
        $project: {
          totalIncome: { $arrayElemAt: ["$summary.totalIncome", 0] },
          totalExpense: { $arrayElemAt: ["$summary.totalExpense", 0] },
          categories: 1,
        },
      },
    ]);

    if (!results.length || !results[0]) {
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
    const {
      totalIncome = 0,
      totalExpense = 0,
      categories = [],
    } = results[0] || {};
    const availableBalance = totalIncome - totalExpense;
    const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
    const insights = generateInsightsAI({
      totalIncome,
      totalExpense,
      availableBalance,
      categories,
      savingsRate,
    });
    return NextResponse.json({
      message: "Report generated successfully",
      data: {
        period: {
          from: fromDate.toISOString().split("T")[0],
          to: toDate.toISOString().split("T")[0],
        },
        summary: {
          totalIncome,
          totalExpense,
          availableBalance,
          savingsRate: `${savingsRate.toFixed(1)}%`,
        },
        topCategories: categories,
        generatedAt: new Date().toISOString(),
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
