<div align="center">

<br/>

```
███████╗██╗  ██╗ ██████╗ ███████╗
██╔════╝██║ ██╔╝██╔═══██╗██╔════╝
█████╗  █████╔╝ ██║   ██║███████╗
██╔══╝  ██╔═██╗ ██║   ██║╚════██║
███████╗██║  ██╗╚██████╔╝███████║
╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

# EKOS — Engineering Knowledge OS

**The intelligence layer for your entire engineering organization.**

[![Status](https://img.shields.io/badge/status-early%20beta-orange?style=flat-square)](.)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=flat-square&logo=python)](.)
[![Next.js](https://img.shields.io/badge/next.js-16-black?style=flat-square&logo=next.js)](.)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](.)
[![LLM](https://img.shields.io/badge/LLM-Groq%20%7C%20Llama3-purple?style=flat-square)](.)
[![Vector DB](https://img.shields.io/badge/vector--db-Qdrant-red?style=flat-square)](.)

<br/>

*Most AI tools ask an LLM and hope for the best.*
*EKOS understands your codebase before a single token is generated.*

<br/>

</div>

---

## The Problem

Every engineering organization accumulates knowledge in dozens of disconnected places — GitHub repos, Slack threads, Notion docs, Jira tickets, architecture decision records. When a new engineer joins, they spend weeks reconstructing context that already exists. When something breaks in production, engineers search across a dozen tools to trace the root cause.

Current AI coding assistants make this worse, not better. They operate as:

```
Question → LLM → Answer
```

They hallucinate. They have no memory. They don't understand your codebase — they pattern-match against training data.

**EKOS takes a fundamentally different approach.**

---

## The EKOS Approach

```
Repository → Knowledge Extraction → Knowledge Representation
     → Retrieval → Reasoning → Action
```

Before an LLM is ever called, EKOS builds a structured understanding of what exists, how components relate, how data flows, and why code was written. The LLM then reasons on top of a knowledge foundation — not a blank slate.

> **The core insight:** Answer quality improved far more from improving knowledge extraction than from changing LLMs.
>
> **Knowledge Representation > Model Size**

The true moat is converting raw code into structured knowledge. That is what EKOS is building.

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        EKOS PIPELINE                            │
└─────────────────────────────────────────────────────────────────┘

  GitHub Repository URL
         │
         ▼
┌─────────────────┐
│  Git Ingestion  │  ← Clone via GitPython
│  github_clone   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  File Discovery │  ← .py / .js / .ts discovery
│  TreeSitter     │    via pathlib recursive walk
│  Parser         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AST Parsing   │  ← Tree-sitter parses source files
│  JS Extractor   │    into Abstract Syntax Trees
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Knowledge    │  ← Structured KnowledgeObject models
│    Objects      │    { file_path, chunk_type,
│                 │      symbol_name, content }
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Embeddings    │  ← BAAI/bge-small-en-v1.5
│   Embedder      │    via sentence-transformers
│                 │    384-dim normalized vectors
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Qdrant Vector  │  ← Local Qdrant instance
│    Database     │    Cosine similarity search
│                 │    Collection: knowledge_objects
└────────┬────────┘
         │
    Query Time
         │
         ▼
┌─────────────────┐
│Semantic Retrieval│  ← Top-K vector search
│ Context Builder  │    Assembles file + type + content
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Question Router │  ← Keyword-based complexity routing
│                  │    simple → small model
│                  │    complex → large model
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Llama  │ │ Llama  │
│3.1 8B  │ │3.3 70B │
│(fast)  │ │(deep)  │
└────┬───┘ └───┬────┘
     └────┬────┘
          ▼
   Structured Answer
   + Source Citations
```

---

## Multi-LLM Routing Architecture

EKOS intelligently routes every query to minimize cost without sacrificing quality.

