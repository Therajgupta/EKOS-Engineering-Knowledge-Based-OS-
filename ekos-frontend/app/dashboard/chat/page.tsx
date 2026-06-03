"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, GitBranch, ChevronDown, Plus, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exampleQuestions } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { API } from "@/lib/api";

interface Citation {
  file: string;
  full_path: string;
  chunk_type: string;
  symbol_name: string;
  start_line: number | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  route?: string;
  citations?: Citation[];
}

interface RepoInfo {
  name: string;
  total_objects: number;
  total_files: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<RepoInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check backend health and load repositories
  useEffect(() => {
    fetch(`${API}/health`)
      .then((r) => r.json())
      .then(() => {
        setBackendOnline(true);
        return fetch(`${API}/repositories`);
      })
      .then((r) => r.json())
      .then((data) => {
        const list: RepoInfo[] = data.repositories || [];
        setRepos(list);
        if (list.length > 0) setSelectedRepo(list[0]);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (question?: string) => {
    const q = (question || input).trim();
    if (!q || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          repository: selectedRepo?.name ?? null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Backend error");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          route: data.route,
          citations: data.citations || [],
        },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not reach the backend.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${msg}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-zinc-800 flex items-center px-4 gap-3">

          {/* Backend status */}
          <div className={cn(
            "h-2 w-2 rounded-full shrink-0",
            backendOnline === null ? "bg-zinc-600 animate-pulse" :
            backendOnline ? "bg-emerald-500" : "bg-red-500"
          )} title={backendOnline ? "Backend online" : "Backend offline"} />

          {/* Repo selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs hover:border-zinc-700 transition-colors"
            >
              <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-zinc-300 font-medium">
                {selectedRepo ? selectedRepo.name : "No repository indexed"}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 left-0 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-10 overflow-hidden"
                >
                  {repos.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-zinc-500">
                      No repositories indexed yet.{" "}
                      <a href="/dashboard/upload" className="text-emerald-400 underline">
                        Add one
                      </a>
                    </div>
                  ) : (
                    repos.map((repo) => (
                      <button
                        key={repo.name}
                        onClick={() => { setSelectedRepo(repo); setShowDropdown(false); }}
                        className="w-full text-left px-3 py-2.5 hover:bg-zinc-800 transition-colors"
                      >
                        <p className="text-xs text-zinc-200 font-medium">{repo.name}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">
                          {repo.total_objects?.toLocaleString()} objects · {repo.total_files} files
                        </p>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedRepo && (
            <>
              <span className="text-xs text-zinc-600">·</span>
              <span className="text-xs text-zinc-500">
                {selectedRepo.total_objects?.toLocaleString()} knowledge objects
              </span>
            </>
          )}

          {backendOnline === false && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 ml-2">
              <AlertCircle className="h-3.5 w-3.5" />
              Backend offline — start with{" "}
              <code className="bg-zinc-800 px-1 rounded">python -m uvicorn backend.api:app --reload</code>
            </div>
          )}

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-7 w-7"
              onClick={() => setMessages([])}
            >
              <Trash2 className="h-3.5 w-3.5 text-zinc-600" />
            </Button>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6"
            >
              <div className="text-center">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-1">
                  {selectedRepo ? `Chat with ${selectedRepo.name}` : "No repository indexed"}
                </h3>
                <p className="text-xs text-zinc-600">
                  {selectedRepo
                    ? "Ask anything about the codebase"
                    : "Index a repository first to start chatting"}
                </p>
              </div>

              {selectedRepo && (
                <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
                  {exampleQuestions.slice(0, 6).map((q, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => send(q)}
                      className="text-left px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800 transition-colors text-xs text-zinc-400"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  route={msg.route}
                  citations={msg.citations?.map((c) => ({
                    file: c.file,
                    line: c.start_line ?? undefined,
                  }))}
                />
              ))}
              {loading && <ChatMessage role="assistant" content="" isLoading />}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 items-end bg-zinc-900 border border-zinc-800 rounded-xl p-2 focus-within:border-zinc-700 transition-colors">
              <textarea
                ref={inputRef}
                rows={1}
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 resize-none outline-none px-2 py-1 max-h-32"
                placeholder={
                  selectedRepo
                    ? `Ask about ${selectedRepo.name}...`
                    : "Index a repository to start asking questions..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || !selectedRepo}
                style={{ minHeight: "36px" }}
              />
              <Button
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => send()}
                disabled={!input.trim() || loading || !selectedRepo}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-zinc-700 text-center mt-2">
              Enter to send · Shift+Enter for new line · Answers grounded in real code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
