# 🌟 Sanshoधनम्: The Intelligent R&D Proposal Platform

**Sanshoधनम् (The Intelligent R&D Proposal Platform)** is an **enterprise-grade SaaS** solution designed to automate and accelerate the **R&D proposal review process** for foundations, universities, and corporate enterprises.  

By leveraging a **multi-agent AI co-pilot**, it replaces slow, subjective, and opaque manual workflows with a **fast, transparent, and data-driven system** — drastically reducing expert review hours and funding time from **months to days**.

---

## 🌟 Key Features & Unique Selling Propositions (USPs)

<details>
<summary><b>🧠 Intelligent First-Pass Screening</b></summary>

A multi-agent AI system provides an **objective score** and **detailed report** against the organization's standardized checklist — instantly filtering out **low-quality or non-compliant submissions**.
</details>

<details>
<summary><b>🔍 AI-Powered Originality Check</b></summary>

Automatically compares new submissions against a **secure vector database** of past projects using **Cosine Similarity**, flagging potential overlaps and protecting against redundant research.
</details>

<details>
<summary><b>🪶 Unmatched Transparency & Auditability</b></summary>

- Researchers get **real-time status updates** and **AI-generated feedback** upon rejection.  
- Organizations maintain a **complete, immutable audit trail** of every score and decision.
</details>

<details>
<summary><b>📊 Data-Driven Insights Hub</b></summary>

Aggregates anonymized submission data to reveal **powerful trends**, helping admins refine R&D strategy and enabling researchers to craft **stronger, more compliant proposals**.
</details>

<details>
<summary><b>📶 Robust Offline-First Experience</b></summary>

Built with **Dexie.js (IndexedDB)**, researchers can draft proposals for days **without internet**.  
All data syncs automatically and securely when reconnected.
</details>

---

## 🚀 Technical Stack

| Component | Technology | Description |
|------------|-------------|-------------|
| **Frontend** | Next.js (React), Tailwind CSS | Dynamic, responsive user interface |
| **Backend / Orchestration** | Worqhat.app Workflows | Serverless visual backend for secure API endpoints, logic, and database integration |
| **AI / LLM** | Google Gemini 1.5 Flash (via Worqhat AI Actions) | Used for proposal scoring, structured JSON outputs, and contextual grading |
| **Semantic Search** | Worqhat Vector Database + Google Text Embedding 004 | Managed vector store powering originality check |
| **Core Database** | Worqhat.app WorqDB (PostgreSQL) | Fully managed SQL database for all core application data (Users, Proposals, Reviews) |
| **Authentication** | Worqhat.app Auth (JWT) | Secure token-based sessions with Role-Based Access Control (RBAC) |

---

## 🧠 AI Logic & Mitigation Strategy

The AI integration is the **core intelligence layer**, designed for accuracy, transparency, and hallucination mitigation.

### AI Workflow

1. **Embedding Generation** → New proposals are converted to JSON and embeddings are generated for key sections (title, objectives, novelty).  
2. **Novelty Scoring** → The embedding queries the **PastProject Vector Store** using **Cosine Similarity** to return a `similarity_score`.  
3. **Contextual Grading** → This score is injected into the main Gemini prompt for contextual evaluation.  
4. **Mitigation** → Uses **Structured Chain Prompting** — enforcing strict checklist-based reasoning and **verifiable JSON outputs** instead of free text.  
   - Example: `"Are the objectives SMART?" → true/false`  
   - Reduces hallucinations and ensures consistent AI decisions.

---

## ▶️ Getting Started (Local Setup)

### **Prerequisites**
- Node.js (v18+)
- Worqhat Account & API Key
- PostgreSQL client (optional)

### **Clone the Repository**
```bash
git clone https://github.com/KoynaKarmakar/pune-mit.git
cd pune-mit
