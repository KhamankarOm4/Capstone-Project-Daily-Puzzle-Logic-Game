# 🧩 Logic Looper

**Logic Looper** is a premium daily logic puzzle platform where users solve a unique challenge every day, compete on global leaderboards, and maintain their winning streaks.

![App Screenshot](public/screenshot.png) (Add a screenshot here)

## ✨ Features

- **Daily Challenges**: A new, unique logic puzzle every 24 hours.
- **Practice Mode**: Sharpens your skills with historical or practice puzzles.
- **Global Leaderboard**: Compete with other "Agents" to secure the top spot for the day.
- **Streak System**: Track your consecutive days played and keep the fire burning! 🔥
- **Advanced Scoring**: Points are calculated based on time, accuracy, and hint usage.
- **Dark/Light Mode**: Seamlessly transition between themes for the best experience.
- **PWA Ready**: Installable on mobile and desktop for quick access.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Utilities**: Day.js (Date handling), idb (IndexedDB persistence)

### Backend
- **Server**: Express.js (Node.js)
- **ORM**: Prisma (PostgreSQL)
- **Authentication**: Google OAuth (Passport.js) & JWT
- **Hosting**: Designed for deployment on Render/Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KhamankarOm4/Capstone-Project-Daily-Puzzle-Logic-Game.git
   cd DailyPuzzle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dailypuzzle"
   SESSION_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**:
   ```bash
   # Start the frontend (Vite)
   npm run dev

   # Start the backend (in a separate terminal)
   npm start
   ```

## 📂 Project Structure

- `src/`: React frontend source code.
- `routes/`: Express API endpoints.
- `lib/`: Shared utilities and database clients.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets and PWA icons.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.