```
                    Incoming Question
                          │
                          ▼
              ┌───────────────────────┐
              │    Question Router    │
              │                       │
              │  Keyword Analysis:    │
              │  "why", "explain",    │
              │  "analyze", "compare",│
              │  "architecture",      │
              │  "design", "flow"     │
              └─────────┬─────────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
     Simple Query               Complex Query
           │                         │
           ▼                         ▼
  ┌────────────────┐       ┌──────────────────┐
  │ llama-3.1-8b   │       │  llama-3.3-70b   │
  │   (instant)    │       │  (versatile)     │
  │                │       │                  │
  │ Examples:      │       │ Examples:        │
  │ - List routes  │       │ - Explain arch   │
  │ - Which APIs?  │       │ - Analyze auth   │
  │ - Show models  │       │ - Suggest refac. │
  └────────┬───────┘       └────────┬─────────┘
           │                        │
           └───────────┬────────────┘
                       ▼
              Answer + Route Label
```

**Result:** Dramatically lower inference costs. Instant answers for simple queries. Deep reasoning when it matters.

---

## Frontend Architecture

```
┌──────────────────────────────────────────────────────┐
│                   EKOS Frontend                       │
│                  Next.js 16 + TS                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  /                    Landing Page                    │
│  /dashboard           Overview + Stats               │
│  /dashboard/repos     Repository List                 │
│  /dashboard/repos/[id] Repository Overview           │
│  /dashboard/chat      AI Chat Interface               │
│  /dashboard/insights  Architecture Insights           │
│  /dashboard/docs      Documentation Generator        │
│  /dashboard/upload    Indexing Pipeline UI            │
│  /dashboard/settings  Config + API Keys               │
│                                                       │
├──────────────────────────────────────────────────────┤
│  Components: Sidebar │ TopBar │ ChatMessage           │
│              RepoCard │ StatsCard │ RepoTree          │
│  Charts:     Recharts (Pie + Bar)                     │
│  Animation:  Framer Motion                            │
│  UI Kit:     Radix UI + Tailwind CSS + shadcn/ui      │
└──────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **AST Parsing** | Tree-sitter |
| **Embeddings** | `BAAI/bge-small-en-v1.5` via Sentence Transformers |
| **Vector Database** | Qdrant (local) |
| **LLM Provider** | Groq API |
| **Small Model** | `llama-3.1-8b-instant` |
| **Large Model** | `llama-3.3-70b-versatile` |
| **Backend API** | FastAPI + Python |
| **Frontend** | Next.js 16, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui, Radix UI |
| **Animation** | Framer Motion |
| **Charts** | Recharts |
| **Git Ingestion** | GitPython |

---

## Current Features

### Repository Intelligence
- One-command repository indexing from any GitHub URL
- Semantic code search across the full codebase
- Natural language Q&A grounded in real code
- Architecture exploration and explanation
- Codebase onboarding assistance for new engineers
- AI-generated documentation (README, API docs, onboarding guides)

### Knowledge Extraction (Current)
| Type | Status |
|------|--------|
| Imports | ✅ Supported |
| Exports | ✅ Supported |
| React Components | ✅ Supported |
| Functions | 🔜 Phase 1 |
| Classes | 🔜 Phase 1 |
| API Routes | 🔜 Phase 1 |
| Database Models | 🔜 Phase 1 |
| Services | 🔜 Phase 1 |
| Cross-file Relationships | 🔜 Phase 2 |

### Frontend Dashboard
- Repository management and status tracking
- Live indexing progress with animated pipeline steps
- Chat interface with citation badges linking to source files
- Insights cards: architecture summary, components, endpoints, DB models, dependencies
- Documentation generator with markdown preview
- Language distribution and component charts
- EKOS brand logo in sidebar, landing page, and browser tab
- Configurable API URL via `NEXT_PUBLIC_API_URL` for production deploys

---

## Getting Started

### Prerequisites

- **Python** 3.11+
- **Node.js** 18+
- **Git**
- **Groq API key** — [console.groq.com](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/Therajgupta/EKOS-Engineering-Knowledge-Based-OS-.git
cd EKOS-Engineering-Knowledge-Based-OS-
```

### 2. Environment variables

From the project root:

```bash
cp .env.example .env
```

Edit `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Optional (production / remote Qdrant):

```env
QDRANT_URL=http://127.0.0.1:6333
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

For the frontend, copy `ekos-frontend/.env.example` → `ekos-frontend/.env.local` and set `NEXT_PUBLIC_API_URL` when not using localhost.

