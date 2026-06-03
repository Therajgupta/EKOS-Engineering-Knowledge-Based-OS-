"use client";

import { motion } from "framer-motion";
import { FileCode, Brain, Layers, Route, GitBranch, MessageSquare } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { StatsCard } from "@/components/repository/stats-card";
import { RepoTree } from "@/components/repository/repo-tree";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dummyRepositories, dummyRepoTree } from "@/lib/dummy-data";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function RepositoryOverviewPage({ params }: { params: { id: string } }) {
  const repo = dummyRepositories.find((r) => r.id === params.id) || dummyRepositories[0];

  const componentData = [
    { name: "Components", value: repo.components },
    { name: "Controllers", value: 8 },
    { name: "Models", value: 5 },
    { name: "Middleware", value: 4 },
    { name: "Utils", value: 9 },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar title={repo.name} />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="h-4 w-4 text-zinc-500" />
              <h2 className="text-xl font-semibold text-zinc-100">{repo.name}</h2>
              <Badge variant="success">Indexed</Badge>
            </div>
            <p className="text-sm text-zinc-500">{repo.description}</p>
          </div>
          <Link href={`/dashboard/chat?repo=${repo.id}`}>
            <Button size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat with Repo
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Files" value={repo.files} icon={FileCode} color="blue" index={0} />
          <StatsCard title="Knowledge Objects" value={repo.knowledgeObjects} icon={Brain} color="purple" index={1} />
          <StatsCard title="Components" value={repo.components} icon={Layers} color="emerald" index={2} />
          <StatsCard title="Routes" value={repo.routes} icon={Route} color="amber" index={3} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tree">File Tree</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Language Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Language Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={repo.languages}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          dataKey="percentage"
                          strokeWidth={0}
                        >
                          {repo.languages.map((lang, i) => (
                            <Cell key={i} fill={lang.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 flex-1">
                      {repo.languages.map((lang, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: lang.color }} />
                            <span className="text-xs text-zinc-400">{lang.name}</span>
                          </div>
                          <span className="text-xs font-mono text-zinc-300">{lang.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Component Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Component Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={componentData} barSize={20}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: "#71717a" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #27272a",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#e4e4e7",
                        }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tree" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Repository Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <RepoTree nodes={dummyRepoTree} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    { action: "Indexed", time: "2 hours ago", detail: "312 knowledge objects extracted" },
                    { action: "Chat session", time: "3 hours ago", detail: "8 queries answered" },
                    { action: "Re-indexed", time: "1 day ago", detail: "Updated after new commits" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-zinc-800 last:border-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <div>
                        <p className="text-xs text-zinc-300 font-medium">{item.action}</p>
                        <p className="text-[10px] text-zinc-600">{item.detail} · {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
