# NexoNest

Static website for NexoNest projects, education, research and Hossein Nazari's
portfolio, with a separate Google Apps Script newsletter/licensing integration.

Read [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for the complete developer and LLM
handoff. It also works as one Markdown note in Obsidian.

Serve the repository over HTTP; no frontend build or package installation is
required. For example: `python -m http.server 8000 --bind 127.0.0.1`.

After updating the guide's prose:

```text
node scripts/update-project-guide.cjs --write
node scripts/update-project-guide.cjs --check
```

Contributor requirements: [AGENTS.md](AGENTS.md).
