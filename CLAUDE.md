# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev        # Start development server
bun build      # Build for production
bun start      # Run production server
bun lint       # Run ESLint
```

Use **Bun** as the package manager (not npm/yarn/pnpm). The lockfile is `bun.lock`.

## Architecture Overview

**Next.js 16 App Router** with React 19 and TypeScript. Styling via **Tailwind CSS v4** with CSS variables (OKLCH color space defined in `app/globals.css`). UI primitives from **shadcn/ui** (New York style, zinc base, configured in `components.json`).

### Routing

- `app/(root)/` — Pages wrapped in the main `RadavilleNav` + `Footer` layout
- `app/about/` — About page (outside root group)
- Dynamic routes use `[eventId]`, `[categoryId]` segments

### Component Structure

```
components/
├── ui/          # shadcn/ui primitives (button, card, dialog, etc.)
├── features/    # Feature-grouped components (home, events, nominations, gallery, about, outlets)
├── layout/      # Nav, Footer, page-level layout
├── builders/    # Reusable form field wrappers (input, select, textarea)
├── shared/      # Cross-feature utilities
└── extras/      # Misc components (event-card)
```

### Animation Stack

Three animation systems are used in combination — pick the right tool:

- **GSAP + ScrollTrigger** — scroll-driven animations; use the `useGsapScroll()` hook (`hooks/`) which handles cleanup
- **Framer Motion / Motion** — component-level enter/exit transitions
- **Lenis / react-lenis** — smooth scroll behavior (wraps the app in a provider)

### Styling Conventions

- Use `cn()` from `lib/` (wraps `clsx` + `tailwind-merge`) for conditional class merging
- Component variants use `class-variance-authority` (CVA)
- Color tokens live in `app/globals.css` as CSS variables; use them rather than hardcoded colors
- `tw-animate-css` provides utility animation classes

### Image Domains

`next.config.ts` whitelists remote image patterns for: `unsplash.com`, Prismic, and `randomuser.me`.

### Utilities

- `lib/` — `cn()` class helper, `getDaysLeft()` event countdown
- `providers/` — Theme provider (next-themes for dark/light mode)
- No external state management library; use React Context or local state
