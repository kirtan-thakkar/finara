import {inngest} from "./client.js";
import { processRecurringTransactions } from "@/jobs/transaction.job";
import { processReportJob } from "@/jobs/report.job";

export const recurringTransactionCreated = inngest.createFunction(
    {
      id: 'recurring-transaction-created', 
      name: 'Recurring Transaction Created Handler'
    },
    { event: 'transactions/recurring.created' },
    async({ event, step }) => {
        console.log("✅ Recurring Transaction Created Function Triggered!");
        await step.sleep("Processing new recurring transaction...", 1000);
        return { success: true, message: "Recurring transaction setup completed" };
    }
);

export const dailyTransactionsCron = inngest.createFunction(
  {
    id: "daily-transactions-cron",
    name: "Daily Transactions Job",
  },
  {
    cron: "5 0 * * *" // Every day at 00:05 UTC
  },
  async ({ step }) => {
    console.log("Scheduling Transactions at 5 0 * * *");

    const result = await step.run(
      "process-transactions", 
      async () => {
        try {
          await processRecurringTransactions();
          console.log("Transactions completed");
          return { success: true, job: "Transactions" };
        } catch (error) {
          console.log("Transactions failed", error);
          throw error;
        }
      }
    );

    return result;
  }
);

export const monthlyReportsCron = inngest.createFunction(
  {
    id: "monthly-reports-cron",
    name: "Monthly Reports Job",
  },
  {
    cron: "30 2 1 * *"  //2:30 am on every first day of the month
  },
  async ({ step }) => {
    console.log("Starting monthly reports cron");

    const result = await step.run(
      "process-reports", 
      async () => {
        try {
          const jobResult = await processReportJob();
          console.log("Reports completed");
          return { success: true, job: "Reports", details: jobResult };
        } catch (error) {
          console.log("Reports failed:", error);
          throw error;
        }
      }
    );

    return result;
  }
);

export const functions = [
  recurringTransactionCreated,
  dailyTransactionsCron,    
  monthlyReportsCron         
];