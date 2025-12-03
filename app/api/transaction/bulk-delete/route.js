import { ConnectDb } from "@/app/lib/Mongodb";
import { NextResponse } from "next/server";
import { Transactions } from "@/models/Transaction";
import { auth } from "@/auth";
import { User } from "@/models/User";
import { bulkTransactionDeleteSchema } from "@/app/validators/validateTransaction";
export async function DELETE(request, { params }) {
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
    const data = bulkTransactionDeleteSchema.parse(body);

    const result = await Transactions.deleteMany({
        _id:{$in:data.transactionsIds},
        userId: user._id
    });
    if(!result){
        return NextResponse.json({
            message: "No transactions were deleted",
        },{status:404})
    }

    return NextResponse.json(
      {
        message: "Transactions deleted successfully",
        count : result.deletedCount,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
