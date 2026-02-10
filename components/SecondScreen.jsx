"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Outfit } from "next/font/google";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ThirdPage from "./ThirdScreen";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Receipt,
  Wallet,
  BellRing,
  ScanLine,
  FileText,
  Check,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const bentoItems = [
  {
    id: "tracking",
    title: "Smart Expense Tracking",
    description:
      "Effortlessly log every transaction — income and expenses — with intelligent categorization and real-time balance updates.",
    feature: "services",
    services: [
      { name: "Auto-categorized Transactions", icon: Wallet, stats: "AI-powered sorting" },
      { name: "Receipt Scanning with AI", icon: ScanLine, stats: "Snap & track" },
      { name: "Recurring Expense Detection", icon: BellRing, stats: "Never miss a bill" },
      { name: "Real-time Balance Updates", icon: TrendingUp, stats: "Always accurate" },
    ],
    className: "w-full",
  },
  {
    id: "analytics",
    title: "Visual Analytics",
    description: "Understand your finances through powerful charts and breakdowns.",
    feature: "services",
    services: [
      { name: "Income vs Expenses", icon: BarChart3, stats: "Daily trends" },
      { name: "Spending Breakdown", icon: PieChart, stats: "By category" },
      { name: "Savings Growth", icon: TrendingUp, stats: "Over time" },
      { name: "Receipt Archive", icon: ScanLine, stats: "Cloud storage" },
    ],
    className: "w-full",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ── Feature Components ──

const SpotlightFeature = ({ items }) => (
  <ul className="mt-6 space-y-3">
    {items.map((item, index) => (
      <motion.li
        key={`spotlight-${index}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 * index, duration: 0.2 }}
        className="flex items-center gap-3"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0" />
        <span className={`text-sm text-gray-600 dark:text-gray-400 font-medium ${outfit.className}`}>
          {item}
        </span>
      </motion.li>
    ))}
  </ul>
);

const MetricsFeature = ({ metrics }) => {
  const [counts, setCounts] = useState(metrics.map(() => 0));

  useEffect(() => {
    metrics.forEach((metric, index) => {
      const timeout = setTimeout(() => {
        const duration = 1000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;

        const counter = setInterval(() => {
          currentFrame++;
          const progress = currentFrame / totalFrames;
          const easedProgress = 1 - (1 - progress) ** 3;
          const current = metric.value * easedProgress;

          setCounts((prev) => {
            const next = [...prev];
            next[index] = Math.min(current, metric.value);
            return next;
          });

          if (currentFrame === totalFrames) clearInterval(counter);
        }, frameRate);
      }, index * 200);
      return () => clearTimeout(timeout);
    });
  }, []);

  return (
    <div className="mt-6 space-y-4">
      {metrics.map((metric, index) => (
        <div key={metric.label} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium text-gray-600 dark:text-gray-400 ${outfit.className}`}>
              {metric.label}
            </span>
            <span className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${outfit.className}`}>
              {counts[index].toFixed(metric.suffix === "%" ? 1 : 0).replace(/\.0$/, "")}
              {metric.suffix}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gray-900 dark:bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, counts[index])}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const ServicesFeature = ({ services }) => (
  <div className="mt-6 space-y-3">
    {services.map((service, index) => {
      const Icon = service.icon;
      return (
        <motion.div
          key={`service-${index}`}
          className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index, duration: 0.2 }}
        >
          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 shrink-0 mt-0.5" />
          <div>
            <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 block ${outfit.className}`}>
              {service.name}
            </span>
            <span className={`text-xs text-gray-500 dark:text-gray-500 ${outfit.className}`}>
              {service.stats}
            </span>
          </div>
        </motion.div>
      );
    })}
  </div>
);

const ReportsFeature = ({ reports }) => (
  <div className="mt-6 space-y-3">
    {reports.map((report, index) => {
      const Icon = report.icon;
      return (
        <motion.div
          key={`report-${index}`}
          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.2 }}
        >
          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
          <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${outfit.className}`}>
            {report.name}
          </span>
        </motion.div>
      );
    })}
  </div>
);

const FeaturesFeature = ({ features }) => (
  <div className="mt-6 space-y-3">
    {features.map((feature, index) => (
      <motion.div
        key={`feature-${index}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 * index, duration: 0.2 }}
        className="flex items-center gap-3"
      >
        <Check className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
        <span className={`text-sm text-gray-600 dark:text-gray-400 font-medium ${outfit.className}`}>
          {feature}
        </span>
      </motion.div>
    ))}
  </div>
);

// ── Bento Card ──

const BentoCard = ({ item }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={cn("h-full", item.className)}
  >
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${outfit.className}`}>
          {item.title}
        </CardTitle>
        <CardDescription className={`text-gray-600 dark:text-gray-400 leading-relaxed ${outfit.className}`}>
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {item.feature === "spotlight" && item.spotlightItems && (
          <SpotlightFeature items={item.spotlightItems} />
        )}
        {item.feature === "metrics" && item.metrics && (
          <MetricsFeature metrics={item.metrics} />
        )}
        {item.feature === "services" && item.services && (
          <ServicesFeature services={item.services} />
        )}
        {item.feature === "reports" && item.reports && (
          <ReportsFeature reports={item.reports} />
        )}
        {item.feature === "features" && item.features && (
          <FeaturesFeature features={item.features} />
        )}
      </CardContent>
    </Card>
  </motion.div>
);

// ── Main Component ──

const SecondPage = () => {
  return (
    <div className="relative mt-8">
      <div className="sticky top-0 z-1">
        <div className="min-h-screen flex flex-col justify-center items-center bg-background py-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className={`${outfit.className} text-2xl sm:text-4xl md:text-5xl text-center font-medium tracking-tighter opacity-98 mb-16`}
          >
            Finnara helps you...
          </motion.h2>

          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-col md:flex-row md:items-stretch gap-4 w-full"
            >
              {bentoItems.map((item) => (
                <BentoCard key={item.id} item={item} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-2 mt-96 bg-black rounded-t-[60px] overflow-hidden">
        <ThirdPage />
      </div>
    </div>
  );
};

export default SecondPage;
