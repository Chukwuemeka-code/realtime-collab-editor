# Real-Time Collaborative Code Editor

A full stack web app where multiple users edit the same document live. Built during the IT-Simplera Solutions Full Stack Development Internship (Batch 02, Project 01).

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Socket.IO client
- **Backend:** Node.js, Express, Socket.IO
- **Database:** PostgreSQL (Neon)
- **Auth:** bcrypt password hashing, JWT tokens

## Features Completed

| Feature | Status |
|---|---|
| Register, login, logout | Done |
| Password hashing (bcrypt) | Done |
| JWT token sessions | Done |
| Create, list, delete documents | Done |
| Owner / Editor / Viewer roles stored in database | Done |
| Owner-only rename and delete (enforced on server) | Done |
| Real-time editing between users (WebSockets) | Done |
| Viewer edits blocked on server | Done |
| Document text saved to database | Done |

## Planned Next

- Syntax-highlighted code editor and language switcher
- Conflict resolution with CRDT
- Share by email with role
- Live cursors and online users panel
- Version history with restore
- Whiteboard module
- Chat, email invites, offline sync
- Docker deployment and live URL

## How It Works

1. A user logs in and receives a JWT token.
2. The token is sent with every API request and checked by middleware on the server.
3. Opening a document connects to a Socket.IO room for that document.
4. The server checks the user's role before joining the room.
5. Each edit is broadcast to the others in the room and saved to the database.
6. Viewers cannot edit: the server ignores their edits.

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create an account |
| POST | /api/auth/login | No | Log in, returns token |
| POST | /api/documents | Yes | Create a document |
| GET | /api/documents | Yes | List my documents |
| PATCH | /api/documents/:id | Owner | Rename a document |
| DELETE | /api/documents/:id | Owner | Delete a document |

**Socket events:** `join-document` (checks access), `edit` (broadcast and save).

## Run Locally

1. Clone the repo.
2. In `server/`, create a `.env` file:
   ```
   DATABASE_URL=your-postgres-connection-string
   JWT_SECRET=any-long-random-text
   ```
3. Create the tables:
   ```
   cd server
   npm install
   node setupDb.js
   node setupDocs.js
   node index.js
   ```
4. In a second terminal:
   ```
   cd client
   npm install
   npm run dev
   ```
5. Open http://localhost:5173

## Screenshots

See the `screenshots` folder.

## Author

Mmaduka Vincent Chukwuemeka

On Fri, 27 Nov 2026, 11:29 Mmaduka Vincent Chukwuemeka, <vincentmmaduka6@gmail.com> wrote:


