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

---

## Getting Started

### Prerequisites

```bash
Python 3.11+
Node.js 18+
Git
```

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ekos.git
cd ekos
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key at [console.groq.com](https://console.groq.com)

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

Or use the helper scripts on Windows: `scripts\start-backend.bat`

**Deploying to Vercel/Netlify?** See [DEPLOYMENT.md](./DEPLOYMENT.md) — frontend on Vercel/Netlify, backend on Render/Railway.

### 4. Index a repository

```python
# backend/main.py
from ingestion.github_clone import clone_repository

repo_url = "https://github.com/your-target/repo.git"
clone_repository(repo_url)
```

Then run the indexing pipeline:

```bash
python -m backend.main
```

### 5. Start the backend API

```bash
python -m uvicorn backend.api:app --reload --host 0.0.0.0 --port 8000
```

API available at: `http://localhost:8000`
Swagger docs at: `http://localhost:8000/docs`

### 6. Start the frontend

```bash
cd ekos-frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:3000`

---

## API Reference

### `POST /ask`

Ask a natural language question about the indexed repository.

**Request:**
```json
{
  "question": "How does authentication work in this codebase?"
}
```

**Response:**
```json
{
  "answer": "Authentication is implemented using JWT tokens. The AuthMiddleware in backend/middleware/auth.js validates the token on each protected route...",
  "route": "large"
}
```

`route` indicates which model handled the query: `"small"` (llama-3.1-8b) or `"large"` (llama-3.3-70b).

---

## Project Structure

```
ekos/
├── .env                          # Environment variables
├── README.md
│
├── backend/
│   ├── api.py                    # FastAPI application + /ask endpoint
│   ├── main.py                   # Repository indexing entry point
│   │
│   ├── ingestion/
│   │   └── github_clone.py       # Git clone via GitPython
│   │
│   ├── parsers/
│   │   ├── treesitter_parser.py  # File discovery (.py, .js, .ts)
│   │   └── language_detector.py  # Language identification
│   │
│   ├── extractors/
│   │   └── javascript_extractor.py  # AST → Knowledge Objects
│   │
│   ├── models/
│   │   └── knowledge_object.py   # Pydantic KnowledgeObject schema
│   │
│   ├── embeddings/
│   │   └── embedder.py           # BAAI/bge-small-en-v1.5 encoder
│   │
│   ├── indexing/
│   │   └── indexer.py            # Embed + store pipeline
│   │
│   ├── vector_db/
│   │   └── qdrant_manager.py     # Qdrant CRUD + search
│   │
│   ├── retrieval/
│   │   └── context_builder.py    # Build LLM context from results
│   │
│   ├── router/
│   │   └── question_router.py    # Small/large model routing
│   │
│   └── llm/
│       └── llm_manager.py        # Groq API (Llama 3.1 + 3.3)
│
├── ekos-frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard overview
│   │       ├── repositories/     # Repo list + detail pages
│   │       ├── chat/             # AI chat interface
│   │       ├── insights/         # Architecture insights
│   │       ├── docs/             # Documentation generator
│   │       ├── upload/           # Repository indexing UI
│   │       └── settings/         # Configuration
│   │
│   ├── components/
│   │   ├── layout/               # Sidebar, TopBar
│   │   ├── repository/           # RepoCard, StatsCard, RepoTree
│   │   ├── chat/                 # ChatMessage with citations
│   │   └── ui/                   # Button, Card, Badge, Input...
│   │
│   └── lib/
│       ├── utils.ts              # cn() utility
│       └── dummy-data.ts         # Development mock data
│
├── repos/                        # Cloned repositories (gitignored)
└── qdrant_data/                  # Local vector database storage
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
# Fork and clone
git clone https://github.com/your-org/ekos.git

# Create a feature branch
git checkout -b feature/your-feature

# Make changes, then open a PR
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
