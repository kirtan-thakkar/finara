import { NextResponse } from "next/server";
import { Transactions } from "@/models/Transaction";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { ConnectDb } from "@/app/lib/Mongodb";

export async function POST(request, { params }) {
  try {
    await ConnectDb();
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    const original = await Transactions.findOne({
      _id: id,
      userId: user._id
    });

    if (!original) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }
    const duplicatedData = {
      ...original.toObject(),
      _id: undefined,
      title: `Duplicate - ${original.title}`,
      description: original.description
        ? `${original.description} (Duplicate)`
        : "Duplicated transaction",
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      createdAt: undefined,
      updatedAt: undefined,
    };

    const duplicated = await Transactions.create(duplicatedData);

    return NextResponse.json({
      message: "Transaction duplicated successfully",
      duplicated,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
