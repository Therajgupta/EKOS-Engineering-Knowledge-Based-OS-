"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { value: number; label: string };
  color?: "emerald" | "blue" | "purple" | "amber";
  index?: number;
}

const colorMap = {
  emerald: "text-emerald-400 bg-emerald-400/10",
  blue: "text-blue-400 bg-blue-400/10",
  purple: "text-purple-400 bg-purple-400/10",
  amber: "text-amber-400 bg-amber-400/10",
};

export function StatsCard({ title, value, icon: Icon, description, trend, color = "emerald", index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
    >
      <Card className="hover:border-zinc-700 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-1">{title}</p>
              <p className="text-2xl font-bold text-zinc-100 font-mono">
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
              {description && (
                <p className="text-xs text-zinc-600 mt-1">{description}</p>
              )}
              {trend && (
                <p className={cn("text-xs mt-1", trend.value >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
                </p>
              )}
            </div>
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", colorMap[color])}>
              <Icon className="h-4.5 w-4.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
