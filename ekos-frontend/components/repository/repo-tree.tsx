"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Folder, FolderOpen, FileCode, FileText, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  name: string;
  type: "file" | "folder";
  language?: string;
  children?: TreeNode[];
}

interface RepoTreeProps {
  nodes: TreeNode[];
  depth?: number;
}

const fileIcons: Record<string, React.ElementType> = {
  javascript: FileCode,
  typescript: FileCode,
  jsx: FileCode,
  tsx: FileCode,
  python: FileCode,
  json: FileJson,
  markdown: FileText,
  text: FileText,
};

const fileColors: Record<string, string> = {
  javascript: "text-yellow-400",
  typescript: "text-blue-400",
  jsx: "text-cyan-400",
  tsx: "text-cyan-400",
  python: "text-blue-300",
  json: "text-amber-400",
  markdown: "text-zinc-400",
};

function TreeNodeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 w-full text-left py-0.5 px-2 rounded hover:bg-zinc-800 transition-colors group"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <ChevronRight
            className={cn("h-3 w-3 text-zinc-600 transition-transform shrink-0", open && "rotate-90")}
          />
          {open ? (
            <FolderOpen className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs text-zinc-300 font-medium">{node.name}</span>
        </button>
        <AnimatePresence>
          {open && node.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {node.children.map((child, i) => (
                <TreeNodeItem key={i} node={child} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const lang = node.language || "text";
  const Icon = fileIcons[lang] || FileCode;
  const color = fileColors[lang] || "text-zinc-500";

  return (
    <button
      className="flex items-center gap-1.5 w-full text-left py-0.5 px-2 rounded hover:bg-zinc-800 transition-colors"
      style={{ paddingLeft: `${depth * 16 + 8 + 16}px` }}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", color)} />
      <span className="text-xs text-zinc-400">{node.name}</span>
    </button>
  );
}

export function RepoTree({ nodes, depth = 0 }: RepoTreeProps) {
  return (
    <div className="font-mono">
      {nodes.map((node, i) => (
        <TreeNodeItem key={i} node={node} depth={depth} />
      ))}
    </div>
  );
}
