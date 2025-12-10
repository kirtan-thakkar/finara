import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConnectDb } from "@/app/lib/Mongodb";
import { User } from "@/models/User";
import mongoose from "mongoose";
import { Transactions } from "@/models/Transaction";
import { getDateRange } from "../route";
const dateRangeEnums = {
  LAST_30_DAYS: "30days",
  LAST_MONTH: "lastMonth",
  LAST_3_MONTHS: "3months",
  LAST_6_MONTHS: "6months",
  LAST_YEAR: "1year",
  ALL_TIME: "allTime",
  CUSTOM: "custom",
};

export async function GET(request) {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session.user.email) {
      return NextResponse.json(
        {
          message: "Not authorised! Please Login to continue",
        },
        { status: 401 }
      );
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        {
          message: "No user found!",
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const preset = searchParams.get("preset") || dateRangeEnums.LAST_30_DAYS;

    let fromDate, toDate;

    if (preset === dateRangeEnums.CUSTOM) {
      if (!from || !to) {
        return NextResponse.json(
          {
            message: "Missing required parameters: from and to dates",
          },
          { status: 400 }
        );
      }
      fromDate = new Date(from);
      toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return NextResponse.json(
          {
            message: "Invalid date format. Use YYYY-MM-DD",
          },
          { status: 400 }
        );
      }

      if (fromDate > toDate) {
        return NextResponse.json(
          {
            message: "Invalid Date Range given",
          },
          { status: 400 }
        );
      }

      toDate.setHours(23, 59, 59, 999);
    } else {
      const range = getDateRange(preset);
      if (!range) {
        return NextResponse.json(
          {
            message: "Invalid date range preset",
          },
          { status: 400 }
        );
      }
      fromDate = range.fromDate;
      toDate = range.toDate;
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(user._id),
      type: "EXPENSE", 
      ...(fromDate && toDate
        ? {
            date: {
              $gte: fromDate,
              $lte: toDate,
            },
          }
        : {}),
    };

    const categoryPipeline = [
      { $match: filter },
      // Group by category and sum amounts
      {
        $group: {
          _id: "$category",
          value: { $sum: { $abs: "$amount" } },
        },
      },
      // Sort by value descending (highest spending first)
      { $sort: { value: -1 } },
      // Split into top 3 and others
      {
        $facet: {
          topThree: [{ $limit: 3 }],
          others: [
            { $skip: 3 },
            {
              $group: {
                _id: "Others",
                value: { $sum: "$value" },
              },
            },
          ],
        },
      },
      {
        $project: {
          categories: {
            $concatArrays: ["$topThree", "$others"],
          },
        },
      },
      // Unwind to process each category
      { $unwind: "$categories" },
      // Group again to get totals and breakdown
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$categories.value" },
          breakdown: { $push: "$categories" },
        },
      },
      // Calculate percentages for each category
      {
        $project: {
          _id: 0,
          totalSpent: 1,
          breakdown: {
            $map: {
              input: "$breakdown",
              as: "cat",
              in: {
                name: "$$cat._id",
                value: "$$cat.value",
                percentage: {
                  $cond: [
                    { $eq: ["$totalSpent", 0] },
                    0,
                    {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ["$$cat.value", "$totalSpent"] },
                            100,
                          ],
                        },
                        0, // Round to nearest integer
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ];

    const result = await Transactions.aggregate(categoryPipeline);
    const data = result[0] || {
      totalSpent: 0,
      breakdown: [],
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          totalSpent: data.totalSpent,
          breakdown: data.breakdown,
          preset: {
            value: preset,
            from: fromDate,
            to: toDate,
          },
        },
      },
      { status: 200 }
    );
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
