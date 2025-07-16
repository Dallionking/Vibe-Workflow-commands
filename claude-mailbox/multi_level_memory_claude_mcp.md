# Memory & Context Strategies for Claude‐MCP Coding Agents

## 1  Overview

Multi‑agent coding assistants (e.g. **frontend dev**, **backend dev**, **QA**, **orchestrator**) need more memory than the LLM prompt can hold. Borrow the human model:

| Layer          | Human analogue                         | AI analogue                                 |
| -------------- | -------------------------------------- | ------------------------------------------- |
| **Working**    | What you’re actively thinking about    | Current prompt tokens (≈ few KB)            |
| **Short‑term** | Topic you can recall for minutes/hours | Rolling chat window + recent summaries      |
| **Long‑term**  | Durable facts & experiences            | External stores (vector DB, KG, SQL, files) |

Goal ⇒ each agent *loads just‑enough* long‑term facts into short‑term ⇢ working memory when solving a task.

---

## 2  Core Challenges

- **Token limits** – can’t shove the entire repo into every prompt.
- **Fragmented knowledge** – agents work in silos unless we share memory.
- **Temporal continuity** – conversations & code evolve over days/weeks.
- **Precision vs overload** – too little context → hallucination; too much → noise & cost.

---

## 3  Toolbox for Long‑Term Memory

### 3‑A  Vector RAG (Retrieval‑Augmented Generation)

\* Index docs/code in a vector DB (FAISS, Pinecone, Chroma). \* Query with task text → embed → fetch top‑K chunks → feed into prompt. \* **Pros**: fast, fuzzy semantic match     **Cons**: loses structure, needs re‑embedding.

### 3‑B  Knowledge Graph (KG)

\* Nodes = pages, APIs, DB tables, agents… Edges = *calls*, *depends on*, *authored by*. \* Answer multi‑hop queries, e.g. *“Which DB feeds SalesService?”*. \* Hybrid **GraphRAG** = graph narrows scope, vector search fetches text. \* Tools: Neo4j (+ Cypher), Memgraph, Cognee KG MCP, Memento MCP.

### 3‑C  Databases / KV Stores

\* Perfect for structured or time‑series data (configs, logs, metrics). \* Claude can query via SQL MCP server (read‑only).

### 3‑D  Conversation/Episodic Memory (Vector + Summaries)

\* Store each important message/observation with metadata {timestamp, importance}. \* Periodically summarise & compress → save summary back to long‑term.

### 3‑E  Context‑Engineering Patterns

\* Retrieve → **rank / filter / summarise** → inject. \* Use `--transport stdio` MCP servers so retrieval stays local & cheap. \* Always list available tools in the system prompt so the LLM can choose.

---

## 4  Claude Code MCP Integration Sketch

```
┌─────────────┐   query    ┌────────────┐
│  Frontend   │──────────▶│ Vector DB  │
│   Agent     │◀──────────│  (RAG)     │
└─────────────┘  top‑K     └────────────┘
      ▲                           │
      │ KG subgraph               │update
      │                           ▼
┌─────────────┐ summary  ┌────────────────┐
│ Orchestrator│────────▶│ Knowledge Graph │
└─────────────┘         └────────────────┘
```

1. User/Orchestrator captures task → decides which memory tools to hit. 2. Fetch vector snippets &/or KG subgraph → trim/summary → insert into agent prompt. 3. Agent works (writing code, etc.). 4. Post‑task hooks re‑embed new files & update KG.

### MCP server commands (examples)

```bash
# Vector search server (Cognee example)
claude mcp add vector-search npx -- -y cognify --transport stdio

# KG memory (Memento)
claude mcp add knowledge-graph npx -- -y memento-mcp --transport stdio
```

Agents call these tools via `@vector-search.search("query text")` in prompts.

---

## 5  Implementation Options

| Option                 | Components                               | Complexity | When to choose                              |
| ---------------------- | ---------------------------------------- | ---------- | ------------------------------------------- |
| **1 RAG‑only**         | Vector DB + summaries                    | ★          | Minimal setup, good baseline                |
| **2 RAG + Summariser** | Vector DB + nightly / task summaries     | ★★         | Handle growing history w/out overload       |
| **3 GraphRAG**         | KG + Vector                              | ★★★        | Need explicit relationships, large codebase |
| **4 Full mix**         | KG + Vector + SQL + orchestrator routing | ★★★★       | Enterprise‑scale project, max accuracy      |

---

## 6  Quick Start (recipe)

1. `brew install node uv && pip install faiss-cpu` (or use Chroma‑db). 2. Run Cognee to embed repo → start vector MCP. 3. Optionally parse repo into Neo4j graph → start graph MCP. 4. Write orchestrator logic: on each task, call search & graph, compile context, pass to role agent. 5. Add nightly cron MCP that summarises the day and ingests summary back to memory.

---

## 7  References (selected)

- Generative Agents memory paper (Park et al. 2023)
- IBM Research CAMELoT long‑term memory module (2024)
- Memgraph GraphRAG white‑paper (2024)
- Anthropic MCP spec & examples (2024)
- Cognee MCP toolkit (2025)
- Memento Knowledge‑Graph MCP (2025)

