import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { client } from "./app/lib/Mongodb";
import { User } from "./models/User";
import { ConnectDb } from "./app/lib/Mongodb";
import { registerSchema } from "./app/validators/validators";
import { monthlyBudgetSchema } from "./app/validators/validators";
import ReportSetting from "./models/reportSetting";
import { calculateNextReportDate } from "./app/utils/helper";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  adapter: MongoDBAdapter(client),
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      // Use email as ID since MongoDB adapter handles user creation
      session.user.id = session.user.email;
      return session;
    },
  },
  events: {
    signIn: async ({ user, account }) => {
      try {
        await ConnectDb();

        const existingUser = await User.findOne({ email: user.email });
        //hamna mate name currency monthlybudget hardcoded rakhiye che , after that when the user logins then apde ena thi details input lai ne update kari daisu model ma
        if (!existingUser) {
          const newUser = await User.create({
            email: registerSchema.email.parse(user.email),
            name: registerSchema.name.parse(user.name || "No Name"),
            monthlyBudget: monthlyBudgetSchema.parse(0),
          });

          console.log("New Finara User Created:", newUser);
        } else {
          console.log("Finara user already exists:", existingUser);
        }
      } catch (error) {
        console.error("Error in signIn event:", error);
      }

      try {
        const existingReportSetting = await ReportSetting.findOne({
          userId: user.id,
        });
        if (existingReportSetting) {
          console.log("Report setting already exists for user:", user.email);
        } else {
          const reportSetting = ReportSetting.create({
            userId: user.id,
            frequency: "MONTHLY",
            isEnabled: true,
            nextReportDate: calculateNextReportDate(),
            lastSentDate: null,
          }).then(() => {
            console.log(
              "Report setting created for user:",
              user.email,
              "having userId :",
              user.userId
            );
          });
        }
      } catch (err) {
        console.log("Error creating report setting:", err);
        throw err;
      }
    },
  },
});
