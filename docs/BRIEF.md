# Agensol — Full Project Brief

## PRD
> **Hook**: An AI trading bot impersonated a legitimate agent and drained $180K from a DAO treasury. Nobody could verify who controlled it. Agensol gives every agent a verifiable on-chain passport.

**Problem**: AI agents on Solana have no identity. Anyone can deploy an agent claiming to represent a DAO. No verification, no kill switch, no audit trail.

**Solution**: AI agent identity registry on SNS. Mint `.sol` sub-domains as agent passports. Store config/permissions in Profile Records. Agents resolve their own identity before acting. Owners can revoke via transfer.

**Core Features**:
1. Agent registration (mint sub-domain: `trading-bot.myorg.sol`)
2. Profile Records (store JSON config, permissions, system prompt hash)
3. Agent self-resolution (Python agent reads own SNS records before executing)
4. Owner revocation (transfer sub-domain = kill switch)
5. Agent directory dashboard (browse registered agents)

**Out of Scope**: Agent execution logic, multi-sig ownership, cross-chain identity

---

## ARCHITECTURE
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind v4 |
| Identity | SNS SDK (@bonfida/spl-name-service) |
| Agent | Python (demo agent that resolves own identity) |
| Database | Supabase (agent registry cache) |

**SNS SDK depth**: Resolution, sub-domains, Profile Records, registration, transfer — 5 features.

---

## BUILD PLAN (3 Days)
- **Day 1**: SNS sub-domain registration, Profile Records CRUD, agent directory
- **Day 2**: Python agent that resolves own identity from chain, kill switch demo
- **Day 3**: Dashboard polish, split-screen demo (terminal + browser), deploy

---

## SUBMISSION
**Demo**: Register `trader.myorg.sol` → store config → Python agent reads identity → executes trade → owner revokes → agent stops. Live split-screen.

---

## SEED DATA
5 demo agents (trader, oracle, sweeper, monitor, relayer), sample Profile Records JSON, resolution examples.

---

## UI
Agent registry table, Profile Record editor (JSON), live resolution status, kill switch toggle (red button), Python terminal embed.
