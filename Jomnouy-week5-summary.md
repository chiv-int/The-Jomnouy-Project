# Jomnouy: Week 5 project summary (handoff document)

**How to use this file:** paste it into a new chat with any AI and say "this is my project and what I did so far; help me with ...". It explains the project, the course requirements, every decision made, what was built, and what is still to do. Where something is uncertain, it says so.

---

## 1. What the project is

**Jomnouy** is a localized, non-profit-feeling **community board web app**. It was inspired by **Reddit** (forum-style posts and comments) and **Facebook Marketplace** (buying, selling, renting, asking for help). The goal is a place where community members ask questions, offer help, and rent or sell second-hand items safely, without the heavy commercialization of the big social media marketplaces.

- It is a **university coursework project** (full-stack web development). The final app is built over several weeks and milestones.
- The proposal document lists a GitHub repository: `https://github.com/chiv-int/The-Jomnouy-Project` (the proposal's student name is Chiv Inthera, id p20240019).
- The name "Jomnouy" sounds Khmer (help / aid).
- **Important framing from the teacher: "Keep it a board, not a social network."** No follows, no chat, no activity feeds.

## 2. Course context and milestone

- **Milestone M1: Frontend prototype (week 5).** Due at the end of week 5. M1 is checked in the week 6 practice session. Submitted by pushing a git tag `m1` (`git tag m1` then `git push --follow-tags`), after working on a branch merged by pull request.
- **M1 checklist (from the handout):**
  1. Wireframes (photo or tool) of the main screens in `docs/`
  2. Vue 3 + TypeScript app created with Vite; strict mode on; ESLint passes
  3. At least 4 routes, including a detail page with a route parameter
  4. At least one form with client-side validation
  5. A Pinia store and a service layer calling a mock API (json-server or local JSON)
  6. Loading, empty and error states visible
  7. Explain: what state lives in the store and what stays inside a component? Why?
- **Week 5 practice handout ("Building a Single-Page App")** has Parts A to F. Parts A to E are done in a separate practice repo (a "Campus Events" starter, `week05-starter.zip`): routes and guard, events store, validated booking form, booking action, a composable. Part F is "apply the same to your own app = M1". Practice repo also needs `week05/ANSWERS.md` with 2 to 4 sentence answers to five questions (about the dev server serving /events/2 on refresh, the guard not being real security, `watch` with `immediate` vs `onMounted`, `storeToRefs`, and a failed second request after booking).
- **At the week 6 check the teacher expects the student to:** show the four states (loading, error, empty, success) of one page, explain why a piece of state is in a store, and say where a field is validated.
- **Upcoming (from the handout):** week 6 is HTTP and REST in depth, then **NestJS**. The student writes an API contract and replaces json-server with a real backend in weeks 6 and 7.
- Status of Parts A to E and `ANSWERS.md`: **not confirmed**. The student was told to do them in the practice repo.

## 3. The proposal (original, as submitted)

### Roles
- **Member:** create, read, update and delete their own posts and comments; report bad behavior.
- **Admin/Mod:** monitors the feed, reviews reported content, deletes inappropriate posts, bans users.

### User stories (original numbering)
1. Member creates and browses posts across 4 categories: **Question, Help, Rent, Sell**.
2. Member blocks specific users and topics (blocklist).
3. Member closes/opens their "help wanted" posts.
4. Member edits their own posts and deletes their own comments.
5. Admin reviews reported content and deletes posts or bans users.
6. Member uploads a single picture with a post or comment.
7. Member pins favorite posts to the top of their profile.
8. Member adds a location tag to posts.
9. Admin creates "Announcement" posts pinned to the top of everyone's home feed.
10. Member sees a live chat/typing indicator (who is online).

Acceptance criteria were given for Stories 1, 4 and 5 (one line each).

### MVP scope
- **Must have:** Stories 1, 3, 4, 5, 6, 7
- **Nice to have:** Stories 2, 8, 9, 10
- Cut from the MVP and explained: blocklist, location tags, admin announcements, live chat (to keep a 14-week timeline realistic).

### Stretch feature
Search, filter and pagination: keyword search; load 10 posts at a time with infinite scroll (like Facebook or Reddit). Secondary stretch: single-picture file upload.

### Original entities
| Entity | Attributes | Relations |
|---|---|---|
| User | id, email, password, role, isBanned | has many Posts, Comments, Reports |
| Post | id, title, content, category, isClosed, isPinned | belongs to User, has many Comments |
| Comment | id, content, imageUrl | belongs to Post and User |
| Report | id, reason, targetType (post/comment), targetId | belongs to User (reporter) |

## 4. Teacher feedback and what it changed

Feedback received: scope is appropriate (watch social scope); strengths were the clear community/moderation idea and the honest explanation of cuts. **To fix before M1:**
1. Acceptance criteria are one line each: add 2 to 3 testable conditions (status codes, validation) for the top 3 stories. **(Not done yet.)**
2. Story 7 is must-have but `Post.isPinned` is one global flag, which clashes with admin announcements (Story 9). **Per-user pins need a join table (User-Post).**
3. Story 6 (photo upload) is must-have, but `Post` has no `imageUrl` (only `Comment` does). **Add `imageUrl` to Post.**
4. `Report` uses `targetType/targetId`, which cannot be a real foreign key in Prisma. **Use two nullable FKs: `postId` and `commentId`.**
5. **Keep it a board, not a social network: no feeds, follows or chat.**

### Corrected data model (the intended target)
- **User:** id, email, password, role (member or moderator), isBanned, optional ban reason
- **Post:** id, userId, title, content, category, isClosed, imageUrl, createdAt (no `isPinned`)
- **Comment:** id, postId, userId, content, imageUrl
- **Pin (join table):** id, userId, postId; each (userId, postId) unique; suggested limit 3 pins per user; deleted when the post is deleted
- **Report:** id, reporterId, reason, postId (nullable), commentId (nullable), status (pending / resolved / dismissed), createdAt; optionally resolvedBy and resolvedAt
- **Announcement (nice-to-have, separate table):** id, title, content, isPinned, createdAt

## 5. Scope decisions made in the conversation (in order)

1. **Chat cut completely** after the teacher's feedback.
2. **Communities (Reddit/Facebook-page style groups) were explored and then cut.** Names brainstormed: Phum (village), Krom (group), Sala (hall), Mit (friend). Cut because it adds follows/second feeds and a per-community moderator role; it is a post-MVP idea.
3. **Notification bell and messages icon:** added to wireframes early, then removed when scope was trimmed. Later the student asked how to add a bell back in Figma, and a Figma prompt was given. **Decision still open.** Recommendation: nice-to-have only, three events (comment on your post; moderator removes your content or bans you; your report is resolved), one `Notification` table (userId, message, isRead), no real-time.
4. **Admin Overview dashboard (charts and counts) cut.** The moderator area opens on Pending reports.
5. **Announcements kept as nice-to-have (Story 9),** built last. Announcement content should be about rules, safe exchanges, platform updates, not community events (a "clean-up this Sunday" sample was judged wrong). Recommended implementation: a separate `Announcement` table, not a flag on Post.
6. **Public profiles (late addition):** members can open each other's profiles and see each other's pinned posts. This makes pins **public**, not private bookmarks. Story 7 should be reworded to "...so I and other members can see them on my profile". Profiles stay **read-only**: no follow button, no profile comments, no activity feed.

## 6. Moderator role definition

- The role is named **Moderator** in the demo and the M1 code; the early wireframes and proposal say Admin/Admin-Mod. Pick one name and use it everywhere.
- A moderator watches the **whole app** (there are no communities). They can: see all reported content, delete any post or comment, ban and unban users **app-wide** (`isBanned`), and (nice-to-have) publish pinned announcements to everyone's home feed.
- A banned user can still browse but cannot post or comment.
- A moderator does not edit other people's posts, read private data, or decide who can join.
- Open decision: what a banned user's public profile shows (suggested: "This account is banned" with pins hidden; moderators still see everything).
- The frontend route guard only **hides** the page. In the real backend the **server must check the role on every moderator request** (this is also one of the handout's questions).

## 7. Wireframes

Visual style: **green (#1B6B44) and white**, gray borders, dashed gray image placeholders, grayscale otherwise. Desktop layout. Wireframes were first built as HTML boards in a design artifact, then recreated in **Figma** using a pasted prompt for the Figma agent. The student exported them as docs for the `docs/` folder.

Screens (current set):
1. **Home feed:** top bar (logo, pill search "Search posts by keyword", green "+ New post", profile avatar, optionally the notification bell); left **icon-only rail** for categories (All grid, Question "?", Help lifebuoy, Rent key, Sell tag, plus an admin shield for moderators); center post cards (140x105 image placeholder, category tag, Open/Closed badge on Help posts, title, preview, author, Comments / Pin / Report); a "scroll to load next 10 posts" strip; right column with a dashed **Announcement** box and **Community rules** box.
2. **Post detail:** back link, post with category tag, title, one image placeholder, text; owner sees Edit / Close request / Delete; others see Report; everyone sees Pin; comment box with "Attach 1 picture" and Post comment; comment list (delete own comments only).
3. **Create / edit post:** four category radios, title, content, one image upload, a dashed "Location tag (nice-to-have)", Cancel and Publish. Same form is reused for editing.
4. **My profile (needs updating for public profiles):** avatar, name, counts, Pinned posts, My posts. It should have two versions: own profile (pin/unpin, edit controls) and another member's read-only profile.
5. **Moderator: Pending reports:** left menu (Pending reports, Banned users, All content, Announcements), four stat cards (Pending, Resolved, Banned users, Total posts), Pending/Resolved/Dismissed tabs, reports table (Type, Reason, Preview, Reporter, When), right "Report detail" panel (Open in feed, Delete content, Ban author, Dismiss report).
6. **Moderator: Banned users:** only banned users, each row with an **Unban** button (an earlier version wrongly showed an "Active" row with a Ban button; it was fixed).
7. **Moderator: All content:** search, filters (Type, Category, Has reports), table of all posts and comments with View / Delete / Ban author, pagination (10 per page).
8. **Moderator: Announcements (nice-to-have):** editor (title, message, "Pin to top"), feed preview, list with Edit / Unpin / Delete.
9. **Loading state:** the home feed with gray skeleton cards plus a spinner strip "Loading next 10 posts...".

Figma notes: frames should be the Figma Desktop preset (**1440 x 1024**), content scaled to fit, overflow clipped at the bottom; a prompt was given for resizing, and one for adding a bell component to every top bar. Empty and error state screens were suggested but not made.

## 8. Interactive HTML demo (not the M1 deliverable)

A single self-contained HTML prototype (vanilla JS, data stored in the browser's localStorage) that looks like the wireframes. It lets you switch between **Dara (User)**, **Sophea (User)** and **Moderator**. It demonstrates: category icon filtering, search, loading 10 posts at a time, create/edit post with one picture, close/reopen Help posts, comments with a picture, pins, reports, moderator dashboard (pending reports with detail panel, banned users with Unban, all content with pagination, announcements), and status-code style messages (201, 400, 403, 413). It predates public profiles. It is a design demo only; the real M1 app is the Vue project below.

## 9. The M1 Vue project (what was built in week 5)

**Important:** this code was generated with an AI assistant and delivered as `jomnouy-m1.zip` because the student does not yet know Vue. `npm run check` and `npm run build` pass in the assistant's environment, but the app was **not opened in a browser** during generation. The student should run it, click through it, and be able to explain it.

### Stack (from package.json)
Vue 3.5, Vue Router 5, Pinia 4, TypeScript 6 (strict via `@vue/tsconfig`), Vite 8, vue-tsc, ESLint 10 + oxlint, Prettier, **json-server 0.17.4** (mock API), concurrently. Created with `npm create vue@latest` (TypeScript, Router, Pinia, ESLint, Prettier). Node 22 or newer.

### Scripts
- `npm install`
- `npm run api`: json-server on **http://localhost:3000** reading `db.json`, with `--delay 800` so loading states are visible
- `npm run dev`: the app on **http://localhost:5173**
- `npm start`: runs both
- `npm run check`: type-check + lint; `npm run lint`; `npm run type-check`; `npm run build`; `npm run format`

### Folder structure
```
db.json                      mock database
docs/                        wireframes go here (README placeholder)
README.md                    run steps, routes, validation, state explanation, M1 submission steps
src/
  main.ts, App.vue           App.vue = AppHeader + RouterView
  types.ts                   shared TypeScript types
  assets/main.css            green and white styles
  api/                       network layer: http.ts + one file per resource
    http.ts                  http<T>() helper + ApiError class (status 0 = cannot reach server)
    posts.ts                 postsApi: list(filters), listByIds(ids), get(id), create(data, user)
    comments.ts              commentsApi.listForPost(postId)
    reports.ts               reportsApi.list()
    users.ts                 usersApi.get(id)
    pins.ts                  pinsApi.listForUser(userId)
  stores/                    Pinia stores
    posts.ts, reports.ts, profile.ts, session.ts
  router/index.ts
  components/                AppHeader, PostCard, SkeletonCard, StatePanel, CategoryRail
  views/                     HomeView, PostDetailView, CreatePostView, ProfileView, ModerationView, NotFoundView
```

### Types (`src/types.ts`)
`Category` ('Question' | 'Help' | 'Rent' | 'Sell') and `CATEGORIES`; `Post` (id, userId, authorName, title, content, category, isClosed, createdAt); `NewPost` (title, content, category); `PostComment` (id, postId, userId, authorName, content); `User` (id, name); `Role` ('member' | 'moderator'); `Report` (id, reporterId, reason, postId|null, commentId|null, status, createdAt); `Pin` (id, userId, postId).

### Mock database (`db.json`)
Entity arrays that link by ids, shaped like the future API: **users** (3: Dara id 1, Sophea id 2, Moderator id 3), **posts** (12 sample posts across all categories, with `userId` and a denormalized `authorName`, one closed Help post), **comments** (4, with `postId`/`userId`), **reports** (3, each with exactly one of `postId` / `commentId` set), **pins** (3, linking users to posts). Posts have no `imageUrl` yet (image is a gray placeholder).

### Routes (`src/router/index.ts`, all lazy-loaded)
| Path | Name | Page |
|---|---|---|
| `/` | home | Home feed |
| `/posts/new` | post-new | Create post (declared before `:id`) |
| `/posts/:id(\d+)` | post-detail | Post detail (route parameter, digits only) |
| `/users/:id(\d+)` | profile | Anyone's profile and pinned posts |
| `/profile` | (redirect) | Redirects to my own `/users/:id` |
| `/moderation` | moderation | Reported content; `meta.moderatorOnly` |
| `/:pathMatch(.*)*` | not-found | 404 page (last) |

**Guard:** `router.beforeEach` redirects to `{ name: 'home', query: { denied: '1' } }` if `to.meta.moderatorOnly` and the session role is not moderator; the home page then shows a notice. The header "View as: Member / Moderator" select changes the role (a demo switch, no real login); switching to Member while on a moderator page sends you home.

### Stores (state that lives in Pinia)
- **posts:** `posts`, `currentPost`, `comments`, `loading`, `error`; actions `loadPosts(filters)`, `loadPost(id)` (post and its comments with `Promise.all`), `addPost(data, user)` (POST then unshift; errors propagate to the form). A private `run()` wrapper sets loading, clears the error, catches errors into `error`, and clears loading.
- **reports:** `reports`, `loading`, `error`, `loadReports()`.
- **profile:** `user`, `pinnedPosts`, `posts`, `loading`, `error`, `loadProfile(userId)` (loads user, pins and the user's posts in parallel, then the pinned posts by id). Separate from `posts` so a profile visit does not overwrite the home feed list.
- **session:** `currentUser` (fixed: Dara, id 1), `role`, `isModerator`.

### Pages and behavior
- **HomeView:** `CategoryRail` (icon buttons, `v-model`) picks the category; search text comes from the `?q=` query set by the header search form; `watch([category, query], load, { immediate: true })`. Shows four states: **loading** (3 `SkeletonCard`s), **error** (`StatePanel` with "Try again"), **empty** ("No posts found"), **success** (list of `PostCard`s). Right column has static Announcement and Community rules boxes. Shows the "denied" notice. Infinite scroll is **not** implemented yet.
- **PostDetailView:** reads `route.params.id`, `watch(id, load, { immediate: true })`; same loading/error states; shows post and read-only comment list (empty message when none). Edit/close/delete/pin/report/commenting are **not** implemented in M1.
- **CreatePostView:** form with category radios, title, content. **Client-side validation:** category required; title 3 to 100 trimmed characters; content required. Error messages appear under each field after the first submit; the Publish button is disabled while submitting ("Publishing..."); submit errors from the server show above the buttons; on success it navigates home. `title`, `content`, `category`, `submitted`, `submitting` are local component state. No image upload yet.
- **ProfileView:** loads `/users/:id` data; "This is your profile" vs "Member"; sections Pinned posts and Posts, each with empty states; loading and error states. Pin/unpin actions are not implemented in M1.
- **ModerationView:** table of reports (type, target link, reason, status) with the four states. No delete/ban/dismiss actions yet.
- **NotFoundView:** 404 page.
- **Components:** `AppHeader` (logo link, search form, role select, Moderation link for moderators, "+ New post", avatar to own profile), `PostCard` (author name links to profile; post title links to detail), `SkeletonCard`, `StatePanel` (title, message, optional action button; used for empty and error), `CategoryRail` (inline SVG icons).
- **No notification bell or chat** is in the code.

### Network layer behavior
`http()` throws `ApiError`: status 0 with a message "Cannot reach the server. Is "npm run api" running?" when `fetch` fails, or status N for non-OK responses. Stores catch these and show them in the error state. The handout says to copy `src/api/http.ts` from the practice repo; this project's own `http.ts` is a stand-in and can be replaced if the practice version differs.

### How to trigger each state (for demo and screenshots)
- Loading: reload (0.8 s API delay).
- Empty: search for `zzzz`.
- Error: stop the API and reload the page.
- Success: normal run.

## 10. M1 checklist status

| Item | Status |
|---|---|
| Wireframes in `docs/` | Wireframes exist (Figma exports); the student must put the exports into `docs/` |
| Vue 3 + TS + Vite, strict, ESLint passes | Done (lint, type-check, build pass) |
| At least 4 routes incl. detail with param | Done (post detail and profile both use params, plus 404 and guarded page) |
| Form with client-side validation | Done (Create post) |
| Pinia store + service layer + mock API | Done (stores, `src/api/`, json-server) |
| Loading, empty, error states | Done on Home, Post detail, Profile, Moderation |
| Explanation (store vs component) | Drafted in README (see section 12); student should rewrite in own words |
| Git branch, pull request, tag `m1` | Not confirmed; student to do (`git checkout -b m1-frontend`, PR, merge, `git tag m1`, `git push --follow-tags`) |
| Practice repo Parts A to E, `ANSWERS.md` | Not confirmed; student to do |

## 11. Not done yet / known limitations

- No real login or authentication; the user is fixed (Dara) and the role is a switch.
- No create/edit/delete for comments; no edit or delete or close for posts; no pin/unpin; no report submission; no moderator actions (delete, ban, dismiss, unban); no announcements; no image upload; no location tag; no blocklist; no pagination or infinite scroll (the json-server `_page` and `_limit` parameters can be used later); no search beyond the json-server `q` filter.
- No automated tests in this project (the practice repo has vitest tests).
- Acceptance criteria for the top 3 stories still need to be written (teacher feedback item 1).
- Proposal entity table still needs updating (Pin table, `Post.imageUrl`, Report FKs, Report status).
- Wireframes and the HTML demo predate public profiles; the profile screen needs own vs other versions.
- Open decisions: notification feature (yes or no), moderator vs admin naming, banned users' profile display, pin limit.

## 12. Draft answer: what state lives in the store vs a component, and why

**In Pinia stores:** data that comes from the server and is used by several pages (posts, the current post and its comments, reports, the viewed profile), the `loading` and `error` flags for those requests, and the session (current user and role). Several pages need it, and it should survive navigation between pages.

**Inside components:** temporary UI state that only one screen cares about: what the user has typed in the Create post form, whether the form is submitting, which category icon is selected on the home page, and the text in the header search box. It disappears when the screen closes and no other page needs it.

## 13. Where each field is validated

Create post form, in `CreatePostView.vue` (client-side only for now): category required; title 3 to 100 characters; content required. The server must validate again in weeks 6 and 7 (a client check can be bypassed, e.g. with curl).

## 14. Suggested next steps

1. Finish M1: put the wireframe exports in `docs/`, run the project and click through every route, run `npm run check` and `npm run build`, write own explanation, branch, pull request, merge, tag `m1`, push.
2. Do the practice repo parts and `ANSWERS.md` (separate from this project).
3. Update the proposal: acceptance criteria (2 to 3 testable conditions with status codes and validation for Stories 1, 4, 5), corrected entities, public pins wording.
4. Week 6: write the **API contract** (endpoints, status codes, validation) for posts, comments, pins, reports, bans, profiles, then build the NestJS backend (weeks 6 and 7) with a database and Prisma. Include moderator endpoints and **server-side role checks**; pins endpoints (public read, owner-only write, unique pair, max 3); post `imageUrl` and upload; report with `postId`/`commentId` FKs and status.
5. After the backend: connect the frontend to the real API; add comments, edit/close/delete posts, pin/unpin, reporting, moderator actions (delete, ban, unban, dismiss), the Banned users and All content screens; infinite scroll and search; announcements last.

## 15. Useful vocabulary and conventions

- **Moderator / Admin:** the same role; whole-app scope.
- **PostComment** is the type name (to avoid clashing with the DOM `Comment` type).
- Categories are exactly `Question`, `Help`, `Rent`, `Sell`.
- Status messages in the demo use HTTP-style codes to mirror the acceptance criteria (201 created, 200 ok, 400 bad request, 403 forbidden, 413 too large).
- Colors: green `#1B6B44`, white, grays for borders (`#999`) and placeholders (`#ddd`).
