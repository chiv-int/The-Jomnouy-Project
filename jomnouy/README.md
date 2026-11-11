# Jomnouy (M1 frontend prototype)

Vue 3 + TypeScript (strict) + Vite, Vue Router, Pinia. Data comes from a mock API: json-server reading `db.json`.

## How to run it
Two terminals:

    npm install
    npm run api     # terminal 1: json-server on http://localhost:3000
    npm run dev     # terminal 2: the app on http://localhost:5173

(`npm start` runs both in one terminal.)

Checks: `npm run check` (type-check + ESLint) and `npm run build`.

## Routes
| Path | Page | Notes |
|---|---|---|
| `/` | Home feed | category sidebar, search, loading / error / empty / success |
| `/posts/:id` | Post detail | route parameter, digits only `(\d+)` |
| `/posts/new` | Create post | form with validation |
| `/users/:id` | Profile page | anyone can open anyone's profile and see their pinned posts |
| `/profile` | Shortcut | redirects to my own profile |
| `/moderation` | Reported content | moderators only (client-side route guard) |
| `/:pathMatch(.*)*` | 404 page | catch-all placed last |

The "View as" switch in the header changes the role (`member` / `moderator`). As a Member, navigating to `/moderation` redirects to `/?denied=1`.

> **Note on Route Guards:** Client-side route guards (e.g., `beforeEach`) are strictly UX conveniences to prevent members from navigating to moderator screens. They are not security controls; real security authorization must be enforced by the backend API in Milestone 2.

## Folders
- `src/api/` network layer: `http.ts` (uses `VITE_API_URL` environment variable) plus one file per resource (`posts`, `comments`, `reports`, `users`, `pins`)
- `src/stores/` Pinia stores (`posts`, `reports`, `profile`, `session`)
- `src/views/` pages, `src/components/` small reusable pieces
- `docs/` wireframes, component tree (`docs/components.md`), proposal

## Where is each field validated?
Create post form (`src/views/CreatePostView.vue`):
- `category`: required (must choose Question, Help, Rent, or Sell)
- `title`: required, trimmed length 3 to 100 characters
- `content`: required, trimmed non-empty

Errors are displayed under each field only after the first submission attempt. This is client-side validation for immediate feedback. The backend server will re-validate in Weeks 6 and 7.

## State: store or component?
**In Pinia stores:** data from the server that several pages use (posts list, current post, comments, reports), the `loading` and `error` flags, and the session (`currentUser` and `role`). They survive navigating between routes. State changes only occur through store actions (`loadPosts`, `loadPost`, `addPost`, `getCommentCount`, `setRole`).

**In components:** temporary state that only one screen cares about: form input fields, post editing buffers, search box query, mobile navigation drawer visibility, and `submitting` flags. This state resets when the component unmounts.

## Known Limitations
- **Request Race Conditions & Cancellation:** In `src/stores/posts.ts`, an incrementing request ID ensures responses from older pending queries cannot overwrite results from newer search or category selections. Full network-level cancellation (via `AbortController`) is a known limitation reserved for Milestone 2.
- **Image Uploads:** File input controls for attaching images to posts and comments are decorative prototypes for Milestone 1; file persistence and cloud storage will be implemented in Milestone 2.
- **Post card edit and delete:** editing and deleting on post cards is UI-only in Milestone 1 and is not saved; saving to the API comes in Milestone 2.

