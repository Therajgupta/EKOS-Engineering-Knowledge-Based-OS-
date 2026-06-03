"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, RefreshCw, Brain, FileCode, Layers } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { API } from "@/lib/api";

interface RepoInfo {
  name: string;
  status: string;
  total_objects: number;
  total_files: number;
  chunk_types: Record<string, number>;
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/repositories`)
      .then((r) => r.json())
      .then((data) => {
        setRepos(data.repositories || []);
        setError(null);
      })
      .catch(() => setError("Cannot connect to backend. Make sure it's running on port 8000."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Repositories" />

      <div className="flex-1 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Repositories</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {repos.length} {repos.length === 1 ? "repository" : "repositories"} indexed
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={load}>
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </Button>
            <Link href="/dashboard/upload">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Repository
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <Input
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading repositories...
          </div>
        )}

        {/* List */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((repo, i) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group hover:border-zinc-700 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-100">{repo.name}</h3>
                          <Badge variant="success" className="text-[10px]">Indexed</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="rounded-lg bg-zinc-800/50 px-3 py-2 text-center">
                        <p className="text-lg font-bold font-mono text-emerald-400">
                          {(repo.total_objects || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 mt-0.5">
                          <Brain className="h-2.5 w-2.5" />Objects
                        </p>
                      </div>
                      <div className="rounded-lg bg-zinc-800/50 px-3 py-2 text-center">
                        <p className="text-lg font-bold font-mono text-blue-400">
                          {(repo.total_files || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 mt-0.5">
                          <FileCode className="h-2.5 w-2.5" />Files
                        </p>
                      </div>
                      <div className="rounded-lg bg-zinc-800/50 px-3 py-2 text-center">
                        <p className="text-lg font-bold font-mono text-purple-400">
                          {Object.keys(repo.chunk_types || {}).length}
                        </p>
                        <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 mt-0.5">
                          <Layers className="h-2.5 w-2.5" />Types
                        </p>
                      </div>
                    </div>

                    {/* Chunk type breakdown */}
                    {repo.chunk_types && Object.keys(repo.chunk_types).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {Object.entries(repo.chunk_types).map(([type, count]) => (
                          <span key={type} className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded">
                            {type}: {count}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/chat`} className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full h-7 text-xs gap-1">
                          Chat
                        </Button>
                      </Link>
                      <Link href={`/dashboard/insights`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-7 text-xs gap-1">
                          Insights
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
            <Brain className="h-10 w-10" />
            <p className="text-sm">
              {repos.length === 0
                ? "No repositories indexed yet."
                : "No repositories match your search."}
            </p>
            {repos.length === 0 && (
              <Link href="/dashboard/upload">
                <Button size="sm" variant="outline" className="gap-2 mt-2">
                  <Plus className="h-3.5 w-3.5" />
                  Index your first repository
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
