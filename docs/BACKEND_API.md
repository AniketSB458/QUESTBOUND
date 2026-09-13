# Questbound Backend API Contract

Base path: `/api`. Protected endpoints require `Authorization: Bearer <token>`.

## Authentication

- `POST /auth/register` - `{ name, email, password, timezone? }`
- `POST /auth/login` - `{ email, password }`
- `GET /auth/me` - current persisted player profile

Passwords must be 8-72 characters. Tokens expire after seven days. The client must never send XP, credits, prices, attribute rewards, user IDs, or completion timestamps.

## Quests

- `GET /quests?completed=true|false&page=1&limit=50`
- `POST /quests` - `{ title, description?, category, difficulty, dueDate? }`
- `PATCH /quests/:id` - any editable quest fields
- `POST /quests/:id/complete` - no body
- `DELETE /quests/:id` - active quests only; returns `204`

Categories: `Coding`, `Study`, `Fitness`, `Health`, `Reading`, `Creativity`, `Personal`, `Other`.

Difficulties: `Easy`, `Medium`, `Hard`, `Epic`.

Completion is atomic and safe against duplicate rewards. A successful response includes `rewards`, authoritative `playerState`, and an optional `levelUpEvent`. Animate only after this response arrives.

## Dashboard and history

- `GET /dashboard` - player, XP progress, active quests, recent activity, and counts
- `GET /history?page=1&limit=50` - newest activity first; maximum 100 per page

## Shop

- `GET /shop` - catalog sorted by price
- `POST /shop/:id/purchase` - atomic purchase; no body

## Standard error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid quest",
    "fields": {}
  }
}
```

Important codes: `AUTH_REQUIRED`, `INVALID_TOKEN`, `VALIDATION_ERROR`, `QUEST_NOT_FOUND`, `QUEST_ALREADY_COMPLETED`, `ITEM_ALREADY_OWNED`, `INSUFFICIENT_CREDITS`, `INTERNAL_ERROR`.

## Frontend rules

1. Use `/api` for unified deployment or set `VITE_API_URL` to the deployed API origin.
2. Disable the completion button while awaiting the response.
3. Treat returned `playerState` as authoritative; never calculate rewards in the browser.
4. On `401`, clear the local session and navigate to login.
5. Display `error.message` for API failures.
