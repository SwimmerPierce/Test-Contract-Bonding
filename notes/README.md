# Project Notes & Developer Knowledge Base

This directory is an internal workspace for **human developers** and **AI assistants** collaborating on the website.

> [!IMPORTANT]
> **Privacy & Security Guarantee:**
> All files inside this folder (and all `.md` files) are listed in `.vercelignore` and blocked by `dev-server.js`.
> They are **never deployed to production** and are **never accessible via browser URLs** (e.g. `/notes/...` returns 404/403).

---

## Suggested Structure

Feel free to add or reorganize files as the project grows:

- `architecture.md`: System design, hosting setup (Vercel serverless + static frontend), API contracts, and environment variables.
- `requirements.md`: Business requirements, bonding criteria, form fields, and lead intake workflows.
- `tasks.md`: Active todo list, upcoming features, and backlog for humans and AI.
- `ai-instructions.md`: Special context, prompts, or coding preferences for AI assistants working in this repository.

---

## Tips for AI Collaborators

When reading or updating notes:
1. Always keep instructions concise and actionable.
2. Link to relevant code files using relative paths or workspace references.
3. Keep secrets (real API keys, production passwords) out of notes—use `.env` for secrets.
