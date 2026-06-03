"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Code2, Map, Users, Loader2, Copy, Check, GitBranch, ChevronDown } from "lucide-react";
import { TopBar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dummyRepositories } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const docTypes = [
  {
    id: "readme",
    label: "README",
    icon: FileText,
    description: "Project overview, setup instructions, and usage guide",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    id: "api",
    label: "API Docs",
    icon: Code2,
    description: "Complete API reference with endpoints and examples",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: Map,
    description: "System design, data flow, and component relationships",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    id: "onboarding",
    label: "Onboarding Guide",
    icon: Users,
    description: "Step-by-step guide for new developers joining the project",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

const generatedDocs: Record<string, string> = {
  readme: `# mern-app

A full-stack MERN (MongoDB, Express, React, Node.js) application with JWT authentication and RESTful API.

## Features

- 🔐 JWT-based authentication
- 📝 CRUD operations for posts
- 👤 User profile management
- 🔄 Redux state management
- 📱 Responsive design

## Prerequisites

- Node.js >= 16
- MongoDB (local or Atlas)
- npm or yarn

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/user/mern-app.git
cd mern-app

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../client && npm install
\`\`\`

## Environment Variables

Create a \`.env\` file in the backend directory:

\`\`\`env
MONGO_URI=mongodb://localhost:27017/mernapp
JWT_SECRET=your_jwt_secret_here
PORT=5000
\`\`\`

## Running the Application

\`\`\`bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /client)
npm start
\`\`\`

## Project Structure

\`\`\`
mern-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── client/
    └── src/
        ├── components/
        ├── features/
        └── App.jsx
\`\`\``,

  api: `# API Documentation

Base URL: \`http://localhost:5000/api\`

## Authentication

All protected routes require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## Auth Endpoints

### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64abc123",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
\`\`\`

### POST /auth/register
Create a new user account.

---

## User Endpoints

### GET /users/profile *(Protected)*
Get the authenticated user's profile.

### PUT /users/profile *(Protected)*
Update user profile information.

---

## Post Endpoints

### GET /posts
List all posts with pagination.

**Query Parameters:**
- \`page\` (default: 1)
- \`limit\` (default: 10)

### POST /posts *(Protected)*
Create a new post.

### DELETE /posts/:id *(Protected)*
Delete a post by ID.`,

  architecture: `# Architecture Documentation

## System Overview

This application follows a **3-tier architecture**:

\`\`\`
Client (React SPA)
    ↕ HTTP/REST
Backend (Express.js)
    ↕ Mongoose ODM
Database (MongoDB)
\`\`\`

## Backend Architecture

### Layered Design

\`\`\`
Routes → Controllers → Services → Models
\`\`\`

- **Routes**: Define API endpoints and apply middleware
- **Controllers**: Handle request/response logic
- **Models**: Mongoose schemas and database operations

### Authentication Flow

\`\`\`
Request → AuthMiddleware → JWT Verify → Attach User → Controller
\`\`\`

## Frontend Architecture

### State Management

Redux Toolkit with RTK Query for API calls:

\`\`\`
Components → Dispatch Actions → Redux Store → Selectors → Components
\`\`\`

### Data Flow

\`\`\`
User Action → Component → RTK Query → API → Backend → MongoDB
\`\`\`

## Key Design Decisions

1. **JWT over Sessions**: Stateless authentication for scalability
2. **RTK Query**: Automatic caching and invalidation
3. **Mongoose**: Schema validation at the ODM level`,

  onboarding: `# Developer Onboarding Guide

Welcome to the mern-app project! This guide will get you up and running in under 30 minutes.

## Step 1: Environment Setup

1. Install Node.js 16+ from nodejs.org
2. Install MongoDB locally or create a free Atlas cluster
3. Clone the repository

## Step 2: Understanding the Codebase

### Key Files to Read First

1. \`backend/server.js\` — Entry point, middleware setup
2. \`backend/middleware/auth.js\` — How authentication works
3. \`client/src/App.jsx\` — Frontend routing
4. \`client/src/features/apiSlice.js\` — API integration

### Architecture in 5 Minutes

- The backend is an Express REST API
- MongoDB stores users and posts
- React frontend uses Redux for state
- JWT tokens handle authentication

## Step 3: Making Your First Change

1. Create a feature branch: \`git checkout -b feature/your-feature\`
2. Make changes and test locally
3. Run \`npm test\` before committing
4. Submit a PR with a clear description

## Step 4: Common Tasks

### Adding a New API Route

1. Create controller in \`backend/controllers/\`
2. Add route in \`backend/routes/\`
3. Register route in \`backend/server.js\`

### Adding a New React Component

1. Create component in \`client/src/components/\`
2. Add to relevant page
3. Connect to Redux if needed

## Getting Help

- Check existing issues on GitHub
- Ask in the team Slack channel
- Review the API docs for endpoint details`,
};

export default function DocsPage() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(dummyRepositories[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const generate = async (docId: string) => {
    setGenerating(docId);
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    setGenerating(null);
    setGenerated((prev) => new Set([...prev, docId]));
    setSelectedDoc(docId);
  };

  const copy = async () => {
    if (selectedDoc) {
      await navigator.clipboard.writeText(generatedDocs[selectedDoc]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Documentation" />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Documentation Generator</h2>
            <p className="text-sm text-zinc-500 mt-0.5">AI-generated docs from your codebase</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm hover:border-zinc-700 transition-colors"
            >
              <GitBranch className="h-4 w-4 text-emerald-400" />
              <span className="text-zinc-300">{selectedRepo.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>
            {showDropdown && (
              <div className="absolute top-full mt-1 right-0 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-10 overflow-hidden">
                {dummyRepositories.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => { setSelectedRepo(repo); setShowDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    {repo.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Doc type selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Document Types</h3>
            {docTypes.map((doc) => {
              const Icon = doc.icon;
              const isGenerated = generated.has(doc.id);
              const isGenerating = generating === doc.id;
              const isSelected = selectedDoc === doc.id;

              return (
                <motion.div
                  key={doc.id}
                  whileHover={{ x: 2 }}
                  className={cn(
                    "rounded-xl border p-4 cursor-pointer transition-colors",
                    isSelected
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  )}
                  onClick={() => isGenerated && setSelectedDoc(doc.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", doc.bg)}>
                      <Icon className={cn("h-4 w-4", doc.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{doc.label}</p>
                      <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{doc.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant={isGenerated ? "outline" : "default"}
                      className="w-full h-7 text-xs gap-1.5"
                      onClick={(e) => { e.stopPropagation(); generate(doc.id); }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : isGenerated ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          Regenerate
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-3 w-3" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <Card className="h-full">
                <CardHeader className="pb-3 flex-row items-center justify-between">
                  <CardTitle className="text-sm">
                    {docTypes.find((d) => d.id === selectedDoc)?.label} Preview
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={copy}>
                    {copied ? (
                      <><Check className="h-3 w-3 text-emerald-400" />Copied</>
                    ) : (
                      <><Copy className="h-3 w-3" />Copy</>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-zinc-950 rounded-lg p-4 overflow-auto max-h-[500px]">
                    <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                      {generatedDocs[selectedDoc]}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-zinc-600 border border-zinc-800 rounded-xl bg-zinc-900">
                <BookOpen className="h-10 w-10 mb-3" />
                <p className="text-sm">Select a document type and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
