# GRA.FUN - Monad Meme Token Launchpad
**English | [中文](README_CN.md)**

A React + Vite meme token launchpad built with TypeScript and Tailwind CSS.

## Project Structure

This is a Vite-powered React application:

```
Gnad.fun-Webapp/
├── .github/                # GitHub workflows, issue templates, etc.
├── public/                 # Static assets (images, favicon, etc.)
│   └── imgs/
├── src/                    # Source code
│   ├── assets/             # Static / shared assets (images, icons, fonts)
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-based modules (domain logic)
│   │   ├── token-launch/     # Token creation wizard
│   │   │   ├── components/   # UI parts for the wizard
│   │   │   ├── services/     # Feature logic (e.g. API calls)
│   │   │   ├── types/        # Feature-specific TypeScript types
│   │   │   └── index.ts      # Entrypoint / public API of this feature
│   │   └── trending/         # Trending tokens view
│   │       ├── components/
│   │       ├── services/
│   │       ├── types/
│   │       └── index.ts
│   ├── layouts/             # Layouts (e.g. main layout, dashboard layout)
│   ├── services/            # Shared services (e.g. API client, auth)
│   ├── styles/               # Global styling (Tailwind config, CSS)
│   ├── types/                # Shared TS types across the app
│   ├── utils/                # Utility functions and helpers
│   ├── charts/               # Chart components / wrappers (Recharts)
│   ├── icons/                # Icon components (Lucide etc.)
│   └── main.tsx              # App entry point
├── tests/                   # Automated tests (unit / integration)
├── vite.config.ts           # Vite config file
├── tsconfig.json             # TypeScript config
├── package.json              # NPM / Yarn dependencies & scripts
└── README.md                 # Project documentation

```

## Features

- 🚀 **Launch Tokens**: Create your own EVM meme tokens in seconds
- 📊 **Live Charts**: View token price trends with Recharts
- 🔥 **Trending View**: See the hottest tokens by 24h price change
- ⏰ **Recent View**: Browse newly launched tokens
- 💼 **Wallet Integration**: Mock wallet connection for token creation
- 🎨 **Beautiful UI**: Gradient backgrounds and glassmorphic cards
- ⚡ **Lightning Fast**: Powered by Vite for instant HMR

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server with HMR
npm run dev
```

The app will be available at `http://localhost:5173`

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Features

- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **Fast Refresh**: Preserves component state during edits
- **TypeScript**: Full type safety across the application
- **Path Aliases**: Import components with `@/` prefix
- **ESLint**: Code quality and consistency

## Project Highlights

- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Interactive Charts**: Real-time price visualization
- **Mock Wallet**: Simulated wallet connection for demonstration
- **Token Management**: Create and browse tokens with full state management
- **Glassmorphism**: Modern UI with backdrop blur effects
