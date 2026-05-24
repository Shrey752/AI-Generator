# CLAUDE.md — AI-Generator

This file documents the codebase structure, development workflows, and conventions for AI assistants (Claude Code and others) working in this repository.

---

## Project Overview

**AI-Generator** is a repository for building AI-powered content or artifact generation features. As the project grows, update this section with:
- The primary purpose (e.g., image generation, text generation, code synthesis)
- The target runtime (Node.js, Python, browser, server, CLI)
- Key external services used (OpenAI, Anthropic, Replicate, etc.)

---

## Repository State

This repository was initialized on 2026-05-24. It currently has no source code. When adding the first implementation:
1. Commit a `README.md` describing the project purpose
2. Commit a `package.json` / `pyproject.toml` / relevant manifest
3. Update this file with actual structure

---

## Expected Directory Layout

Once development begins, the project should follow this structure (adjust as the stack is chosen):

```
AI-Generator/
├── CLAUDE.md               # This file
├── README.md               # Human-facing project description
├── .env.example            # All required env vars documented (never commit .env)
├── .gitignore
├── src/                    # Application source
│   ├── index.ts            # Entry point
│   ├── generators/         # Core generation logic
│   ├── api/                # HTTP route handlers (if applicable)
│   ├── config/             # Configuration loading
│   └── utils/              # Shared helpers
├── tests/                  # Test suite (mirrors src/ structure)
├── docs/                   # Additional documentation
└── scripts/                # Build, seed, or migration scripts
```

---

## Development Setup

### Prerequisites

Document prerequisites here once the stack is decided. Common examples:

- Node.js ≥ 20 / Python ≥ 3.11
- Docker (if services are containerized)
- API keys for the AI provider in use

### First-time Setup

```bash
# Clone
git clone https://github.com/shrey752/ai-generator
cd AI-Generator

# Install dependencies (update command for actual package manager)
npm install          # Node
# or
pip install -e .     # Python

# Copy and fill environment variables
cp .env.example .env

# Run the dev server / CLI
npm run dev
```

### Environment Variables

All required env vars must be present in `.env.example` with placeholder values and a comment explaining each. Never commit `.env` or any file containing secrets.

---

## Build & Scripts

Document scripts here as they are added. Typical entries:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm test` | Run full test suite |
| `npm run lint` | Run ESLint / Ruff |
| `npm run typecheck` | Type-check without emitting |

---

## Testing

- Write tests in `tests/` mirroring `src/` structure.
- Use the project's chosen test runner (Jest, Vitest, pytest, etc.) — document it here when decided.
- All new features require a corresponding test.
- Run the full suite before pushing: `npm test`.

---

## Code Conventions

### General

- No comments unless the *why* is non-obvious (hidden constraint, workaround, subtle invariant).
- Never explain *what* the code does in comments — well-named identifiers do that.
- No half-finished implementations; if something is incomplete, leave a `TODO:` with a description.

### TypeScript (if applicable)

- Strict mode on (`"strict": true` in tsconfig).
- Prefer `const` over `let`; avoid `var`.
- Explicit return types on exported functions.
- No `any`; use `unknown` and narrow.

### Python (if applicable)

- Type annotations required on all public functions.
- Format with `ruff format`, lint with `ruff check`.
- Use `pathlib.Path` over `os.path`.

### AI / LLM Calls

- Centralise all model calls in a single module (e.g., `src/generators/` or `src/llm/`).
- Never hardcode model names in business logic — pull from config or constants.
- Always handle rate-limit and timeout errors explicitly.
- Log prompt + response at DEBUG level for local development; never log secrets.

---

## Git Workflow

### Branches

- `main` — production-ready code, protected
- `dev` — integration branch (optional)
- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- AI-assisted work: `claude/<short-description>` (auto-named by Claude Code)

### Commits

- Imperative mood: "Add image generator", not "Added image generator".
- One logical change per commit.
- Never commit: `.env`, API keys, large binary files, generated `dist/` artefacts.

### Pull Requests

- PR title ≤ 70 characters, imperative mood.
- Include a test plan in the PR body.
- All CI checks must pass before merge.

---

## AI Assistant Guidelines (Claude Code)

These rules apply when Claude Code or another AI assistant works in this repository.

### What assistants should do

- Read this file at the start of every session.
- Follow the directory layout and naming conventions above.
- Prefer editing existing files over creating new ones.
- Run `npm test` (or equivalent) after any code change and fix failures before pushing.
- Keep changes minimal — fix the bug, don't refactor the surroundings.
- Ask before taking irreversible actions (force push, dropping data, deleting files).

### What assistants must not do

- Commit `.env`, secrets, or credentials.
- Push directly to `main`.
- Add dependencies without explaining why in the PR.
- Generate placeholder or stub code and mark the task complete.
- Use `console.log` / `print` for debugging in committed code.
- Silently ignore test failures.

### Working branch

Current task branch: `claude/claude-md-docs-fWxjR`

---

## Security

- All user-supplied input must be validated and sanitised before being passed to an LLM or shell.
- Prompt injection is a real threat — treat LLM outputs as untrusted when used in further processing.
- Do not log full prompt payloads in production.
- Rotate API keys immediately if they appear in a commit.
- Follow OWASP Top 10 for any web-facing surface.

---

## Updating This File

Update CLAUDE.md whenever:
- A new major dependency is added
- The directory layout changes
- A new environment variable is required
- A team convention changes
- CI/CD pipelines are added or modified

Keep it accurate — an outdated CLAUDE.md is worse than none.
