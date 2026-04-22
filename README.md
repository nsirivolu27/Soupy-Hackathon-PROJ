# Soupy

Soupy is a hackathon MVP for a calm, kiosk-friendly AI support web app for unsheltered people in Washington, DC. It helps a person describe what they need, receive brief supportive guidance, and see example local resource categories for shelter, food, hygiene, healthcare, transportation, documents, employment, and mental health support.

Soupy is not a licensed therapist, doctor, lawyer, case worker, or emergency service. It does not provide medical, psychiatric, or legal advice.

## What Works

- React + TypeScript + Tailwind frontend in `apps/web`
- Node.js + Express + TypeScript API in `apps/api`
- SQLite + Prisma data model in `prisma`
- Shared request/response types in `packages/shared`
- Anonymous session creation and reset
- Need classification from plain language
- Seeded Washington, DC example resources
- Resource matching by detected category
- OpenAI-powered supportive response when `OPENAI_API_KEY` is set
- Safe fallback response when no API key is present
- Crisis detection for self-harm, suicide, violence, abuse, overdose, and urgent medical language
- Crisis UI that stops the ordinary chat flow and shows 911 / 988 escalation options

## Architecture

```text
apps/web          React kiosk-style UI
apps/api          Express API for chat, resources, and sessions
packages/shared   Shared TypeScript types
prisma            SQLite schema and DC example resource seed
```

The frontend calls `POST /api/chat` with a session ID and message. The backend stores the message, checks crisis language first, classifies needs, fetches matching resources, and then asks OpenAI for a concise support response. If no OpenAI key is configured, the API returns a deterministic fallback response so the MVP still works locally.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Add your OpenAI key if you want LLM responses:

   ```bash
   OPENAI_API_KEY="your_key_here"
   ```

4. Create the SQLite database and generate Prisma client:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```

5. Seed example DC resources:

   ```bash
   npm run prisma:seed
   ```

6. Run the API and web app:

   ```bash
   npm run dev
   ```

The web app runs at `http://localhost:5173`.
The API runs at `http://localhost:4000`.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite database URL. Defaults to `file:./dev.db`, which Prisma stores relative to the `prisma` folder. |
| `OPENAI_API_KEY` | Optional. Enables OpenAI chat responses. |
| `OPENAI_MODEL` | Optional. Defaults to `gpt-4o-mini`. |
| `PORT` | API port. Defaults to `4000`. |
| `WEB_ORIGIN` | CORS origin for the web app. |
| `VITE_API_BASE_URL` | Frontend API base URL. |

## API Endpoints

- `GET /health` checks API health.
- `POST /api/chat` processes a chat message.
- `GET /api/resources?categories=shelter,food` returns resources for categories.
- `POST /api/sessions/reset` creates a fresh anonymous session.
- `DELETE /api/sessions/:id` clears a session and returns a new anonymous session.

## Crisis Handling

Crisis detection runs before ordinary resource matching and LLM response generation. If a message includes likely self-harm, suicide, violence, abuse, overdose, or urgent medical emergency language, the response switches to crisis mode:

- The normal chat input and quick-pick buttons are disabled.
- The UI shows a high-contrast crisis alert.
- The user sees direct 911 and 988 options.
- Ordinary resource recommendation pauses until the user starts over.

This is a prototype safeguard and should be reviewed by qualified clinical, legal, and local service experts before real-world use.

## Future Improvements

- Replace example resource data with maintained DC service directories.
- Add language selection and text-to-speech support.
- Add kiosk inactivity timeout with visible countdown.
- Add printing or SMS handoff for resource cards.
- Add observability that does not store sensitive message content.
- Expand safety testing with expert review and red-team prompts.
- Add end-to-end tests for crisis and non-crisis flows.
