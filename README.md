# PRANVANA | Artisan Incense Reviews & Gallery

A dynamic, production-ready reviews and gallery page for PRANVANA, featuring premium interactive effects and a serverless backend.

## ✨ Features
- **Interactive Hero**: Floating amber particles, mouse-parallax rings, and animated incense smoke SVG.
- **Dynamic Reviews**: Live fetching from PostgreSQL with skeleton loading and relative timestamps.
- **Instant Feedback**: New reviews are prepended instantly with an amber highlight effect.
- **Real-time Stats**: Pulsing green dot with a live reflection count.
- **Premium Design**: Cormorant Garamond & Jost typography with a custom amber cursor system.

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   - Create a `.env` file from the example:
     ```bash
     cp .env.example .env
     ```
   - Paste your Neon `POSTGRES_URL` into `.env`.

3. **Run Locally**:
   ```bash
   npm run local
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 🚀 5-Minute Deployment Guide

### 1. Setup Database (Neon)
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new project named `pranvana`.
3. Copy the **Connection String** from the dashboard. It should look like: `postgres://user:password@hostname/neondb?sslmode=require`.

### 2. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and create a free account.
2. Click **Add New** > **Project** and import your repository (or use the Vercel CLI).
3. **Environment Variables**: In the Vercel project settings, add a new variable:
   - **Key**: `POSTGRES_URL`
   - **Value**: [Paste your Neon connection string here]
4. Click **Deploy**.

### 3. Verification
- Once deployed, visit your Vercel URL.
- The `reviews` table will be **automatically created** on the first request.
- Test the form by submitting a "reflection". It should appear instantly.

## 📦 Deliverables
- `api/reviews.js`: Serverless logic for GET/POST.
- `public/index.html`: Main frontend with CSS/JS.
- `package.json`: Dependencies (`pg`).
- `vercel.json`: Routing configurations.
- `README.md`: Setup instructions.

## 🎨 Design System
- **Colors**: Amber (#D97706), Dark Surface (#1A1A14), Deep Background (#0F0F0B).
- **Typography**: Cormorant Garamond (Serif), Jost (Sans).