### 3. Backend setup

```bash
python -m venv venv

# Windows
.\venv\Scripts\activate
.\venv\Scripts\python.exe -m pip install -r requirements.txt

# macOS / Linux
source venv/bin/activate
pip install -r requirements.txt
```

**Windows — start API (recommended):**

```cmd
scripts\start-backend.bat
```

This stops any old process on port 8000 (avoids Qdrant file-lock errors), then starts the server.

**Manual start:**

```bash
python -m uvicorn backend.api:app --host 0.0.0.0 --port 8000
```

> Avoid `uvicorn --reload` with local `qdrant_data/` — two processes can lock the database. Use `scripts\stop-backend.bat` before restarting.

- API: http://localhost:8000  
- Swagger: http://localhost:8000/docs  
- Health: http://localhost:8000/health  

### 4. Index a repository

**CLI** (from project root, with venv active):

```bash
python -m backend.main https://github.com/user/repo.git my-repo-name
```

**Dashboard UI:** open http://localhost:3000/dashboard/upload and paste a GitHub URL.

### 5. Frontend setup

```bash
cd ekos-frontend
npm install
npm run dev
```

- App: http://localhost:3000  
- Dashboard: http://localhost:3000/dashboard  
- Chat: http://localhost:3000/dashboard/chat  

Ensure the backend is running first; the dashboard shows backend online/offline status.

---

## Deployment

EKOS is split into two deployable parts:

