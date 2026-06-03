"use client";

import { useState } from "react";
import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const [search, setSearch] = useState("");

  return (
    <header className="flex h-14 items-center gap-4 border-b border-zinc-800 bg-zinc-950 px-6">
      {title && (
        <h1 className="text-sm font-semibold text-zinc-100 mr-2">{title}</h1>
      )}

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-8 text-xs bg-zinc-900 border-zinc-800"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/dashboard/upload">
          <Button size="sm" className="h-8 text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Repository
          </Button>
        </Link>

        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </Button>

        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-black cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
