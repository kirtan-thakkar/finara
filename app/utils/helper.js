import { generateContent } from "../lib/google";
export const calculateNextReportDate = (lastSentDate) => {
  const now = new Date();
  const lastSent = lastSentDate ? new Date(lastSentDate) : now;
  // Create a new date for the first day of next month
  const newDate = new Date(lastSent.getFullYear(), lastSent.getMonth() + 1, 1);
  newDate.setHours(0, 0, 0, 0); // start of the day
  return newDate;
};
export const calculateNextOccurrenceDate = (date, recurringInterval) => {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  switch (recurringInterval) {
    case "DAILY":
      base.setDate(base.getDate() + 1);
      return base;

    case "WEEKLY":
      base.setDate(base.getDate() + 7);
      return base;

    case "MONTHLY":
      base.setMonth(base.getMonth() + 1);
      return base;

    case "YEARLY":
      base.setFullYear(base.getFullYear() + 1);
      return base;

    default:
      throw new Error("Invalid recurring interval");
  }
};

export const calculateSavingsRate = (totalIncome, totalExpenses) => {
  if (totalIncome === 0) return 0;
  const savings = totalIncome - totalExpenses;
  return (savings / totalIncome) * 100;
};

export async function generateInsightsAI({
  totalIncome,
  totalExpense,
  availableBalance,
  categories,
  savingsRate,
}) {
  try {
    const prompt = `
You are a smart personal finance assistant inside a money tracking app.

User financial data:
Income: ₹${totalIncome.toFixed(2)}
Expense: ₹${totalExpense.toFixed(2)}
Balance: ₹${availableBalance.toFixed(2)}
Savings Rate: ${savingsRate.toFixed(1)}%
Top Categories: ${
      categories.length
        ? categories
            .map((cat) => `${cat._id}: ₹${cat.total.toFixed(2)}`)
            .join(", ")
        : "No category data"
    }

Return output in EXACTLY this format (no markdown, no headings, no extra text):

Health: <Excellent / Good / Fair / Needs Improvement>
One-line problem summary
3 short bullet action steps
One short motivational tip

Keep the entire response under 80 words.
`;

    const result = await generateContent(prompt);
    const text = result.text;
    ("No insights generated.");
    return text;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw new Error(`Failed to generate insights: ${error.message}`);
  }
}

export const generateReportService = async (userId, fromDate, toDate) => {
  const { Transactions } = await import("@/models/Transaction");
  const mongoose = await import("mongoose");
  
  const results = await Transactions.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
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
            $match: { type: "EXPENSE" },
          },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
          {
            $sort: { total: -1 },
          },
          {
            $limit: 5,
          },
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

  if (!results.length || !results[0] || (results[0].totalIncome === 0 && results[0].totalExpense === 0)) {
    return null;
  }

  const {
    totalIncome = 0,
    totalExpense = 0,
    categories = [],
  } = results[0] || {};

  const availableBalance = totalIncome - totalExpense;
  const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
  
  const periodLabel = `${fromDate.toISOString().split('T')[0]} - ${toDate.toISOString().split('T')[0]}`;

  let insights = null;
  if (totalIncome === 0 && totalExpense === 0) {
    insights = "No financial activity found for this period. Start tracking income and expenses to receive personalized insights.";
  } else {
    try {
      insights = await generateInsightsAI({
        totalIncome,
        totalExpense,
        availableBalance,
        categories,
        savingsRate,
      });
    } catch (error) {
      console.error("Failed to generate insights:", error);
      insights = "AI insights are temporarily unavailable. Please try again later.";
    }
  }

  return {
    period: {
      from: fromDate.toISOString().split('T')[0],
      to: toDate.toISOString().split('T')[0],
    },
    summary: {
      totalIncome,
      totalExpense,
      availableBalance,
      savingsRate: Number(savingsRate.toFixed(1)),
    },
    topCategories: categories,
    insights,
    generatedAt: new Date().toISOString(),
  };
};
