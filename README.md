# Zayathon Hub

A revamped Vite + React + TypeScript single-page site for the Zayathon 2026 hackathon, styled with Tailwind CSS and animated with Framer Motion. Supabase is used for storing registrations submitted from the on-page form.

## Revamp Credits

- Revamped by AJ STUDIOZ.
- Public brand favicon/logo added at `public/favicon.png` (AJ STUDIOZ logo).

## Features

- Hero, prizes, about, countdown, and footer sections with responsive layouts.
- Registration flow with validation for leader and team members via [`src/components/Registration.tsx`](src/components/Registration.tsx).
- Reusable UI elements like navbar links ([`src/components/NavLink.tsx`](src/components/NavLink.tsx)), hero section ([`src/components/Hero.tsx`](src/components/Hero.tsx)), and footer ([`src/components/Footer.tsx`](src/components/Footer.tsx)).
- Supabase integration for persisting submissions ([`src/integrations/supabase/client`](src/integrations/supabase/client)) with supporting config in [`supabase/config.toml`](supabase/config.toml) and migrations under [`supabase/migrations`](supabase/migrations).

## Tech Stack

- Vite, React, TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- shadcn-ui

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on the required Supabase variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview the production build:
   ```bash
   npm run preview
   ```

## Testing

Run the Vitest suite:
```bash
npm test
```

## Supabase

- Configure your project in [`supabase/config.toml`](supabase/config.toml).
- Apply migrations from [`supabase/migrations`](supabase/migrations) via the Supabase CLI:
  ```bash
  supabase db push
  ```

## Project Structure

- App entry: [`src/main.tsx`](src/main.tsx) renders the root component in [`src/App.tsx`](src/App.tsx).
- Styling: global styles in [`src/index.css`](src/index.css) and component styles in [`src/App.css`](src/App.css).
- Components: reusable UI blocks in [`src/components`](src/components).
- Assets: static media under [`src/assets`](src/assets).
- Config: toolchain settings in [`vite.config.ts`](vite.config.ts), [`tailwind.config.ts`](tailwind.config.ts), and TypeScript configs (`tsconfig*.json`).

## Deployment

Build the site (`npm run build`) and deploy the `dist/` output to any static host (Vercel, Netlify, etc.). Ensure Supabase environment variables are set in your deployment platform.

## Payment Setup

For payment lifecycle/webhook/reminder setup details, see `PAYMENT_SETUP_README.md`.
