# Claude Notes

## Quick Reference
- **"MD"** = This CLAUDE.md file. Always update this when asked.

## Communication Style
- You can swear if you need to. No need to be overly polite.

## This Project (peakbot-motion)
- PeakBot motion graphic animation for marketing
- Uses GSAP for timeline animations
- Discord-style channel interface that morphs and simplifies

### Design Rules
- Chat bubbles must be the same distance from the canvas edge as the Discord panel
- All chat conversations must have consistent positioning (same spacing from edges)
- Keep spacing symmetrical between Discord panel and chat containers
- Always use the dark overlay/mask when focusing on chat or any main element - draws attention to the focus area
- Keep animations snappy but readable - overlap where possible, but not so fast it's jarring. Find the balance.

---

## Main Project Reference

### GitHub Repository
- **Repo**: https://github.com/relockin/peak-bot-frontend (private)
- **Local Clone**: `/c/Users/ljsmi/peak-bot-frontend/`
- **Website**: https://peakbot.pro

### What is PeakBot?
PeakBot is an AI-powered Discord bot SaaS that combines:
- **AI Server Builder** - Users describe their ideal server, bot builds it automatically
- **Smart Moderation** - Raid protection, spam filtering, toxicity detection
- **Custom Commands** - Create automations using plain English
- **24/7 AI Assistant** - Answers member questions, assists with moderation
- **Analytics Dashboard** - Real-time server health, growth, engagement metrics
- **XP/Leveling System** - Customizable ranks and leaderboards
- **Ticket System** - Support ticket management
- **Welcome System** - Customizable welcome messages and auto-roles

### Tech Stack (peak-bot-frontend)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **AI**: Anthropic Claude API
- **RAG**: Pinecone for tool retrieval
- **Hosting**: Railway (auto-deploys from GitHub)

### Key Architecture
```
Frontend (peak-bot-frontend) → Railway
     ↓
Bot API (peak-discord-bot) → Railway (separate repo)
     ↓
RAG System → Pinecone
     ↓
AI → Anthropic Claude
```

### Important Files in peak-bot-frontend
| File | Purpose |
|------|---------|
| `app/api/ai/chat/route.ts` | AI chat endpoint, system prompts, tool handling |
| `app/dashboard/[guildId]/builder/page.tsx` | AI Builder UI |
| `lib/rag/tool-retriever.ts` | Tool loading logic for AI |
| `lib/ai/tool-executors.ts` | Executes tools against bot API |
| `lib/tools/definitions/` | Tool definitions (JTC, Welcome, XP, etc.) |
| `lib/tools/resolver/` | Requirement resolution logic |
| `docs/AI-BUILDER-SYSTEM.md` | Complete AI system documentation |
| `docs/tool-system/` | Tool system specifications |

### Tool System
The bot uses a structured tool system for Discord features:
- **JTC (Join-to-Create)** - Voice channel creation
- **Welcome System** - Welcome messages, auto-roles
- **XP System** - Leveling, rewards, multipliers
- **Ticket System** - Support tickets
- **Reaction Roles** - Role assignment via reactions
- **Logging** - Audit logs, mod logs
- **Safety** - Anti-spam, anti-raid, anti-nuke

### Deployment Workflow
1. Edit local files in `/c/Users/ljsmi/peak-bot-frontend/`
2. `git add <files>`
3. `git commit -m "message"`
4. `git push origin main`
5. Railway auto-deploys from GitHub

### Feature Roadmap Phases
1. **Foundation** - Feature toggles, XP rates, logging, anti-spam/raid
2. **Moderation Suite** - Warn/mute/kick/ban, mod history, automod rules
3. **Visual Builders** - Embed creator, reaction role builder, auto-responders
4. **Welcome & Messages** - Templates, scheduled messages
5. **Rank & Leveling** - Custom ranks, leaderboards
6. **Tickets & Applications** - Ticket management, form builder, appeals
7. **Advanced Protection** - Anti-nuke, suspicious account detection, backups
8. **Events & Giveaways** - Event system, giveaway management
9. **Custom Commands** - User-created commands, auto-roles
10. **Analytics** - Server stats, insights, charts
