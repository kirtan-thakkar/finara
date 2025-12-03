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
