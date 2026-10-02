# VideoNest

A full-stack video sharing platform built with the MERN stack. Users can upload, watch, like, comment on, and organize videos into playlists. Channels support subscriptions, tweets, and a creator dashboard with analytics.

---

## Live Demo

> Add your deployed frontend URL here

---

## Tech Stack

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

**Frontend**

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=flat&logo=reactrouter&logoColor=white)

---

## Features

### Authentication and Security

- Dual-token JWT authentication using access tokens and refresh tokens stored in httpOnly cookies
- Silent token refresh: the frontend automatically retries failed requests after a 401 without logging the user out
- Multi-tier rate limiting across all API routes:
  - 5 failed login or registration attempts per 15 minutes per IP
  - 20 comments per minute per IP
  - 200 global requests per 15 minutes per IP
- Passwords hashed with bcrypt before storage

### Videos

- Upload videos with a custom thumbnail to Cloudinary
- Video duration extracted directly from Cloudinary upload metadata
- Relevance-ranked full-text search powered by a weighted MongoDB text index (title matches ranked 5x higher than description matches)
- Infinite scroll pagination on all video feeds using IntersectionObserver
- View count incremented on watch, with automatic deduplication in watch history
- Toggle video publish status (public or private) from the creator dashboard

### Channels and Social

- Subscribe to and unsubscribe from any channel
- Per-channel tabs: Videos, Playlists, Tweets, Subscribed channels
- Like videos, comments, and tweets with idempotent toggle logic
- Comment on videos with inline edit and delete for comment owners
- Tweets with emoji picker, inline editing, and deletion

### Playlists

- Create, rename, and delete playlists
- Add or remove videos from playlists via a modal with instant toggle feedback
- Playlist detail page with expandable description and owner management controls

### Creator Dashboard

- Channel stats: total subscribers, views, likes, and video count
- Video management table with visibility toggles, like counts, and edit and delete actions
- Upload video modal directly from the dashboard

### Search and Navigation

- Full-text search with MongoDB text index and `$meta: "textScore"` relevance sorting, replacing naive regex scanning
- Recent search history persisted in localStorage with deduplication and per-item deletion
- Search input expands on focus with real-time filtering of recent searches as the user types

### UI and UX

- Skeleton loaders on every data-driven view (no spinners anywhere in the app)
- Optimistic UI updates on likes, subscriptions, playlist toggles, and publish status
- Responsive layout: collapsible icon-only sidebar on desktop, sliding overlay drawer on mobile
- Custom emoji picker for tweets

---

## Architecture Highlights

### Backend

**Aggregation Pipelines** -- The API uses 12+ MongoDB aggregation pipelines for relational joins and computed fields. Examples:

- `getVideoById` joins owner details, computes `likesCount`, `isLiked`, `subscribersCount`, and `isSubscribed` in a single query
- `getUserChannelProfile` computes subscriber count and subscription status in one aggregation pass
- `getWatchHistory` reconstructs the original view order of the history array using `$map` and `$filter`
- `getAllVideos` supports full-text search via `$text`, computes relevance score via `$addFields: { score: { $meta: "textScore" } }`, and paginates using `mongoose-aggregate-paginate-v2`

**Error Handling** -- All async controllers are wrapped in `asyncHandler`. Errors flow through a centralized `errorHandler` middleware using a custom `ApiError` class, returning a consistent JSON shape across every route.

**File Uploads** -- Multer buffers files to a temp directory, uploads to Cloudinary, then deletes local files synchronously via `fs.unlinkSync` to prevent disk accumulation.

**Rate Limiting** -- `express-rate-limit` is configured with `trust proxy: 1` for correct IP detection behind reverse proxies (Render, Nginx). A custom handler passes rate limit errors to the centralized error middleware to maintain consistent error response format.

### Frontend

**API Client** -- A hand-rolled `fetch` wrapper handles JSON serialization, cookie credentials, and automatic 401 recovery by silently refreshing the access token and replaying the original request.

**Custom Hooks** -- Business logic is separated from UI via six custom hooks: `useAuth`, `useVideos`, `useTweets`, `usePlaylists`, `useSubscribedChannels`, and `useUser`.

**State Management** -- Global state is limited to authentication via React Context. All other state is colocated with the component or hook that owns it.

---

## Database Schema

| Model        | Key Fields                                                                         |
| ------------ | ---------------------------------------------------------------------------------- |
| User         | username, email, password (bcrypt), avatar, coverImage, watchHistory, refreshToken |
| Video        | videoFile, thumbnail, title, description, duration, views, isPublished, owner      |
| Comment      | content, video, owner                                                              |
| Like         | video / comment / tweet (polymorphic), likedBy                                     |
| Playlist     | name, description, videos[], owner                                                 |
| Subscription | subscriber, channel                                                                |
| Tweet        | content, owner                                                                     |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB connection string (Atlas or local)
- Cloudinary account (free tier)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hamza-30/videonest.git
   cd VideoNest
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create `backend/.env`:

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173

   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend:

   ```bash
   npm run dev
   ```

5. Open a new terminal and install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

6. Create `frontend/.env`:

   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

7. Start the frontend:

   ```bash
   npm run dev
   ```

8. Visit `http://localhost:5173`

---

## API Reference

All endpoints are prefixed with `/api/v1`.

| Resource      | Base Route       |
| ------------- | ---------------- |
| Users         | `/users`         |
| Videos        | `/videos`        |
| Comments      | `/comments`      |
| Likes         | `/likes`         |
| Playlists     | `/playlists`     |
| Subscriptions | `/subscriptions` |
| Tweets        | `/tweets`        |
| Dashboard     | `/dashboard`     |
| Healthcheck   | `/healthcheck`   |

---

## Screenshots

> Add screenshots or a GIF of the app here

---

## License

MIT
