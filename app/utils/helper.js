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