| Part | Host | Config |
|------|------|--------|
| **Frontend** (Next.js) | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Root: `ekos-frontend`, env: `NEXT_PUBLIC_API_URL` |
| **Backend** (FastAPI) | [Render](https://render.com), Railway, or Fly.io | `requirements.txt`, `GROQ_API_KEY`, `CORS_ORIGINS` |

Vercel/Netlify **cannot** run the Python API (embeddings, Qdrant, indexing). Deploy the backend separately, then point the frontend at it.

Full step-by-step guide: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Repo includes `vercel.json`, `netlify.toml`, and `render.yaml` as starting templates.

---

## API Reference

Base URL: `http://localhost:8000` (or your deployed backend).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/repositories` | List indexed repositories + stats |
| `GET` | `/repositories/{name}` | Stats for one repository |
| `POST` | `/index` | Start indexing a GitHub repo (background) |
| `GET` | `/index/{name}/status` | Indexing job status |
| `POST` | `/ask` | Natural-language Q&A over indexed code |

### `POST /ask`

**Request:**

```json
{
  "question": "How does authentication work in this codebase?",
  "repository": "mern-app"
}
```

`repository` is optional — filters retrieval to one indexed repo.

**Response:**

```json
{
  "answer": "...",
  "route": "large",
  "model": "llama-3.3-70b-versatile",
  "citations": [{ "file": "App.js", "chunk_type": "component", "start_line": 7 }],
  "context_chunks": 8
}
```

`route`: `"small"` (llama-3.1-8b) or `"large"` (llama-3.3-70b).

### `POST /index`

**Request:**

```json
{
  "github_url": "https://github.com/user/repo.git",
  "repo_name": "my-repo"
}
```

Poll `GET /index/{repo_name}/status` until `status` is `completed` or `failed`.

---

## Project Structure

```
EOS/
├── .env.example                  # Backend secrets template (copy to .env)
├── requirements.txt              # Python dependencies
├── DEPLOYMENT.md                 # Vercel / Netlify / Render guide
├── vercel.json                   # Vercel (frontend root: ekos-frontend)
├── netlify.toml                  # Netlify frontend build
├── render.yaml                   # Render backend blueprint
├── README.md
│
├── scripts/
│   ├── start-backend.bat         # Windows: stop old server + start API
│   ├── stop-backend.bat          # Windows: free port 8000 / Qdrant lock
│   └── start-backend.ps1         # PowerShell variant (may need execution policy)
│
├── backend/
│   ├── api.py                    # FastAPI app (REST API)
│   ├── main.py                   # CLI indexing pipeline
│   ├── ingestion/                # GitHub clone
│   ├── parsers/                  # Tree-sitter + file discovery
│   ├── extractors/               # AST → knowledge objects
│   ├── models/                   # Pydantic schemas
│   ├── embeddings/               # Sentence-transformers
│   ├── indexing/                 # Embed + upsert to Qdrant
│   ├── vector_db/                # Qdrant client + search
│   ├── retrieval/                # Context builder for RAG
│   ├── router/                   # Small vs large LLM routing
│   └── llm/                      # Groq (Llama 3.1 / 3.3)
│
├── ekos-frontend/
│   ├── app/                      # Next.js App Router pages
│   ├── components/
│   │   ├── brand/logo.tsx        # EKOS logo component
│   │   ├── layout/               # Sidebar, TopBar
│   │   ├── repository/           # Repo cards, stats, tree
│   │   ├── chat/                 # Chat + citations
│   │   └── ui/                   # shadcn-style primitives
│   ├── lib/
│   │   ├── api.ts                # NEXT_PUBLIC_API_URL helper
│   │   ├── utils.ts
│   │   └── dummy-data.ts
│   └── public/
│       └── ekos-logo.png         # Brand logo + favicon
│
├── repos/                        # Cloned repos (gitignored)
├── qdrant_data/                  # Local vector DB (gitignored)
└── tests/                        # Backend integration tests
```

---

## Roadmap

EKOS is building toward becoming the operating system for engineering knowledge. Here is the full vision, phase by phase.

---

### Phase 1 — Deep Knowledge Extraction
*Target: Q3 2025*

```
Current Extraction          Phase 1 Extraction
────────────────            ──────────────────
✅ Imports                  + Functions + signatures
✅ Exports                  + Classes + methods
✅ React Components         + API Routes
                            + Database Models
                            + Service definitions
                            + Type definitions
```

Every meaningful code construct becomes a first-class knowledge object.

---

### Phase 2 — Engineering Knowledge Graph
*Target: Q4 2025*

```
         Component A ──calls──▶ Function B
              │                      │
           imports                returns
              │                      │
         Module C ◀──depends── Service D
              │
           reads/writes
              │
         Database E
```

Build a graph connecting components, functions, APIs, databases, services, and dependencies. Enable questions like:

- *"What breaks if I modify this file?"*
- *"Show me the full login flow end to end"*
- *"Which services depend on the payments module?"*

---

### Phase 3 — Sub-100ms Knowledge Retrieval
*Target: Q1 2026*

```
Current Flow          Phase 3 Flow
────────────          ────────────
Question              Question
    ↓                     ↓
Embed Query           Route Classification
    ↓                     ↓
Vector Search       ┌─────┴──────┐
    ↓               ▼            ▼
LLM Generation   Graph       Vector
    ↓            Lookup       Search
Answer            (5ms)      (15ms)
(~2-3s)               └─────┬──────┘
                             ▼
                    Answer (20-100ms)
                    No LLM needed
```

For factual queries (list routes, show components, find models), skip the LLM entirely. Target latency: **20–100ms**.

---

### Phase 4 — Multi-Source Knowledge Layer
*Target: Q2 2026*

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  GitHub  │  │  Slack   │  │  Notion  │
│  PRs &   │  │ Channels │  │   Docs   │
│ Commits  │  │ Threads  │  │  Pages   │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │              │              │
┌────▼──────────────▼──────────────▼─────┐
│         EKOS Knowledge Layer           │
│   Unified embeddings + entity linking  │
└──────────────────┬─────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
  ┌──────┐    ┌────────┐   ┌──────────┐
  │Jira  │    │Conflu- │   │ Linear   │
  │Tickets│   │ ence   │   │  Issues  │
  └──────┘    └────────┘   └──────────┘
```

**Integrations planned:**

| Platform | Type | Use Case |
|----------|------|----------|
| **GitHub** | Code + PRs | Code context, change history |
| **Slack** | Conversations | Why decisions were made |
| **Notion** | Documentation | Architecture docs, specs |
| **Confluence** | Documentation | Enterprise wikis |
| **Jira** | Tickets | Feature context, bug history |
| **Linear** | Issues | Engineering project context |
| **Google Docs** | Documents | Design documents, RFCs |

---

### Phase 5 — Agentic Engineering Workflows
*Target: Q3 2026*

```
┌─────────────────────────────────────────────────────┐
│                  EKOS Agent Layer                   │
├─────────────────┬───────────────┬───────────────────┤
│  Documentation  │  Refactoring  │  Investigation    │
│     Agent       │     Agent     │      Agent        │
├─────────────────┼───────────────┼───────────────────┤
│ • Onboarding    │ • Dead code   │ • Bug tracing     │
│   guides        │   detection   │ • Incident        │
│ • Architecture  │ • Improvement │   analysis        │
│   docs          │   suggestions │ • Production      │
│ • API reference │ • Dependency  │   failure         │
│ • Changelog     │   issues      │   explanation     │
└─────────────────┴───────────────┴───────────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
               EKOS Knowledge Layer
               (Code + Docs + History)
```

Agents that don't just answer questions — they take action. Automatically generate documentation on every PR merge. Detect architectural drift. Explain production incidents in plain English.

---

### Phase 6 — Engineering Operating System
*Target: 2027*

```
  GitHub    Slack    Notion    Docs    Jira    Linear
     │         │        │        │       │        │
     └─────────┴────────┴────────┴───────┴────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Knowledge Layer   │
                    │  (Unified Memory)   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Reasoning Layer   │
                    │  (Multi-LLM RAG)   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │    Agent Layer     │
                    │  (Autonomous Work) │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Engineering OS    │
                    │  (The Company      │
                    │   Brain)           │
                    └────────────────────┘
```

**The end state:** A new engineer joins a company and asks EKOS:

- *"How does authentication work?"*
- *"Why was this API built this way?"*
- *"Where is billing implemented?"*
- *"Which team owns this service?"*
- *"What should I learn first?"*

Instead of searching across Slack, Notion, GitHub, and Confluence — EKOS answers instantly, with sources, with context, with history.

**EKOS becomes the company's engineering brain.**

---

## Core Insight

During development, one finding stood above everything else:

> Switching from a 7B to a 70B model improved answer quality by ~20%.
> Improving knowledge extraction improved answer quality by ~80%.

**The bottleneck is never the LLM. It is always the knowledge feeding the LLM.**

This is why EKOS invests deeply in knowledge extraction, representation, and retrieval — before a single token is generated. Better structured knowledge produces better answers at lower cost with any model.

---

## Why EKOS?

| Tool | Approach | Problem |
|------|----------|---------|
| GitHub Copilot | Autocomplete | No codebase memory |
| ChatGPT / Claude | Chat + paste code | No structured understanding |
| Sourcegraph | Code search | Search, not reasoning |
| Cursor | Editor AI | Session context only |
| **EKOS** | **Knowledge OS** | **Structured understanding + retrieval + reasoning** |

Current tools help you **write** code faster.
EKOS helps you **understand** codebases deeper.

---

## Status

```
🚧  EARLY BETA
```

EKOS is under active development. Current focus is building the foundational knowledge extraction layer — the bedrock on which all future phases are built.

The extraction quality today determines the reasoning quality tomorrow.

---

## Contributing

EKOS is building in public. Contributions, feedback, and ideas are welcome.

```bash
git clone https://github.com/Therajgupta/EKOS-Engineering-Knowledge-Based-OS-.git
cd EKOS-Engineering-Knowledge-Based-OS-
git checkout -b feature/your-feature
# make changes, commit, open a PR
```

Areas where contributions are most valuable:
- **Extractors** — Add support for new languages and constructs (functions, classes, routes)
- **Parsers** — Improve Tree-sitter grammar coverage
- **Retrieval** — Experiment with reranking and hybrid search
- **Frontend** — UI improvements and new insight views

---

## License

MIT License — see [LICENSE](./LICENSE)

---

<div align="center">

<br/>

**EKOS** — *Engineering Knowledge OS*

*Built for founders, engineers, and teams who believe that understanding code is the foundation of building great software.*

<br/>

`Repository → Knowledge → Understanding → Action`

<br/>

</div>
