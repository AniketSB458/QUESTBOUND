# NEXUS — Life RPG

## Overview
**Tagline:** Level Up Your Real Life.

NEXUS is a full-stack web application that gamifies real-life productivity. It converts everyday tasks into RPG-style quests. By completing quests, users earn XP and Credits, level up, increase their RPG attributes, and purchase cosmetic items from the Nexus Market.

## Features
- **RPG Progression Engine**: Non-linear leveling system based on XP.
- **Quest System**: Create and complete quests with dynamic XP, Credit, and Attribute rewards based on difficulty.
- **Attributes**: Quests improve specific character stats (e.g., Coding -> Intellect, Fitness -> Strength).
- **Streak Tracking**: Maintain a daily active streak to earn rewards.
- **Credit Economy & Shop**: Spend hard-earned credits in the Nexus Market on cosmetics, avatars, and badges.
- **Dashboard**: A futuristic game HUD to visualize your character's progress.
- **Security**: Robust authentication using JWT and bcrypt, with strict data isolation per user.

## Screenshots
*(Provide screenshots here)*

## Tech Stack
**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Lucide React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## Architecture
NEXUS uses a classic client-server architecture. The frontend is a React SPA communicating with an Express REST API. The database is MongoDB, enabling scalable document storage for users, quests, and activities. The backend handles all sensitive calculations (e.g., XP and credit rewards) to prevent client-side manipulation.

## Database Schema
- **User**: Stores authentication, RPG stats (level, xp, credits, attributes, streak), and inventory.
- **Quest**: Represents a task, including its category, difficulty, rewards, and completion status.
- **ShopItem**: Global catalog of items available for purchase.
- **Activity**: Audit log of all actions (e.g., quest completions, purchases, level ups) for timeline history.

## API Endpoints
### Auth
- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile

### Quests
- `GET /api/quests` - List user quests
- `POST /api/quests` - Create a quest
- `POST /api/quests/:id/complete` - Complete a quest (awards XP/Credits)
- `DELETE /api/quests/:id` - Remove a quest

### Shop
- `GET /api/shop` - List available items
- `POST /api/shop/:id/purchase` - Buy an item

### History
- `GET /api/history` - Get activity timeline

## Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexus
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
VITE_API_URL=/api
```

## Local Setup
1. Clone the repository.
2. Run `npm install` in the root directory.
3. Configure your `.env` file.
4. Run `npm run dev` to start both the Vite development server and the Express backend concurrently.

## Database Setup
Ensure you have a MongoDB instance running locally or a MongoDB Atlas cluster.
To populate the shop with initial items, run the seed script:
```bash
npx tsx seed.ts
```

## Running Frontend & Backend
The project is configured as a unified full-stack application for streamlined development.
- **Development**: `npm run dev` starts the Express server which mounts Vite as middleware, serving both the API and frontend on port 3000.
- **Production**: `npm run build` bundles the frontend into `/dist` and compiles the backend into `/dist/server.cjs`. `npm start` runs the bundled server.

## Deployment
**Frontend & Backend (Unified Container)**:
The application can be deployed as a single unit to services like Google Cloud Run, Render, or Railway. Ensure the production start command is `npm start` and environment variables are configured in the dashboard.

## Demo Video
*(Link to 90-180s walkthrough video here)*

## Project Structure
```
nexus-life-rpg/
├── src/                # Frontend React code
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── App.tsx
├── server/             # Backend Express code
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── db.ts
├── server.ts           # Unified Server Entry Point
├── seed.ts             # Database seeding script
└── package.json
```

## Future Improvements
- **Social Features**: Friend lists, guilds, and leaderboards.
- **Advanced Quests**: Recurring quests, multi-step quests, and quest chains.
- **Equipment System**: Allow users to equip items that provide permanent or temporary stat boosts.
- **Push Notifications**: Reminders to keep the daily streak alive.
