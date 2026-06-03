"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  GitBranch,
  Brain,
  Search,
  MessageSquare,
  ChevronRight,
  Star,
  Check,
  Code2,
  Network,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: GitBranch,
    title: "AST-Powered Parsing",
    description: "Tree-sitter extracts deep structural knowledge from every file — functions, classes, routes, and more.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Brain,
    title: "Knowledge Graph",
    description: "Every code element becomes a structured knowledge object with semantic relationships and context.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Search,
    title: "Semantic Retrieval",
    description: "Vector embeddings in Qdrant enable precise, context-aware retrieval across your entire codebase.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: MessageSquare,
    title: "Multi-LLM Routing",
    description: "Smart routing between models based on query complexity — fast answers for simple questions, deep reasoning for complex ones.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

const pipelineSteps = [
  { label: "Repository", icon: GitBranch },
  { label: "AST Parsing", icon: Code2 },
  { label: "Knowledge Graph", icon: Network },
  { label: "Semantic Retrieval", icon: Search },
  { label: "AI Answers", icon: Zap },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "For individual developers",
    features: ["3 repositories", "1,000 queries/month", "Basic insights", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professional developers",
    features: ["Unlimited repositories", "50,000 queries/month", "Advanced insights", "Priority support", "API access", "Custom models"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    description: "For engineering teams",
    features: ["Everything in Pro", "Team collaboration", "SSO & SAML", "Audit logs", "Dedicated support", "SLA guarantee"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "How does EKOS understand my codebase?",
    a: "EKOS uses Tree-sitter to parse your code into an Abstract Syntax Tree, then extracts structured knowledge objects representing functions, classes, routes, and their relationships. These are embedded and stored in a vector database for semantic search.",
  },
  {
    q: "Which languages are supported?",
    a: "Currently JavaScript, TypeScript, Python, Go, Rust, and Java. More languages are being added regularly.",
  },
  {
    q: "Is my code stored on your servers?",
    a: "EKOS only stores knowledge objects (metadata and embeddings), not your raw source code. You can also run EKOS fully self-hosted.",
  },
  {
    q: "How accurate are the AI answers?",
    a: "Answers are grounded in your actual codebase through retrieval-augmented generation. Every answer includes citations pointing to the exact files and lines used.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-black" />
            </div>
            <span className="font-semibold tracking-tight">EKOS</span>
          </div>

          <div className="hidden md:flex items-center gap-6 ml-6">
            {["Features", "Pricing", "FAQ", "Docs"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-zinc-500 hover:text-zinc-100 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 gap-1.5">
              <Zap className="h-3 w-3 text-emerald-400" />
              Repository Intelligence System
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Understand Any Codebase{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                in Minutes
              </span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              EKOS transforms repositories into structured knowledge and lets you chat with your codebase using AI. From AST parsing to semantic retrieval — understand any project instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Analyze Repository
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/chat">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Pipeline visualization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16 flex items-center justify-center gap-0 overflow-x-auto pb-2"
          >
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-2 px-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-zinc-500 whitespace-nowrap font-medium">{step.label}</span>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-zinc-700 shrink-0 -mx-1" />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How EKOS Works</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              A complete pipeline from raw code to intelligent answers — powered by state-of-the-art tooling at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-colors"
                >
                  <div className={`h-10 w-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Built for Developer Workflows</h2>
              <p className="text-zinc-500 mb-8 leading-relaxed">
                Whether you&apos;re onboarding to a new codebase, doing a code review, or building documentation — EKOS gives you instant, accurate answers grounded in your actual code.
              </p>
              <ul className="space-y-3">
                {[
                  "Instant onboarding to any codebase",
                  "Accurate answers with file citations",
                  "Architecture diagrams and summaries",
                  "Auto-generated documentation",
                  "API endpoint discovery",
                  "Dependency analysis",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-zinc-600">ekos chat</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-zinc-600">You</span>
                  <span className="text-zinc-300">How does authentication work?</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400">EKOS</span>
                  <div className="text-zinc-400 text-xs leading-relaxed">
                    Authentication uses JWT tokens. The flow is:
                    <br />1. POST /api/auth/login → validates credentials
                    <br />2. Returns signed JWT (24h expiry)
                    <br />3. AuthMiddleware validates on protected routes
                    <br /><br />
                    <span className="text-zinc-600">Sources: </span>
                    <span className="text-blue-400">backend/middleware/auth.js:12</span>
                    <span className="text-zinc-600">, </span>
                    <span className="text-blue-400">backend/controllers/authController.js:34</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Simple Pricing</h2>
            <p className="text-zinc-500">Start free, scale as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-6 ${
                  plan.highlighted
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="mb-3 text-xs">Most Popular</Badge>
                )}
                <h3 className="font-semibold text-zinc-100 mb-1">{plan.name}</h3>
                <p className="text-xs text-zinc-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-zinc-100">{plan.price}</span>
                  {plan.period && <span className="text-zinc-500 text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-zinc-400">
                      <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                    size="sm"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <h3 className="font-medium text-zinc-100 mb-2">{faq.q}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-6">
              <Zap className="h-7 w-7 text-black" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to understand your codebase?</h2>
            <p className="text-zinc-500 mb-8">
              Index your first repository in under 2 minutes. No credit card required.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-sm font-semibold">EKOS</span>
            <span className="text-xs text-zinc-600 ml-2">Repository Intelligence System</span>
          </div>
          <p className="text-xs text-zinc-600">© 2024 EKOS. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}
