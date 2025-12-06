import { NextResponse } from "next/server";
import {generateContent} from "../lib/google"
export const calculateNextReportDate = (lastSentDate) => {
    const now = new Date();
    const lastSent = lastSentDate ? new Date(lastSentDate) : now;
    // Create a new date for the first day of next month
    const newDate = new Date(lastSent.getFullYear(), lastSent.getMonth() + 1, 1);
    newDate.setHours(0,0,0,0) // start of the day
    return newDate;
}
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
}

export async function generateInsightsAI({ totalIncome, totalExpense, availableBalance, categories, savingsRate }) {
  try{
    const prompt = `You are a professional financial advisor AI assistant. Analyze the following monthly financial data and provide personalized, actionable insights.

## Financial Summary:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpense.toFixed(2)}
- Available Balance (Net Savings): ₹${availableBalance.toFixed(2)}
- Savings Rate: ${savingsRate.toFixed(1)}%

## Top Expense Categories:
${categories.map((cat) => `- ${cat._id}: ₹${cat.total.toFixed(2)}`).join('\n') || "No expense data available"}

## Your Task:
Provide a comprehensive financial analysis with the following structure:

### 1. Overall Financial Health Assessment
- Rate the financial health as: Excellent, Good, Fair, or Needs Improvement
- Briefly explain why

### 2. Spending Analysis
- Identify the highest spending categories
- Highlight any concerning spending patterns
- Compare spending to typical healthy budget ratios

### 3. Savings Insights
- Evaluate the current savings rate (ideal is 20%+)
- Suggest realistic savings goals based on the data

### 4. Actionable Recommendations (3-5 bullet points)
- Provide specific, practical tips to improve finances
- Suggest categories where spending could be reduced
- Recommend areas to allocate more funds if appropriate

### 5. Quick Tip of the Month
- One motivational or educational financial tip

## Output Format:
Respond in clean, readable markdown format. Keep the tone friendly, encouraging, and professional. Be specific with numbers where relevant. Keep the entire response under 400 words.`
    const result = await generateContent(prompt);
    return NextResponse.json({
      message: "Insights generated successfully",
      data: {
        insights: result.text
      }
    });

  }catch(error){
    return NextResponse.json({
      message:"Internal Server Error",
      error:error.message
    })
  }
}