import { ConnectDb } from "@/app/lib/Mongodb";
import ReportSetting from "@/models/reportSetting";
import { generateReportService, calculateNextReportDate } from "@/app/utils/helper";
import { sendReportEmail } from "@/app/api/send/route";
import mongoose from "mongoose";
import Report from "@/models/reports";
import User from "@/models/User";
export async function processReportJob() {
  let processedCount = 0;
  let errorCount = 0;
  
  try {
    await ConnectDb();
    const mongoSession = await mongoose.startSession();
    const now = new Date();
    
    const firstDayOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    console.log("Processing due reports...");
    
    const reportCursor = ReportSetting.find({
      isEnabled: true,
      nextReportDate: { $lte: now },
    })
      .populate("userId")
      .cursor();

    for await (const setting of reportCursor) {
      const user = setting.userId;
      console.log("Processing setting:", setting._id, "for user:", user?.email || "NO_USER");
      
      if (!user) {
        console.log("User not found for setting:", setting._id);
        errorCount++;
        continue;
      }

      let reportData = null;
      try {
        console.log("Generating report for user:", user.email);
        reportData = await generateReportService(
          user._id,
          firstDayOfPrevMonth,
          lastDayOfPrevMonth
        );
        console.log("Report generated:", !!reportData);
      } catch (err) {
        console.log("Report generation failed:", err);
        errorCount++;
      }

      let emailSent = false;
      if (reportData) {
        try {
          await sendReportEmail({
            email: user.email,
            username: user.name,
            report: {
              period: reportData.period,
              totalIncome: reportData.summary.totalIncome,
              totalExpense: reportData.summary.totalExpense,
              availableBalance: reportData.summary.availableBalance,
              savingsRate: reportData.summary.savingsRate,
              topSpendingCategories: reportData.topCategories,
              insights: reportData.insights,
            },
            frequency: setting.frequency,
          });
          emailSent = true;
          console.log(`Email sent successfully to ${user.email}`);
        } catch (error) {
          console.log(`Email failed for ${user.email}:`, error.message);
          console.log("Full email error:", error);
          emailSent = false;
          errorCount++;
        }
      }

      try {
        await mongoSession.withTransaction(async () => {
          const bulkReports = [];
          const bulkSettings = [];

          if (reportData && emailSent) {
            bulkReports.push({
              insertOne: {
                document: {
                  userId: user._id,
                  sentDate: now,
                  period: reportData.period,
                  status: "SENT",
                  createdAt: now,
                  updatedAt: now,
                },
              },
            });

            bulkSettings.push({
              updateOne: {
                filter: { _id: setting._id },
                update: {
                  $set: {
                    lastSentDate: now,
                    nextReportDate: calculateNextReportDate(now),
                    updatedAt: now,
                  },
                },
              },
            });
          } else {
            bulkReports.push({
              insertOne: {
                document: {
                  userId: user._id,
                  sentDate: now,
                  period:
                    reportData?.period ||
                    `${firstDayOfPrevMonth.toISOString().split("T")[0]} to ${
                      lastDayOfPrevMonth.toISOString().split("T")[0]
                    }`,
                  status: reportData ? "FAILED" : "NO_ACTIVITY",
                  createdAt: now,
                  updatedAt: now,
                },
              },
            });

            bulkSettings.push({
              updateOne: {
                filter: { _id: setting._id },
                update: {
                  $set: {
                    lastSentDate: null,
                    nextReportDate: calculateNextReportDate(now),
                    updatedAt: now,
                  },
                },
              },
            });
          }

          await Promise.all([
            Report.bulkWrite(bulkReports, {
              session: mongoSession,
              ordered: false,
            }),
            ReportSetting.bulkWrite(bulkSettings, {
              session: mongoSession,
              ordered: false,
            }),
          ]);
        });
      } catch (Error) {
        console.error("Transaction failed for user:", user._id, Error.message);
      }

      processedCount++;
    }

    await mongoSession.endSession();
    console.log("Report cron job completed successfully");
    console.log("Processed:", processedCount, "Errors:", errorCount);

    return { success: true, processedCount, errorCount };
  } catch (error) {
    console.error("Error in processReportJob:", error.message);
    errorCount++;
    
    return {
      success: false,
      error: error.message,
    };
  }
}
