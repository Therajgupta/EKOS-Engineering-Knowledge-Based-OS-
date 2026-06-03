"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Bell, Palette, Shield, Save } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Settings" />

      <div className="flex-1 p-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Settings</h2>
            <p className="text-sm text-zinc-500 mt-0.5">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-500" />
                    <CardTitle className="text-sm">Profile Information</CardTitle>
                  </div>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-black">
                      U
                    </div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">First Name</label>
                      <Input defaultValue="User" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Last Name</label>
                      <Input defaultValue="Name" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Email</label>
                    <Input defaultValue="user@ekos.dev" type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Username</label>
                    <Input defaultValue="user" />
                  </div>
                  <Button onClick={handleSave} size="sm" className="gap-2">
                    <Save className="h-3.5 w-3.5" />
                    {saved ? "Saved!" : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-zinc-500" />
                    <CardTitle className="text-sm">API Keys</CardTitle>
                  </div>
                  <CardDescription>Manage API keys for programmatic access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-zinc-800/50 border border-zinc-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium text-zinc-300">Production Key</p>
                        <p className="text-[10px] text-zinc-600">Created Jan 15, 2024</p>
                      </div>
                      <Button variant="destructive" size="sm" className="h-7 text-xs">Revoke</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value="ek_prod_••••••••••••••••••••••••••••••••"
                        readOnly
                        className="font-mono text-xs h-8"
                      />
                      <Button variant="outline" size="sm" className="h-8 shrink-0">Copy</Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Key className="h-3.5 w-3.5" />
                    Generate New Key
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">LLM Configuration</CardTitle>
                  <CardDescription>Configure AI model settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Groq API Key</label>
                    <Input placeholder="gsk_••••••••••••••••••••••••••••••••" type="password" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Default Model</label>
                    <select className="w-full h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option>Auto (Smart Routing)</option>
                      <option>llama-3.3-70b (Always Large)</option>
                      <option>llama-3.1-8b (Always Fast)</option>
                    </select>
                  </div>
                  <Button onClick={handleSave} size="sm" className="gap-2">
                    <Save className="h-3.5 w-3.5" />
                    {saved ? "Saved!" : "Save"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-zinc-500" />
                    <CardTitle className="text-sm">Notification Preferences</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Indexing complete", desc: "When a repository finishes indexing" },
                    { label: "Indexing failed", desc: "When indexing encounters an error" },
                    { label: "Weekly digest", desc: "Summary of repository activity" },
                    { label: "Product updates", desc: "New features and improvements" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                      <div>
                        <p className="text-sm text-zinc-300">{item.label}</p>
                        <p className="text-xs text-zinc-600">{item.desc}</p>
                      </div>
                      <button className="h-5 w-9 rounded-full bg-emerald-500 relative transition-colors">
                        <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-zinc-500" />
                    <CardTitle className="text-sm">Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Current Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">New Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Confirm New Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button size="sm">Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
