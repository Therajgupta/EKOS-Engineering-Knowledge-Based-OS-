"use client";

import { motion } from "framer-motion";
import { FileCode, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Citation {
  file: string;
  line?: number;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  route?: string;
  citations?: Citation[];
  isLoading?: boolean;
}

export function ChatMessage({ role, content, route, citations, isLoading }: ChatMessageProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="flex gap-3 max-w-2xl">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex", role === "user" ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex gap-3 max-w-2xl", role === "user" && "flex-row-reverse")}>
        {role === "assistant" && (
          <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
              role === "user"
                ? "bg-emerald-600 text-white rounded-tr-sm"
                : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm"
            )}
          >
            {content}
          </div>

          {citations && citations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {citations.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-md px-2 py-0.5 font-mono"
                >
                  <FileCode className="h-2.5 w-2.5 text-emerald-400" />
                  {c.file}
                  {c.line && <span className="text-zinc-600">:{c.line}</span>}
                </span>
              ))}
            </div>
          )}

          {route && role === "assistant" && (
            <span className="text-[10px] text-zinc-600">
              via {route === "small" ? "llama-3.1-8b" : "llama-3.3-70b"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
