/**
 * Backend API base URL.
 * - Local: http://localhost:8000
 * - Vercel/Netlify: set NEXT_PUBLIC_API_URL to your hosted backend (Render, Railway, etc.)
 */
export const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";
