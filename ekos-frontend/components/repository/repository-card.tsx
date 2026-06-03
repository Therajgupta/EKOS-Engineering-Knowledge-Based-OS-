"use client";

import { motion } from "framer-motion";
import { GitBranch, Star, FileCode, MessageSquare, BarChart3, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  files: number;
  knowledgeObjects: number;
  status: "indexed" | "indexing" | "error";
  indexedAt: string;
}

interface RepositoryCardProps {
  repo: Repository;
  index?: number;
}

const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-blue-400",
  Go: "bg-cyan-400",
  Rust: "bg-orange-500",
  Java: "bg-red-500",
};

export function RepositoryCard({ repo, index = 0 }: RepositoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="group hover:border-zinc-700 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="h-4 w-4 text-zinc-500 shrink-0" />
                <h3 className="font-semibold text-zinc-100 truncate">{repo.name}</h3>
                {repo.status === "indexed" ? (
                  <Badge variant="success" className="shrink-0">
                    <CheckCircle className="h-2.5 w-2.5 mr-1" />
                    Indexed
                  </Badge>
                ) : repo.status === "indexing" ? (
                  <Badge variant="warning" className="shrink-0">
                    <Loader2 className="h-2.5 w-2.5 mr-1 animate-spin" />
                    Indexing
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="shrink-0">Error</Badge>
                )}
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{repo.description}</p>

              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", languageColors[repo.language] || "bg-zinc-500")} />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <FileCode className="h-3 w-3" />
                  {repo.files} files
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(repo.indexedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="font-mono text-emerald-400 font-medium">
                {repo.knowledgeObjects.toLocaleString()} objects
              </span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/dashboard/chat?repo=${repo.id}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Chat
                </Button>
              </Link>
              <Link href={`/dashboard/repositories/${repo.id}`}>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Overview
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
