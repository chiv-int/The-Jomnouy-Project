# Milestone Checklists

## M0 Proposal (week 3)

- [x] PROPOSAL.md follows the template in Appendix A
- [x] Problem stated in two sentences; target users and at least 2 roles named
- [x] 6–10 user stories, with acceptance criteria for the 3 most important
- [x] MVP scope split into must-have and nice-to-have
- [x] Entity list with main attributes and relations; at least 3 entities
- [x] Chosen stretch feature named

### Explain: Which story did you cut from the MVP, and why?
I moved Story 2 (blocklist filters for users and topics), Story 8 (location tagging), Story 9 (admin announcement posts), and Story 10 (live chat and typing indicator) into nice-to-have.

**Why:** The main goal of the MVP is to get the core community board working so members can create and browse posts across Question, Help, Rent, and Sell, close or reopen help requests, manage their own content, pin favorite posts, and let moderators review reports. Features like live chat need harder real-time tools, blocklists make database queries more complex, and location tags or admin announcements are bonus features not strictly needed for the core board in a 14-week timeline.

---

## M1 Frontend prototype (week 5)

- [x] Wireframes (photo or tool) of the main screens in docs/
- [x] Vue 3 + TypeScript app created with Vite; strict mode on; ESLint passes
- [x] At least 4 routes, including a detail page with a route parameter
- [x] At least one form with client-side validation
- [x] A Pinia store and a service layer calling a mock API (json-server or local JSON)
- [x] Loading, empty and error states visible

### Explain: What state lives in the store and what stays inside a component? Why?

**In the Pinia store:**
- **Posts, comments, profile, and reports data plus `loading`/`error` flags (`usePostsStore`, `useProfileStore`, `useReportsStore`):** Multiple pages share this server data (for example, `CreatePostView` adds a post that `HomeView` displays, and `PostDetailView` loads `currentPost` and `comments`), so keeping it in stores preserves shared app state across page navigation.
- **Current user and role (`useSessionStore` — `currentUser`, `role`, `isModerator`):** The router guard in `src/router/index.ts` checks `useSessionStore().isModerator` before letting users open `/moderation`, and components like `AppHeader`, `SideBar`, `PostCard`, `CreatePostView`, and `ProfileView` all read the session. Since router guards run outside components, this must live in the store.

**Inside the component:**
- **Form inputs, validation flags, and submission errors (`CreatePostView` — `category`, `title`, `content`, `submitted`, `submitting`, `submitError`, plus `PostCard` edit/menu state):** What the user types into the form or edit box is temporary UI state. Once they submit the form or leave the page, that data is not needed anywhere else and can reset.
- **Search box text and mobile sidebar drawer toggle (`AppHeader` `search`, `App.vue` `isMobileNavOpen`):** What is currently typed in the search box and whether the mobile drawer is open only affect the local UI, while actual filtering is driven by the URL route query (`?category=` and `?q=`).
