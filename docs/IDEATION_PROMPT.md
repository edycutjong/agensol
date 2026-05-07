# 🧠 Hackathon Ideation Prompt — SNS Identity Track

> Paste this into Gemini Deep Think, o3, or any deep reasoning model.

---

You are a hackathon strategist with a 90%+ win rate. Your job is to analyze a specific hackathon and generate 5 non-obvious, high-winability project ideas.

## Hackathon Context

- **Name**: Colosseum Frontier Hackathon — SNS Identity Track
- **Platform**: Superteam Earn (Colosseum)
- **Theme / Focus**: Build identity-first applications on Solana using SNS (.sol) domains. Two verticals: Agent Identity (AI agents with verifiable names) and Social Identity (human-readable profiles, social graphs, identity-gated access).
- **Tracks & Sponsor Prizes**:
  - 1st Place: $2,500 USDC
  - 2nd Place: $1,500 USDC
  - 3rd Place: $1,000 USDC
- **Judging Criteria**: Technology/SNS SDK usage (40%), Impact/real-world problem (30%), Creativity & UX (30%)
- **Duration**: ~3 weeks
- **Submission Requirements**: Working demo with live SNS integration, public GitHub repo, 3-min demo video
- **Submission Count**: ~12 total, 3 prize slots
- **Past Winners**: N/A (first edition)
- **Rubric Weights**: "SNS SDK depth 40%, Real-world impact 30%, Creativity & UX 30%"

## Sponsor SDK Surface Area
The SNS SDK (`@bonfida/spl-name-service`) provides:
1. **Domain Resolution** — resolve `.sol` names to wallet addresses
2. **Reverse Lookup** — wallet address to `.sol` name
3. **Record Management** — SOL, IPFS, URL, custom records on domains
4. **Sub-domain Creation** — hierarchical namespace management
5. **Domain Transfer & Tokenization** — NFT-based domain ownership
6. **Favourite Domain System** — user-selected primary identity

**Key Resources**: https://sns.guide/ · https://docs.bonfida.org/

## My Profile

- Solo developer
- Strong in: Next.js, React, Node.js, Supabase, Python, AI/ML APIs
- Can ship a polished MVP within 3 weeks
- Prefer projects that demo well on video

## Your Task

Generate **5 project ideas** ranked by winnability. For each idea:

1. **Name** — catchy, memorable
2. **One-Line Pitch** — what it does in one sentence
3. **Target Track** — SNS Identity
4. **Why It Wins** — what makes this stand out from ~12 submissions
5. **Secret Angle** — non-obvious insight most participants will miss
6. **Tech Stack** — specific tools/APIs (keep lean)
7. **30-Second Demo Script** — what the judge sees first
8. **Risk** — what could go wrong and mitigation
9. **Difficulty** — Easy / Medium / Hard
10. **Docs Distance** — 🟢 Novel / 🟡 Adjacent / 🔴 Canonical
11. **Winner Archetype** — Capability-unlock / Infrastructure / Visualization
12. **SDK Surface Area** — how many SNS SDK features used (target 3+)
13. **Production Plan** — mainnet deployment strategy
14. **Emotional Hook** — "A [specific person]..." sentence
15. **Rubric Alignment Score** — 0-10 per criterion
16. **Scope Depth Rating** — Narrow+Deep preferred
17. **Documentation Strategy** — `r.jina.ai` usage plan

## Thinking Framework

### Standard Analysis
- Agent Identity is the HOT narrative right now (AI + crypto). Most submissions will target Social Identity — the Agent angle is less crowded.
- What does it mean for an AI agent to HAVE an identity? (reputation, history, accountability, delegation)
- Most submissions will build a "profile page with .sol lookup" — avoid this.
- Sub-domains are powerful but underused: `agent.alice.sol`, `invoice.company.sol`
- Can you combine SNS with AI agents, DeFi, or governance?

### Anti-Pattern Analysis
- **Docs Example Trap**: If SNS docs show "resolve a .sol name," don't just build a name resolver UI.
- **Dashboard-First Thinking**: "Browse .sol profiles" is Visualization — reframe as Capability-unlock.
- **SDK Depth Check**: Use domain resolution + records + sub-domains + reverse lookup (4+ features).

### Emotional Hook Test (Mandatory)
For EACH idea, write "A [specific person]..." framing the problem as a human crisis.

## Output Format

Rank highest to lowest winnability. Every idea must have a clear visual demo moment.

**Never 🔴 Docs Distance. Never fail Emotional Hook. Prefer Narrow+Deep.**
