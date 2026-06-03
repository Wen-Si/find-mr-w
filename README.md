# Find Mr.W - Financial Fraud Detection Game

A detective-style educational game where players learn to detect financial fraud by analyzing financial statements.

## Features

- 🎮 Interactive detective gameplay
- 📊 Educational content about financial fraud detection
- 📈 Progressive difficulty system
- 🧩 Clue collection and mystery solving
- 💾 Persistent progress storage
- 🤖 AI-powered mystery character (uses qwen3.5 0.8b model)
- 🎭 Three different character personas: Boss, Partner, Rival
- 💬 Multi-turn chat with context awareness

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router

### Backend
- Node.js
- Express.js
- CORS

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
cd backend
npm install
npm run dev
```

3. Start the frontend development server:
```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Project Structure

```
.
├── backend/                # Express.js backend
│   ├── index.js           # Server entry point
│   ├── data.js            # Game data
│   └── package.json
├── src/
│   ├── api/              # API client
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript types
└── package.json
```

## Deployment

This project is configured for deployment on Vercel with both frontend and backend in a single repository.

## License

MIT
