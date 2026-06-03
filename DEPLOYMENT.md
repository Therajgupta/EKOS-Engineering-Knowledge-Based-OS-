# Deploying EKOS

EKOS has two parts:

| Part | Stack | Host on |
|------|--------|---------|
| **Frontend** | Next.js (`ekos-frontend/`) | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) |
| **Backend** | FastAPI + Qdrant + ML models | [Render](https://render.com), Railway, or Fly.io — **not** Vercel/Netlify |

Vercel and Netlify cannot run the Python backend (embeddings, local Qdrant, long-running indexing).

## 1. Push to GitHub

Repository: [EKOS-Engineering-Knowledge-Based-OS-](https://github.com/Therajgupta/EKOS-Engineering-Knowledge-Based-OS-)

## 2. Deploy backend (Render)

1. Connect the GitHub repo on [Render](https://render.com).
2. Use the blueprint `render.yaml` or create a **Web Service**:
   - **Build:** `pip install -r requirements.txt`
   - **Start:** `uvicorn backend.api:app --host 0.0.0.0 --port $PORT`
3. Set environment variables:
   - `GROQ_API_KEY` — from [console.groq.com](https://console.groq.com)
   - `CORS_ORIGINS` — your frontend URL(s), comma-separated  
     Example: `https://your-app.vercel.app,http://localhost:3000`
4. Copy the public URL (e.g. `https://ekos-api.onrender.com`).

> **Note:** Free tier cold starts are slow (~30–60s). Index data is stored on the instance disk; for production, set `QDRANT_URL` to [Qdrant Cloud](https://cloud.qdrant.io).

## 3. Deploy frontend (Vercel)

1. Import the repo on [Vercel](https://vercel.com).
2. **Root Directory:** `ekos-frontend` (or use root `vercel.json` which sets this).
3. Environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (no trailing slash)
4. Deploy.

## 3b. Deploy frontend (Netlify)

1. Import repo; Netlify reads `netlify.toml` at the repo root.
2. Set `NEXT_PUBLIC_API_URL` in Site settings → Environment variables.
3. Deploy.

## 4. Local development

```powershell
# Terminal 1 — backend
scripts\start-backend.bat

# Terminal 2 — frontend
cd ekos-frontend
npm install
npm run dev
```

## Troubleshooting

- **Frontend can’t reach API:** Check `NEXT_PUBLIC_API_URL` and `CORS_ORIGINS` on the backend.
- **Qdrant lock locally:** Run `scripts\stop-backend.bat` before starting a second server.
- **Backend won’t start on Render:** Use Python 3.11; first deploy may take several minutes to download the embedding model.
