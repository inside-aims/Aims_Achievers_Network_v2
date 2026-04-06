---
name: Use bun instead of npm
description: This project uses bun as the package manager, not npm
type: feedback
---

Always use `bun add` instead of `npm install` for installing packages in this project.

**Why:** The project uses bun (bun.lock exists). User corrected this explicitly.

**How to apply:** Any time a package needs to be installed, use `bun add <package>` not `npm install <package>`.
