"use client";

import { motion } from "framer-motion";
import { Brain, Route, Database, Package, Star, FileCode, GitBranch, ChevronDown } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dummyInsights, dummyRepositories } from "@/lib/dummy-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

const methodColors: Record<string, string> = {
  GET: "text-emerald-400 bg-emerald-400/10",
  POST: "text-blue-400 bg-blue-400/10",
  PUT: "text-amber-400 bg-amber-400/10",
  DELETE: "text-red-400 bg-red-400/10",
  PATCH: "text-purple-400 bg-purple-400/10",
};

const depTypeColors: Record<string, string> = {
  runtime: "text-emerald-400",
  dev: "text-zinc-500",
};

export default function InsightsPage() {
  const [selectedRepo, setSelectedRepo] = useState(dummyRepositories[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Insights" />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Repository Insights</h2>
            <p className="text-sm text-zinc-500 mt-0.5">AI-generated analysis of your codebase</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm hover:border-zinc-700 transition-colors"
            >
              <GitBranch className="h-4 w-4 text-emerald-400" />
              <span className="text-zinc-300">{selectedRepo.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>
            {showDropdown && (
              <div className="absolute top-full mt-1 right-0 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-10 overflow-hidden">
                {dummyRepositories.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => { setSelectedRepo(repo); setShowDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    {repo.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Architecture Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-emerald-400" />
                </div>
                <CardTitle className="text-sm">Architecture Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 leading-relaxed">{dummyInsights.architectureSummary}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Important Components */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-purple-400/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-purple-400" />
                  </div>
                  <CardTitle className="text-sm">Most Important Components</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dummyInsights.importantComponents.map((comp, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-zinc-200">{comp.name}</span>
                        <Badge variant="secondary" className="text-[10px] py-0">{comp.type}</Badge>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-mono truncate">{comp.file}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${comp.importance}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 w-6 text-right">{comp.importance}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* API Endpoints */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-400/10 flex items-center justify-center">
                    <Route className="h-4 w-4 text-blue-400" />
                  </div>
                  <CardTitle className="text-sm">API Endpoints</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {dummyInsights.apiEndpoints.map((ep, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 w-12 text-center",
                      methodColors[ep.method] || "text-zinc-400 bg-zinc-800"
                    )}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono text-zinc-300 truncate">{ep.path}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Database Models */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-400/10 flex items-center justify-center">
                    <Database className="h-4 w-4 text-amber-400" />
                  </div>
                  <CardTitle className="text-sm">Database Models</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dummyInsights.databaseModels.map((model, i) => (
                  <div key={i} className="rounded-lg bg-zinc-800/50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCode className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs font-semibold text-zinc-200">{model.name}</span>
                      <span className="text-[10px] text-zinc-600 font-mono ml-auto">{model.file}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {model.fields.map((field, j) => (
                        <span key={j} className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Dependencies */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-cyan-400" />
                  </div>
                  <CardTitle className="text-sm">Key Dependencies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {dummyInsights.dependencies.map((dep, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-200">{dep.name}</span>
                        <span className="text-[10px] text-zinc-600">{dep.version}</span>
                      </div>
                      <p className="text-[10px] text-zinc-600">{dep.usage}</p>
                    </div>
                    <span className={cn("text-[10px] font-medium", depTypeColors[dep.type] || "text-zinc-500")}>
                      {dep.type}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
