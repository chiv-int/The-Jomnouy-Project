<!-- DRAFT: rewrite every answer in your own words, then delete this line. -->

# Milestones

Name: Chiv Inthera  
ID: p20240019  
Project: Jomnouy App  
Repository: https://github.com/chiv-int/The-Jomnouy-Project

---

## M0 Proposal (tag m0)

- **Proposal file:** `jomnouy/docs/ChivInthera_proposal.md` (also at `ChivInthera_proposal.md` in the root folder)
- **Git tag `m0`:** UNVERIFIED (only tag `m1` exists in the repository; no `m0` tag was found)

**Which story did you cut from the MVP, and why?**  
I cut four nice-to-have stories from my MVP while keeping Stories 1, 3, 4, 5, 6, and 7: the blocklist filter (Story 2), location tagging (Story 8), admin announcements (Story 9), and live chat with typing indicators (Story 10). I removed them so I could realistically finish the core features within the 14-week timeline. Live chat needs harder real-time tools, the blocklist makes database queries more complex, and admin announcements are bonus features that the basic community board does not need right away.

---

## M1 Frontend prototype (tag m1)

### What exists
- **Stack:** Vue 3, TypeScript (strict mode), Vite, Vue Router, Pinia, and `json-server` reading `jomnouy/db.json` as a mock API.
- **How to run it:** Inside `jomnouy/`, run `npm install`, then run `npm run api` in one terminal (`http://localhost:3000`) and `npm run dev` in another (`http://localhost:5173`), or run `npm start` for both together. Checks run with `npm run check` and `npm run build`.
- **Wireframes:** 14 screen wireframes stored in `jomnouy/docs/wireframes/`.
- **Component tree:** Documented in `jomnouy/docs/components.md`.

### Questions

**(a) What state lives in the store and what stays in a component, and why?**  
Data that comes from the server and is shared across multiple pages lives in my Pinia stores (`posts`, `profile`, `reports`, and `session`), such as the post list, current post, comments, user profile, reports, current user role, and `loading`/`error` flags. I keep this in stores so the data stays available when navigating between pages, such as adding a post in `CreatePostView` and seeing it on `HomeView`. Temporary UI state that only one screen cares about—such as the inputs in `CreatePostView`, the `submitting` flag, the header `search` text, or the mobile sidebar open flag—stays inside that component so it resets when the screen closes.

**(b) How do you show the four states (loading, error, empty, success) of one page?**  
On my home page (`jomnouy/src/views/HomeView.vue`), the `posts` store sets `loading` to `true` and clears `error` before calling the mock API, then stores the message in `error` if the request fails. In the template, I check those states in order using `v-if`, `v-else-if`, and `v-else`: first showing three `SkeletonCard` blocks while `store.loading` is true, then a `StatePanel` with a "Try again" button if `store.error` is set. When loading finishes without an error, I show an empty `StatePanel` ("No posts found") if `store.posts.length === 0`, or display the list of `PostCard` components when posts exist.

**(c) Where is each form field validated?**  
All three post fields (`category`, `title`, and `content`) are validated client-side in `jomnouy/src/views/CreatePostView.vue` using a `computed` `errors` object before calling `store.addPost`. `category` is required, `title` is trimmed and must be 3 to 100 characters long, and `content` is trimmed and cannot be empty. I show each field's error message underneath its input only after the first submit attempt (`submitted` becomes `true`), keep the user's input, disable the Publish button while `submitting` is `true`, and show any API error in `submitError` (server validation comes in M2).

