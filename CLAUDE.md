# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MathGen is an AI-powered Singapore Math question generator with a React frontend and Express.js backend. The frontend is built with Vite, Tailwind CSS v4, and shadcn/ui components. The backend server securely handles OpenAI API calls to generate multiple-choice questions based on Singapore Math curriculum specifications. The project uses pnpm as the package manager.

**Architecture**: Client-Server
- **Frontend**: React SPA (Single Page Application)
- **Backend**: Express.js API server
- **Security**: OpenAI API key stored securely on backend only

## Application Features

- **Question Generation Form**: Select Strand, Sub-Strand, Learning Objective, Description, and number of questions from dropdowns populated with Singapore Math curriculum data
- **AI Integration**: Sends form data to OpenAI API to generate contextual multiple-choice questions
- **Question Display**: Shows generated questions with options and correct answers
- **Edit Functionality**: Each question can be edited (question text and options)
- **Image Upload**: Add images to questions via the edit dialog
- **Custom Theme**: Uses Ukraine flag colors (blue #0057B7 and yellow #FFD700) along with black and white

## Environment Setup

This application requires an OpenAI API key for the backend server.

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. The API key is used only by the backend server (`server/index.js`) and is never exposed to the client

## Development Commands

```bash
# Start both frontend and backend (recommended for development)
pnpm dev

# Start only frontend (requires backend running separately)
pnpm dev:client

# Start only backend server
pnpm dev:server

# Build frontend for production
pnpm build

# Start backend server in production
pnpm start

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

The `pnpm dev` command runs both the Vite dev server (frontend on port 5173) and Express server (backend on port 3001) concurrently.

## Tech Stack & Configuration

**Frontend:**
- **Build Tool**: Vite with React plugin
- **UI Framework**: React 19 with JSX
- **Styling**: Tailwind CSS v4 (using @tailwindcss/vite plugin)
- **Component Library**: shadcn/ui (New York style, slate base color, CSS variables enabled)
- **Icons**: lucide-react
- **Linting**: ESLint with React Hooks and React Refresh plugins

**Backend:**
- **Server**: Express.js v5
- **Runtime**: Node.js
- **API Integration**: OpenAI GPT-4o-mini
- **CORS**: Enabled for frontend communication

**Tools:**
- **Package Manager**: pnpm (always use pnpm, not npm or yarn)
- **Process Manager**: concurrently (runs frontend + backend simultaneously)

## Project Structure

```
├── server/
│   └── index.js           # Express.js backend server (handles OpenAI API calls)
├── src/                   # Frontend source code
│   ├── components/
│   │   ├── ui/            # shadcn/ui components (auto-generated via CLI)
│   │   ├── QuestionForm.jsx   # Form with dropdowns for curriculum selection
│   │   └── QuestionDisplay.jsx # Display and edit generated questions
│   ├── data/
│   │   └── curriculum.js  # Singapore Math curriculum data structure
│   ├── services/
│   │   └── openai.js      # Frontend API client (calls backend, not OpenAI directly)
│   ├── lib/
│   │   └── utils.ts       # Utility functions (includes cn() for className merging)
│   ├── hooks/             # Custom React hooks
│   ├── App.jsx            # Main application component with state management
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles, Tailwind CSS config, Ukraine colors
├── .env.local             # Environment variables (API key)
└── vercel.json            # Deployment configuration for Vercel
```

## Import Aliases

The project uses path aliases configured in both `tsconfig.json` and `vite.config.js`:

- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`
- `@/components/ui` → `./src/components/ui`

Always use these aliases instead of relative imports when importing from these directories.

## shadcn/ui Integration

shadcn/ui is configured with:
- Style: "new-york"
- TypeScript: Enabled (even though main codebase uses JSX)
- Icon library: lucide-react
- Base color: slate
- CSS variables: Enabled

To add new components:
```bash
pnpm dlx shadcn@latest add <component-name>
```

Components are auto-installed to `src/components/ui/`.

## Code Style Notes

- Use JSX for React components (`.jsx` extension)
- Use TypeScript for utilities when needed (e.g., `src/lib/utils.ts`)
- ESLint config ignores unused variables matching pattern `^[A-Z_]` (useful for React components)
- Tailwind v4 is configured via Vite plugin, not traditional config file

## Color Theme

The application uses a custom color scheme:
- **Ukraine Blue**: `#0057B7` (accessible via `text-ukraine-blue`, `bg-ukraine-blue`, `border-ukraine-blue`)
- **Ukraine Yellow**: `#FFD700` (accessible via `text-ukraine-yellow`, `bg-ukraine-yellow`, `border-ukraine-yellow`)
- **Black and White**: Standard black/white for contrast

Custom color utilities are defined in `src/index.css` under `@layer utilities`.

## Backend API

The Express.js backend (`server/index.js`) provides the following endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/generate-questions` - Generate questions via OpenAI API

**OpenAI Integration:**
- Model: `gpt-4o-mini` (configured in backend server)
- API endpoint: `https://api.openai.com/v1/chat/completions`
- Response format: JSON object with metadata and questions array
- Each question includes: id, question text, options (A-D), and correct answer
- Uses `response_format: { type: 'json_object' }` to ensure valid JSON responses

**Security:**
- OpenAI API key is stored only on the backend (environment variable)
- Frontend calls backend at `/api/generate-questions`, never directly to OpenAI
- CORS enabled for frontend-backend communication
- API key is never exposed to the client browser
