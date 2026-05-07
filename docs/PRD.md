# Agensol — Product Requirements Document

> **Emotional Hook**: An AI trading bot impersonated a legitimate agent and drained $180K from a DAO treasury. Nobody could verify who controlled it.

## Problem Statement
AI agents on Solana have no identity. Anyone can deploy an agent claiming to represent a DAO.

## Solution Overview
AI agent identity registry on SNS. Mint .sol sub-domains as agent passports. Profile Records store config. Owners can revoke via transfer.

## Core Features (MVP)
1. Agent registration (mint sub-domain)
2. Profile Records (JSON config, permissions)
3. Agent self-resolution (Python agent reads own identity)
4. Owner revocation (transfer = kill switch)
5. Agent directory dashboard

## Success Metrics
- All SDK features demonstrably integrated
- Demo flow works end-to-end

## Out of Scope
- ❌ Agent execution logic
- ❌ Multi-sig ownership
- ❌ Cross-chain identity
