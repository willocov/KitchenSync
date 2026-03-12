# KitchenSync

A cooking coordination tool that helps you get multiple dishes to the table at the right time. You describe what you're cooking and when each dish needs to be ready — KitchenSync works backwards to tell you exactly when to start each step.

## How it works

Most cooking timers count forward. KitchenSync counts backward.

You enter each dish's steps in the order you'll do them, along with how many minutes each step takes. KitchenSync schedules them backwards from the dish's target completion time, so the last step ends exactly when the dish is due.

**Example:** Roast chicken is due at 6:00 PM.

| Step | Duration | Starts at |
|---|---|---|
| Prep & season | 20 min | 2:40 PM |
| Roast | 90 min | 3:00 PM |
| Rest | 30 min | 4:30 PM |

All your dishes are scheduled the same way and then merged into a single chronological to-do list — so you always know what to do next, across every dish at once.

## Features

**Plan Editor** — Build your meal plan. Create dishes, set their target completion times, and add steps for each dish in the order you'll do them.

**Task List** — A live, chronological to-do list across all dishes. The next incomplete task is highlighted. Check steps off as you cook.

**Timeline** — A Gantt-style chart showing all dishes on a shared time axis. Each step is a colored block. Useful for spotting conflicts — moments where too many things need attention at once.

**QR Code Sharing** — Generate a QR code for any plan. Scanning it on another device opens the app and imports the plan automatically. The entire plan is compressed and encoded into the URL — no account or server needed.

**Export / Import** — Download your plan as a JSON file to back it up or share it. Useful for large plans that don't fit in a QR code, or for reusing a plan year to year.

## Data & privacy

No accounts, no cloud sync, no backend. Your plan is saved automatically in your browser's local storage. Nothing ever leaves your device unless you explicitly share or export it.

## Running locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) for state (persisted to localStorage)
- [pako](https://github.com/nodeca/pako) for compressing plans into shareable URLs
- [qrcode.react](https://github.com/zpao/qrcode.react) for QR generation
- [lucide-react](https://lucide.dev/) for icons


By Covington Software
