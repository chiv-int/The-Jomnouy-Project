# Jomnouy (M1 frontend prototype)

Vue 3 + TypeScript (strict) + Vite, Vue Router, Pinia. Data comes from a mock API: `json-server` reading `db.json`.

## How to run it
From the `jomnouy` folder, run in two terminals:

    cd jomnouy
    npm install
    npm run api     # terminal 1: json-server on http://localhost:3000
    npm run dev     # terminal 2: the app on http://localhost:5173

(`npm start` runs both in one terminal.)

Checks: `npm run check` (type-check + ESLint) and `npm run build`.

## Routes
| Path | Page | Notes |
|---|---|---|
| `/` | Home feed | category icons (`CategoryRail`), search (`?q=`), loading / error / empty / success |
| `/posts/:id(\d+)` | Post detail | route parameter, digits only |
| `/posts/new` | Create post | form with client-side validation |
| `/users/:id(\d+)` | Profile page | anyone can open anyone's profile and see their pinned posts |
| `/profile` | Shortcut | redirects to my own profile |
| `/moderation` | Reported content | moderators only (client-side `beforeEach` route guard, UX only) |
| `/:pathMatch(.*)*` | 404 page | catch-all placed last |

The "View as" switch in the header changes the role (`member` / `moderator`). As a Member, opening `/moderation` redirects to `/?denied=1`.

## Folders (`jomnouy/`)
- `src/api/` network layer: `http.ts` (`http://localhost:3000`) plus one file per resource (`posts`, `comments`, `reports`, `users`, `pins`)
- `src/stores/` Pinia stores (`posts`, `reports`, `profile`, `session`)
- `src/views/` pages (`HomeView`, `PostDetailView`, `CreatePostView`, `ProfileView`, `ModerationView`, `NotFoundView`)
- `src/components/` reusable pieces (`AppHeader`, `CategoryRail`, `PostCard`, `SkeletonCard`, `StatePanel`)
- `docs/` wireframes (`wireframe.pdf`), component tree (`components.md`), proposal (`ChivInthera_proposal.md`), and `README.md`

## Where is each field validated?
Create post form (`jomnouy/src/views/CreatePostView.vue`):
- `category`: required
- `title`: required, trimmed length 3 to 100 characters
- `content`: required, trimmed non-empty

This is client-side only. The server will validate again in weeks 6 and 7.

## State: store or component?
**In Pinia stores:** data from the server that several pages use (`posts`, `currentPost`, `comments`, `reports`, viewed profile and `pinnedPosts`), the `loading` and `error` flags, and `session` (`currentUser` and `role`). They must survive moving between pages.

**In components:** temporary state one screen cares about: what is typed in the form (`category`, `title`, `content`, `submitted`, `submitting`, `submitError`), the selected `category` icon in `HomeView`, and the header `search` box text. It disappears when the screen closes.

## M1 submission
    git checkout -b m1-frontend
    # work, commit, open a pull request, merge it
    git tag m1
    git push --follow-tags
