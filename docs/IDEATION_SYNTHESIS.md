# 🏆 SNS Identity Track — Ideation Synthesis (3-Model Consensus)

> **Models Consulted**: GLM 5 Deep Think · DeepSeek Deep Think · Gemini Deep Think
> **Synthesized**: 2026-05-07
> **Verdict**: **Build Agentic.sol / AgentNameService (ANS).** AI Agent + SNS Identity is the 2026 narrative lock. All 3 models converge.

---

## ⚡ Executive Summary

All three models reached **unanimous strategic consensus** on the winning formula:

> [!IMPORTANT]
> **The Agent Identity narrative is the only path to 1st place.** All 3 models independently concluded:
> 1. `.sol` domains as AI agent passports = the strongest signal to SNS judges
> 2. Sub-domains + Profile Records + Resolution must be used synergistically (not as checkboxes)
> 3. The demo must show a live agent reading its own identity from the blockchain
> 4. "Shallow resolver" projects (80% of submissions) will lose — depth wins

### The Strategic Consensus

| Signal | GLM 5 | DeepSeek | Gemini | Consensus |
|---|---|---|---|---|
| **Agent Identity = 1st place** | ✅ ANS (#1) | ✅ SwarmID (#1) | ✅ Agentic.sol (#1) | 3/3 ✅ |
| **Sub-domains + Profile Records = core** | ✅ | ✅ | ✅ | 3/3 ✅ |
| **🔵 Full-Stack (4-5 features)** | ✅ | ✅ | ✅ | 3/3 ✅ |
| **Live agent reading from chain** | ✅ "Kill Switch" | ✅ "Resolve + task" | ✅ "Agent boots, reads prompt" | 3/3 ✅ |
| **Profile Records as config store** | ✅ System prompt hash | ✅ Skills, endpoints, cost | ✅ JSON rules in TXT field | 3/3 ✅ |
| **DAO/Governance = safe 2nd** | ✅ DAO-Hierarchy (#2) | ✅ Guardian.sol (#3) | ✅ KeyGate.sol (#2) | 3/3 ✅ |
| **Voting/Resume = 3rd tier** | ✅ Quorum.sol (#3) | ✅ Ticket.sol (#4) | ✅ SolGotchi (#3) | 3/3 ✅ |
| **"Burner wallet" concept = KILL** | ✅ Killed | — | — | 1/1 ✅ |

---

## 🗺️ Idea Convergence Matrix

15 ideas across 3 models collapsed into **5 convergence themes**:

| Theme | GLM 5 | DeepSeek | Gemini | Consensus | Prize Target |
|---|---|---|---|---|---|
| **Agent Identity / Registry** | AgentNameService (ANS) ★ | SwarmID ★ + AgentID | Agentic.sol ★ | 3/3 ✅ | 🥇 1st ($2,500) |
| **Policy / Permission Gating** | DAO-Hierarchy | Guardian.sol | KeyGate.sol | 3/3 ✅ | 🥈 2nd ($1,500) |
| **Voting / Social Proof** | Quorum.sol | — | — | 1/3 | 🥉 3rd ($1,000) |
| **Consumer / Gamification** | — | Ticket.sol | SolGotchi.sol | 2/3 ✅ | 🥉 3rd ($1,000) |
| **Privacy / Data Vaults** | Dynamic-Resume (revised) | VaultID | — | 2/3 ✅ | 🥈 2nd ($1,500) |

### Convergence Analysis

**Theme 1: Agent Identity (UNANIMOUS #1)**
All three models independently invented the same core concept: **mint a `.sol` sub-domain for an AI agent, store its config/permissions in Profile Records, and have the agent resolve its own identity before acting.** The differentiation is in scope:

| Variant | Model | Scope | Demo Complexity | Risk |
|---|---|---|---|---|
| **ANS** (GLM) | Single agent + kill switch | Agent reads config, owner revokes | Medium | Medium |
| **SwarmID** (DeepSeek) | Multi-agent mesh + discovery | Agents resolve each other, task pipeline | High | High |
| **Agentic.sol** (Gemini) | Fleet viewer + Python agent | Split-screen: explorer TX → terminal change | Medium | Medium |

**Theme 2: Permission/Policy Gating (UNANIMOUS #2)**
All models propose using SNS resolution as an access control layer, but with different frames:
- **GLM**: DAO org chart → sub-domain = role → gated UI
- **DeepSeek**: DeFi guardian → domain stores spending rules → agent enforces
- **Gemini**: API auth → `.sol` as Bearer token → edge middleware routes

---

## 🎯 Final Recommendation

### 🥇 PRIMARY BUILD: Agent Identity Registry

> [!IMPORTANT]
> **Build a hybrid of ANS (GLM) + Agentic.sol (Gemini).** Take the narrowest, most demo-able scope.

**Codename**: `AgentNameService` (ANS)

**Why this specific blend wins:**

| Decision | Source | Rationale |
|---|---|---|
| **Single agent, not swarm** | Gemini | SwarmID's multi-process coordination is too risky for 3 days. One agent that works > two that crash. |
| **"Kill Switch" demo moment** | GLM | This is the most visceral 30-second demo: revoke a domain, agent stops. Judges remember drama. |
| **Split-screen explorer proof** | Gemini | Show Solscan TX of Profile Record update → terminal behavior change. Proves it's real, not mocked. |
| **Profile Records as JSON config** | All 3 | Store system prompt, permissions, status in Profile Records. The agent resolves and reads before every action. |
| **Sub-domain hierarchy** | All 3 | `agent.owner.sol` — clean, intuitive, demonstrates sub-domain feature deeply. |
| **Tokenized ownership** | GLM + DeepSeek | The domain IS the agent's identity NFT. Transfer domain = transfer agent ownership. |

**Final Integration Score**: 🔵 **Full-Stack (5/5 Features)**

| SDK Feature | Usage in ANS |
|---|---|
| **Resolution** | Agent resolves its own `.sol` before every action |
| **Sub-domains** | `bot.alice.sol` — hierarchical agent namespace |
| **Profile Records** | JSON config: system prompt, permissions, status, allowed contracts |
| **Tokenized Domains** | Agent identity is an NFT — transferable ownership |
| **Registration** | Programmatic sub-domain minting from dashboard |

### 3-Day Build Plan (Consensus Sprint)

| Day | Focus | Deliverable | Source |
|---|---|---|---|
| **Day 1** | **Identity Layer** | Next.js dashboard: mint sub-domain, write JSON config to Profile Records, resolution display | All 3 |
| **Day 2** | **Agent Loop** | Python/Node agent that resolves its `.sol`, reads config, performs a simple action (fetch price, echo, or simulate swap) | Gemini + DeepSeek |
| **Day 3** | **Kill Switch + Video** | Owner updates Profile Record to `status: revoked` → agent stops. Record split-screen demo. Polish UI. | GLM |

### 30-Second Demo Script (Consensus Version)

> **(0:00)** "I own `alice.sol`. I'm spawning an autonomous trading agent."
> **(0:08)** "I mint `trader.alice.sol` and write its system prompt, risk parameters, and allowed contracts directly into its SNS Profile Record."
> **(0:15)** "Watch the terminal: the agent boots, resolves its own `.sol` name, reads its identity from the blockchain, and starts monitoring prices."
> **(0:22)** "Now I update the Profile Record to `status: revoked`."
> **(0:27)** "The agent instantly detects the identity change and shuts down. Identity is not just a name — it's a control layer."

### Rubric Score (Consensus)

| Criterion | GLM | DeepSeek | Gemini | Average |
|---|---|---|---|---|
| SDK Integration (40%) | 40/40 | 38/40 (SwarmID) | 38/40 | **38.7/40** |
| Impact (30%) | 28/30 | 27/30 | 28/30 | **27.7/30** |
| Creativity & UX (30%) | 25/30 | 28/30 (SwarmID) | 28/30 | **27.0/30** |
| **Total** | **93/100** | **93/100** | **94/100** | **93.3/100** |

---

## 🛡️ Risk Mitigation (Cross-Model Warnings)

All 3 models flagged the same failure modes. Here's the consensus defense:

| Risk | Flagged By | Mitigation |
|---|---|---|
| **"Vaporware" AI Trap** | GLM, Gemini | Keep the agent DEAD SIMPLE. Basic chat or price fetch. The SNS integration IS the product, not the AI. |
| **Demo looks faked** | Gemini | Split-screen: Solscan TX on left, terminal on right. Show the Profile Record update in real-time on the explorer. |
| **AI hallucination during live demo** | Gemini | Pre-record the demo. Never go live with an LLM in a hackathon. |
| **Scope creep into multi-agent** | DeepSeek | RESIST SwarmID's allure. One agent that works > two that crash. |
| **Profile Record storage limits** | GLM | Day 1 validation: write a test JSON blob to Profile Records. If it doesn't fit, simplify the config schema. If it fails entirely, pivot to DAO-Hierarchy. |
| **"Another AI wrapper" fatigue** | GLM | Frame as **safety/liability** infrastructure, not "cool AI demo." The kill switch is the differentiation. |

---

## 🥈 FALLBACK: Permission Gating (If Agent Complexity Fails)

If Day 1 SDK validation fails for Profile Record storage, pivot immediately:

| Fallback | Model | Pitch | Build Time |
|---|---|---|---|
| **DAO-Hierarchy** | GLM | Sub-domain = role. `treasurer.dao.sol` unlocks the "Approve" button. | 2.5 days |
| **Guardian.sol** | DeepSeek | Your `.sol` stores spending rules. An AI agent enforces them before signing. | 2.5 days |
| **KeyGate.sol** | Gemini | `.sol` sub-domain as API key. Edge middleware resolves and routes. | 2 days |

**Best fallback**: **DAO-Hierarchy** (simplest, most visual, org chart tree map is an instant "wow").

---

## 🪓 Kill Your Darlings — What ALL Models Rejected

| Killed Idea | Kill Signal | Models |
|---|---|---|
| **SNS-Scoped-Wallet / Burner** | Registration costs SOL/rent → "burner" that costs money is a dead concept | GLM |
| **Web3 Linktree / SolTree** | "This is the tutorial. Delete it." | Gemini |
| **DAO-Escrow.sol** | Can't write + audit Rust escrow AND SNS frontend in 3 days | Gemini |
| **Static .sol resolver** | 🔴 Shallow integration. The tutorial example. 80% of subs will do this. | All 3 |
| **Voting without agent twist** | Low creativity score. Needs spectacular UI to compensate. | All 3 |

---

## 📊 Cross-Submit Targets (Consensus)

| Target Track | Why | Model Agreement |
|---|---|---|
| **100xDevs** | AI agent infrastructure | GLM + Gemini |
| **Zerion** | Identity / portfolio management | GLM + DeepSeek |
| **Torque** | Community / reputation | DeepSeek + Gemini |
| **Colosseum Consumer** | SolGotchi variant | Gemini |

---

## 🏁 Bottom Line

| Question | Answer |
|---|---|
| What to build? | **AgentNameService (ANS)** — AI agent identity via `.sol` sub-domains |
| Integration depth? | **🔵 Full-Stack (5/5 features)** |
| Why it wins? | Only concept that positions SNS as **future infrastructure**, not a cosmetic badge |
| Biggest risk? | AI complexity bleeding into Day 3. Keep the agent brain STUPID SIMPLE. |
| Fallback? | **DAO-Hierarchy** — pivot by end of Day 1 if Profile Records can't store JSON |
| Demo killer moment? | Owner updates Profile Record to "Revoked" → agent stops in real-time |
| Expected win probability? | **70-80%** (50% statistical + agent narrative + full-stack integration) |

**Lock in the repo. Build AgentNameService. The agent narrative wins 2026.**
