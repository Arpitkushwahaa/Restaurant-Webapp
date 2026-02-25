# Restaurant Webapp

Author: Arpit Kushwaha

## Overview
This repository contains a full-stack Restaurant Web Application built with TypeScript. The project provides user-facing restaurant discovery and ordering flows plus an admin dashboard for menu and user management. It is designed for rapid local development and deployment to common Node/Vercel-style hosting environments.

## Highlights
- Full auth: signup, login, email verification, password reset
- Admin panel: create/edit menu items, manage users, view and update orders
- Customer flows: browse restaurants, add items to cart, checkout, order tracking
- Image upload handling and storage utilities
- Razorpay payment integration (docs included)

## Tech Stack & Architecture
- Frontend: React + TypeScript, Vite, Tailwind CSS
- Backend: Node.js + Express with TypeScript
- Database: MongoDB (Atlas-ready)
- Email: Mailtrap (dev) or configured SMTP provider
- Payments: Razorpay (optional)

The codebase separates client and server responsibilities: the `client` folder contains the React app, and `server` contains the Express API, controllers, models, and utilities.

## Repository Layout (important files)
- `client/` — React app built with Vite. Key folders:
	- `src/admin` — admin pages (`AddMenu.tsx`, `Orders.tsx`, etc.)
	- `src/components` — reusable UI components (`Navbar.tsx`, `Cart.tsx`)
	- `src/store` — Zustand stores for cart, menu, orders, user
- `server/` — Express API in TypeScript
	- `server/routes` — API route definitions
	- `server/controller` — request handlers and business logic
	- `server/models` — Mongoose models
	- `server/utils` — helpers (`generateToken.ts`, `imageUpload.ts`)
- `DEPLOYMENT.md` — deployment instructions
- `RAZORPAY_SETUP.md` — payment setup guide

## Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- MongoDB connection (Atlas recommended)

## Local Development
Follow these steps to run both server and client locally.

Server
```bash
cd server
npm install
# create .env (see Environment below)
npm run dev
```

Client
```bash
cd client
npm install
npm run dev
```

The client runs on a Vite dev server and the server uses `ts-node`/`nodemon` in dev mode by default (see `server/package.json` scripts).

## Environment Variables (server/.env)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `MAILTRAP_USER`, `MAILTRAP_PASS` — or other SMTP credentials
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — if using Razorpay

## Testing & Linting
- The project includes TypeScript settings and linting in the `client` folder. Run available scripts in `client/package.json` and `server/package.json`.

## Deployment
See `DEPLOYMENT.md` for platform-specific deployment steps. The structure supports deploying the server to any Node host and the client to static hosts or Vercel.

## Contributing
- Create a branch for each feature or bugfix.
- Keep changes focused and open a pull request with a description of changes.

## Author & Contact
Arpit Kushwaha

