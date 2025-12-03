import { NextResponse } from "next/server";
import { Transactions } from "@/models/Transaction";
import { User } from "@/models/User";
import { ConnectDb } from "@/app/lib/Mongodb";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session || !session.user?.email) {
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
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword") || null;
    const type = searchParams.get("type") || null;
    const recurringStatus = searchParams.get("recurringStatus") || null;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const pageNumber = Number(searchParams.get("pageNumber")) || 1;
    const skip = (pageNumber - 1) * pageSize;
    const filterConditions = { userId: user._id };
    if (keyword) {
      filterConditions.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ];
    }
    if (type) {
      filterConditions.type = type;
    }
    if (recurringStatus === "RECURRING") {
      filterConditions.isRecurring = true;
    } else if (recurringStatus === "NON_RECURRING") {
      filterConditions.isRecurring = false;
    }
    const transactions = await Transactions.find(filterConditions)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    const totalCount = await Transactions.countDocuments(filterConditions);
    const totalPages = Math.ceil(totalCount / pageSize);
    return NextResponse.json({
      message: "Transactions fetched successfully",
      transactions,
      pagination: { pageSize, pageNumber, totalCount, totalPages },
    });
  } catch (error) {
    console.log("Error fetching transactions:", error);
    return NextResponse.json(
      {
        message: "Error while fetching transactions!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
