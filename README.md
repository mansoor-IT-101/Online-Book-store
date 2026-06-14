# Online Bookstore API

Minimal Express + MongoDB API for managing books. This repository includes seed data, Postman collection, and a health endpoint.

Prerequisites
- Node.js (>=16)
- npm
- MongoDB Atlas cluster and connection string

Setup
1. Copy your Atlas connection string into `./.env` as `MONGO_URI`. Example:

```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster1.fvwhhv9.mongodb.net/bookstore?retryWrites=true&w=majority
PORT=5000
```

2. Install dependencies:

```bash
npm install
```

3. Seed sample data (optional):

```bash
npm run seed
```

4. Start the server:

```bash
node server.js
# or for development with nodemon (PowerShell may block scripts):
npm run dev
```

5. Check health:

```powershell
Invoke-RestMethod -Uri http://localhost:5000/health -UseBasicParsing
```

API Endpoints
- `GET /api/books` — list books
- `GET /api/books/:id` — get book
- `POST /api/books` — create book (JSON body)
- `PUT /api/books/:id` — update book
- `DELETE /api/books/:id` — delete book
- `GET /health` — app + DB connection status

Import `postman_collection.json` into Postman to try requests.

Notes
- Ensure your IP is whitelisted in Atlas Network Access. If you see `ETIMEOUT` or `connecting` status, add your current IP in Atlas and retry.
