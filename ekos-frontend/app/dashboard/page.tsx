"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileCode, Brain, GitBranch, Zap, Plus, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { StatsCard } from "@/components/repository/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { API } from "@/lib/api";

interface RepoInfo {
  name: string;
  total_objects: number;
  total_files: number;
  chunk_types: Record<string, number>;
}

export default function DashboardPage() {
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API}/health`)
      .then((r) => r.json())
      .then(() => {
        setBackendOnline(true);
        return fetch(`${API}/repositories`);
      })
      .then((r) => r.json())
      .then((d) => setRepos(d.repositories || []))
      .catch(() => setBackendOnline(false));
  }, []);

  const totalFiles = repos.reduce((a, r) => a + (r.total_files || 0), 0);
  const totalObjects = repos.reduce((a, r) => a + (r.total_objects || 0), 0);

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">
        {/* Backend offline banner */}
        {backendOnline === false && (
          <div className="rounded-lg border border-amber-800 bg-amber-900/20 px-4 py-3 text-sm text-amber-400 flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0" />
            Backend is offline. Run:
            <code className="bg-zinc-800 px-2 py-0.5 rounded text-xs ml-1">
              python -m uvicorn backend.api:app --reload
            </code>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Welcome to EKOS</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {repos.length > 0
                ? `${repos.length} ${repos.length === 1 ? "repository" : "repositories"} indexed · ${totalObjects.toLocaleString()} knowledge objects`
                : "No repositories indexed yet"}
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Repository
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Repositories" value={repos.length} icon={GitBranch} color="emerald" index={0} />
          <StatsCard title="Total Files" value={totalFiles} icon={FileCode} color="blue" index={1} />
          <StatsCard title="Knowledge Objects" value={totalObjects} icon={Brain} color="purple" index={2} />
          <StatsCard
            title="Backend"
            value={backendOnline === null ? "..." : backendOnline ? "Online" : "Offline"}
            icon={Zap}
            color={backendOnline ? "emerald" : "amber"}
            index={3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repositories */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-300">Indexed Repositories</h3>
              <Link href="/dashboard/repositories">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {repos.length === 0 ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center gap-3 text-zinc-600">
                  <GitBranch className="h-8 w-8" />
                  <p className="text-sm">No repositories indexed yet</p>
                  <Link href="/dashboard/upload">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      Index your first repository
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              repos.slice(0, 4).map((repo, i) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:border-zinc-700 transition-colors group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-zinc-500" />
                          <span className="font-medium text-zinc-200 text-sm">{repo.name}</span>
                          <Badge variant="success" className="text-[10px]">Indexed</Badge>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href="/dashboard/chat">
                            <Button variant="ghost" size="sm" className="h-6 text-xs">Chat</Button>
                          </Link>
                          <Link href="/dashboard/insights">
                            <Button variant="outline" size="sm" className="h-6 text-xs">Insights</Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                        <span className="text-emerald-400 font-mono font-medium">
                          {(repo.total_objects || 0).toLocaleString()} objects
                        </span>
                        <span>{repo.total_files || 0} files</span>
                        {Object.keys(repo.chunk_types || {}).slice(0, 3).map((t) => (
                          <span key={t} className="bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-[10px] text-zinc-500">
                            {t}: {repo.chunk_types[t]}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">Quick Actions</h3>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-zinc-500">Get Started</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <Link href="/dashboard/upload" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                    <GitBranch className="h-3.5 w-3.5 text-blue-400" />
                    Index a GitHub repository
                  </Button>
                </Link>
                <Link href="/dashboard/chat" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                    <Brain className="h-3.5 w-3.5 text-emerald-400" />
                    Chat with a codebase
                  </Button>
                </Link>
                <Link href="/dashboard/insights" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    Explore insights
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pipeline status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-zinc-500">Pipeline Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {[
                  { label: "Embedder", detail: "BAAI/bge-small-en-v1.5", ok: backendOnline },
                  { label: "Vector DB", detail: "Qdrant (local)", ok: backendOnline },
                  { label: "LLM Router", detail: "8B / 70B routing", ok: backendOnline },
                  { label: "Groq API", detail: "llama-3.1 + 3.3", ok: backendOnline },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400">{item.label}</p>
                      <p className="text-[10px] text-zinc-600">{item.detail}</p>
                    </div>
                    <div className={`h-1.5 w-1.5 rounded-full ${item.ok ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
