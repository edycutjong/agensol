# 💡 SNS Identity — Selected Idea

> **Decision**: Agensol (confirmed 2026-05-07)
> **Source**: 3-model unanimous consensus (GLM 5, DeepSeek, Gemini Deep Think)

---

## ✅ SELECTED: Agensol — AI Agent Identity Registry on SNS

| Field | Value |
|-------|-------|
| **Name** | Agensol |
| **One-liner** | AI agent identity layer on Solana Name Service: mint `.sol` sub-domains as agent passports, store config/permissions in Profile Records, agents resolve their own identity before acting — with a live "kill switch" demo |
| **Target Track** | Primary: **SNS Identity** ($2,500 / $1,500 / $1,000) |
| **Docs Distance** | 🟢 Novel — Agent identity on SNS is the 2026 narrative lock |
| **Winner Archetype** | Capability-unlock — "AI agents now have verifiable on-chain identity" |
| **SDK Surface Area** | 4-5 — Resolution, sub-domains, Profile Records, registration, transfer |
| **Production Plan** | Devnet agent registration, live Python agent resolving identity, Vercel dashboard |
| **Difficulty** | Medium (6/10) |
| **Tech Stack** | Next.js 16, SNS SDK (@bonfida/spl-name-service), Python agent, Supabase, Tailwind v4 |

---

## Gate Check

| Gate | Result |
|------|--------|
| ❌ Emotional Hook Test | ✅ PASS — "An AI trading bot impersonated a legitimate agent and drained $180K from a DAO treasury — nobody could verify who controlled it" |
| ❌ Docs Distance = 🔴 | ✅ PASS — 🟢 Agent identity is novel, not in tutorials |
| ❌ Winner Archetype = Visualization only | ✅ PASS — Capability-unlock (verifiable agent identity) |
| ❌ Scope = Wide+Shallow | ✅ PASS — ONE flow: Register agent → Store config in Profile Records → Agent resolves own identity → Owner revokes |
| ❌ Rubric Alignment < 70% | ✅ PASS — 4-5 SNS features, deep SDK usage |

---

## Why This Wins (Unanimous)

1. **Agent Identity = 1st place** — All 3 models independently concluded this is the strongest signal to SNS judges
2. **Sub-domains + Profile Records = core** — not checkbox usage, synergistic
3. **Live agent reading from chain** — split-screen demo: Explorer TX → terminal behavior change
4. **Profile Records as config store** — JSON rules in TXT field, system prompt hash
5. **"Shallow resolver" projects (80% of submissions) will lose** — depth wins

## Runner-Up Ideas

| Rank | Idea | Score | Why Not |
|------|------|-------|---------|
| #2 | KeyGate.sol (Permission Gating) | 85/100 | Less narrative, more utility |
| #3 | SolGotchi (Consumer Gamification) | 80/100 | Fun but shallow integration |
