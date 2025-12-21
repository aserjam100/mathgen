# Singapore Math Question Generator

An AI-powered application that generates multiple-choice math questions based on Singapore Math curriculum specifications. Features a secure client-server architecture with React frontend and Express.js backend.

## Features

- **Curriculum-Based Selection**: Choose from Strand, Sub-Strand, Learning Objective, and Description dropdowns populated with Singapore Math curriculum data
- **AI-Powered Generation**: Uses OpenAI GPT API to generate contextually appropriate questions
- **Secure Architecture**: Backend server protects your OpenAI API key from exposure
- **Question Editing**: Edit any generated question text or options
- **Image Support**: Add images to questions for visual learning
- **Custom Theme**: Ukraine flag colors (blue and yellow) with clean black and white design

## Setup

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager
- OpenAI API key

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

Start both frontend and backend servers:
```bash
pnpm dev
```

This will start:
- **Frontend**: `http://localhost:5173` (React app)
- **Backend**: `http://localhost:3001` (Express API server)

You can also run them separately:
```bash
# Terminal 1 - Backend
pnpm dev:server

# Terminal 2 - Frontend
pnpm dev:client
```

## Usage

1. **Select Curriculum Parameters**:
   - Choose a Strand (e.g., "Number and Algebra")
   - Select a Sub-Strand (e.g., "Whole Numbers")
   - Pick a Learning Objective (e.g., "Addition and Subtraction")
   - Choose a Description (e.g., "use of +, - and =")
   - Select the number of questions to generate (1-10)

2. **Generate Questions**:
   - Click "Generate Questions" button
   - Wait for the AI to generate your questions

3. **Review and Edit**:
   - View the generated questions with their options
   - Click "Edit" on any question to modify it
   - Add images to questions if needed
   - Save your changes

## Tech Stack

**Frontend:**
- React 19 with Vite
- Tailwind CSS v4
- shadcn/ui components
- lucide-react icons

**Backend:**
- Express.js v5
- Node.js
- OpenAI GPT-4o-mini API

**Tools:**
- pnpm (package manager)
- concurrently (run frontend + backend together)

## Project Structure

```
├── server/
│   └── index.js           # Express.js backend server
├── src/                   # Frontend source code
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── QuestionForm.jsx   # Main form component
│   │   └── QuestionDisplay.jsx # Question display and edit component
│   ├── data/
│   │   └── curriculum.js  # Singapore Math curriculum data
│   ├── services/
│   │   └── openai.js      # Backend API client
│   ├── App.jsx            # Main app component
│   └── index.css          # Global styles and theme
└── vercel.json            # Deployment configuration
```

## Color Theme

The application uses Ukraine flag colors:
- **Blue**: #0057B7
- **Yellow**: #FFD700
- Combined with black and white for a clean, professional look

## Architecture & Security

**Client-Server Architecture:**
- Frontend (React) runs in the browser
- Backend (Express.js) runs on the server
- OpenAI API key is stored only on the backend
- Frontend communicates with backend via REST API

**Security Benefits:**
- API key never exposed to client browsers
- Safe for public deployment
- Prevents unauthorized API usage
- Rate limiting can be added on backend

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy via Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project" and import your repository
   - Vercel will auto-detect the configuration from `vercel.json`
   - Add environment variable:
     - Name: `OPENAI_API_KEY`
     - Value: Your OpenAI API key
   - Click "Deploy"

3. **Done!** Your app will be live with a URL like `https://your-app.vercel.app`

**OR use Vercel CLI:**
```bash
pnpm add -g vercel
vercel login
vercel
# Follow prompts and add OPENAI_API_KEY when asked
vercel --prod
```

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify**: Add build command `pnpm build`, publish directory `dist`, and set environment variables
- **Railway**: Connect GitHub repo, add `OPENAI_API_KEY` environment variable
- **Render**: Deploy as Web Service, add environment variable

## Notes

- This is a POC (Proof of Concept) to showcase the technology
- The OpenAI API model is set to `gpt-4o-mini` in the backend
- Generated questions follow Singapore Math methodology
- Images are stored as base64 data URLs (for POC purposes)
- Backend protects API key from exposure

## Future Enhancements

- Export questions to various formats (PDF, Excel, etc.)
- Question bank storage and retrieval
- User authentication and saved question sets
- Difficulty level selection
- Multi-language support
