"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, CheckCircle, Loader2, ArrowRight, Link as LinkIcon, AlertCircle
} from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { API } from "@/lib/api";

const STEP_LABELS: Record<string, { label: string; description: string }> = {
  starting:   { label: "Initialising",          description: "Setting up indexing pipeline" },
  cloning:    { label: "Repository Cloning",    description: "Fetching repository from GitHub" },
  parsing:    { label: "File Discovery",         description: "Scanning source files" },
  extracting: { label: "Knowledge Extraction",  description: "AST parsing with Tree-sitter" },
  embedding:  { label: "Embedding Generation",  description: "Encoding with BAAI/bge-small-en-v1.5" },
  done:       { label: "Qdrant Indexing",        description: "Stored in vector database" },
  error:      { label: "Error",                  description: "Indexing failed" },
};

const STEP_ORDER = ["starting", "cloning", "parsing", "extracting", "embedding", "done"];

type StepStatus = "pending" | "running" | "done" | "error";

function getStepStatuses(currentStep: string): StepStatus[] {
  const idx = STEP_ORDER.indexOf(currentStep);
  return STEP_ORDER.map((_, i) => {
    if (currentStep === "error") return i === 0 ? "error" : "pending";
    if (i < idx) return "done";
    if (i === idx) return currentStep === "done" ? "done" : "running";
    return "pending";
  });
}

export default function UploadPage() {
  const [url, setUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [isIndexing, setIsIndexing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [currentStep, setCurrentStep] = useState("starting");
  const [objectsIndexed, setObjectsIndexed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [finalRepoName, setFinalRepoName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsIndexing(true);
    setIsDone(false);
    setIsFailed(false);
    setError(null);
    setCurrentStep("starting");
    setObjectsIndexed(0);

    try {
      // kick off indexing
      const initRes = await fetch(`${API}/index`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_url: url.trim(),
          repo_name: repoName.trim() || null,
        }),
      });

      if (!initRes.ok) {
        const err = await initRes.json().catch(() => ({ detail: initRes.statusText }));
        throw new Error(err.detail || "Failed to start indexing");
      }

      const initData = await initRes.json();
      const rName = initData.repo_name;
      setFinalRepoName(rName);

      // poll status every 1.5s
      const poll = setInterval(async () => {
        try {
          const res = await fetch(`${API}/index/${rName}/status`);
          const data = await res.json();

          setCurrentStep(data.step || "starting");
          setObjectsIndexed(data.objects_indexed || 0);

          if (data.status === "completed") {
            clearInterval(poll);
            setCurrentStep("done");
            setIsIndexing(false);
            setIsDone(true);
          } else if (data.status === "failed") {
            clearInterval(poll);
            setIsIndexing(false);
            setIsFailed(true);
            setError(data.error || "Unknown error");
          }
        } catch {
          // network blip — keep polling
        }
      }, 1500);

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setIsIndexing(false);
      setIsFailed(true);
    }
  };

  const stepStatuses = getStepStatuses(isFailed ? "error" : currentStep);
  const stepIdx = STEP_ORDER.indexOf(currentStep);
  const progress = isDone
    ? 100
    : isFailed
    ? 0
    : Math.round(((stepIdx + 0.5) / STEP_ORDER.length) * 100);

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Add Repository" />

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Index a Repository</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Paste a GitHub URL. EKOS will clone, parse, embed, and index it into Qdrant.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">GitHub URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <Input
                      placeholder="https://github.com/user/repository"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-9"
                      disabled={isIndexing}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">
                    Repository Name <span className="text-zinc-600">(optional)</span>
                  </label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <Input
                      placeholder="auto-detected from URL"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="pl-9"
                      disabled={isIndexing}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!url.trim() || isIndexing}
                  className="w-full gap-2"
                >
                  {isIndexing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Indexing...</>
                  ) : (
                    <>Start Indexing<ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Progress */}
          <AnimatePresence>
            {(isIndexing || isDone || isFailed) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-300">
                        {isDone
                          ? "✓ Indexing Complete"
                          : isFailed
                          ? "✗ Indexing Failed"
                          : "Indexing in Progress..."}
                      </span>
                      {!isFailed && (
                        <span className="text-xs font-mono text-emerald-400">{progress}%</span>
                      )}
                    </div>

                    {!isFailed && <Progress value={progress} className="h-1.5" />}

                    {objectsIndexed > 0 && (
                      <p className="text-xs text-zinc-500">
                        {objectsIndexed.toLocaleString()} objects indexed so far...
                      </p>
                    )}

                    <div className="space-y-3">
                      {STEP_ORDER.map((stepKey, i) => {
                        const status = stepStatuses[i];
                        const info = STEP_LABELS[stepKey];
                        return (
                          <motion.div
                            key={stepKey}
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: status !== "pending" ? 1 : 0.4 }}
                            className="flex items-center gap-3"
                          >
                            <div className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                              status === "done"    ? "bg-emerald-500/20" :
                              status === "running" ? "bg-amber-500/20"   :
                              status === "error"   ? "bg-red-500/20"     :
                              "bg-zinc-800"
                            )}>
                              {status === "done"    && <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />}
                              {status === "running" && <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin" />}
                              {status === "error"   && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
                              {status === "pending" && <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />}
                            </div>
                            <div>
                              <p className={cn(
                                "text-xs font-medium",
                                status === "done"    ? "text-zinc-300" :
                                status === "running" ? "text-amber-300" :
                                status === "error"   ? "text-red-400"   :
                                "text-zinc-600"
                              )}>
                                {info.label}
                              </p>
                              <p className="text-[10px] text-zinc-600">{info.description}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {error && (
                      <div className="rounded-lg bg-red-900/20 border border-red-800 px-3 py-2">
                        <p className="text-xs text-red-400 font-mono">{error}</p>
                      </div>
                    )}

                    {isDone && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-3 border-t border-zinc-800 flex gap-3"
                      >
                        <Button size="sm" className="gap-2" asChild>
                          <a href="/dashboard/chat">
                            Start Chatting
                            <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/dashboard/repositories">View Repository</a>
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
