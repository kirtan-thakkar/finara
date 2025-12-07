import { ConnectDb } from "@/app/lib/Mongodb";
import { Transactions } from "@/models/Transaction";
export async function processRecurringTransactions() {
  try {
    await ConnectDb();
    const now = new Date().toISOString().split('T')[0];
    const recurringTransactions = await Transactions.find({
      isRecurring: true,
      recurringFrequency: { $exists: true },
    }).populate('userId', 'email name');
    
    let createdCount = 0;
    let errorCount = 0;
    
    for (const recurringTransaction of recurringTransactions) {
      try {
        const shouldCreate = await shouldCreateRecurringTransaction(recurringTransaction, now);
        if (shouldCreate) {
          
          const newTransaction = Transactions.create({
            userId: recurringTransaction.userId._id,
            title: recurringTransaction.title,
            type: recurringTransaction.type,
            amount: recurringTransaction.amount,
            category: recurringTransaction.category,
            date: now,
            description: `${recurringTransaction.description} (Auto-created from recurring Transaction)`,
            paymentMethod: recurringTransaction.paymentMethod,
            isRecurring: false, 
          });
          
          await newTransaction.save();
          createdCount++;
          
          console.log("Transaction created.");
        }
        
      } catch (error) {
        console.error('Internal Server Error',error.message);
        errorCount++;
      }
    }
    
    const result = {
      success: true,
      processed: recurringTransactions.length,
      created: createdCount,
      errors: errorCount,
      date: now,
      message: `Processed ${recurringTransactions.length} recurring Transactions, created ${createdCount} new Transactions`
    };
    return result;
  } catch (error) {
    console.error("Error in processRecurringTransactions:", error.message);
    return {
      success: false,
      error: error.message,
      date: new Date().toISOString().split('T')[0]
    };
  }
}


async function shouldCreateRecurringTransaction(recurringTransaction, now) {
  try {
    const existingToday = await Transactions.findOne({
      recurringParentId: recurringTransaction._id,
      date: today
    });
    
    if (existingToday) {
      console.log(`Transaction already created today for: ${recurringTransaction.title}`);
      return false;
    }
    switch (recurringTransaction.recurringFrequency) {
      case 'DAILY':
        return true; 
      case 'WEEKLY':
        const originalDate = new Date(recurringTransaction.recurringStartDate || recurringTransaction.date);
        const todayDate = new Date(today);
        return originalDate.getDay() === todayDate.getDay();
        
      case 'MONTHLY':
        const originalDay = new Date(recurringTransaction.recurringStartDate || recurringTransaction.date).getDate();
        const todayDay = new Date(today).getDate();
        return originalDay === todayDay;
      
      default:
        return false;
    }
    
  } catch (error) {
    console.error("Error in shouldCreateRecurringTransaction:", error.message);
    return false;
  }
}