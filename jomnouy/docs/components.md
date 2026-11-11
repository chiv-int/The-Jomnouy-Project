# Component tree

Rule used everywhere: **props go down, events go up**. Shared server data lives in Pinia stores; temporary screen state lives in the component.

## Stores (shared state)

| Store | Owns |
|---|---|
| `session` | current user, role (`member` / `moderator`), `setRole` action |
| `posts` | post list, current post, comments, loading and error flags, `loadPosts` with race condition guard, `loadPost`, `getCommentCount`, `addPost` |
| `profile` | viewed profile and their pinned posts |
| `reports` | reported content, loading and error flags |

## App shell

```
App.vue
├── AppHeader
├── SideBar
└── <RouterView>  (one page below)
```

| Component | Props | Events | State |
|---|---|---|---|
| `AppHeader` | none | `toggleMenu` (emitted on hamburger click) | reads `session` store (`currentUser`, `role`) via `storeToRefs`, updates role via `setRole` action; local search text |
| `SideBar` | `isOpen: boolean` | `close` | reads route query (`?category=...`), reads `session.isModerator` |

## Home feed (`/`)

```
HomeView
├── StatePanel          (error / empty states)
├── SkeletonCard        (loading state)
└── PostCard (v-for)
```

| Component | Props | Events | State owner |
|---|---|---|---|
| `HomeView` | none | none | `posts`, `loading`, `error` in `posts` store. Reads active category and search filter directly from route query (`$route.query`). |
| `PostCard` | `post: Post` | none | Local state for post editing (`isEditing`, `currentTitle`, `currentContent`), delete confirmation dialog (`isConfirmingDelete`, `isDeleted`), menu dropdown (`isMenuOpen`), and comment count (`commentCount` loaded via `postsStore.getCommentCount`). |
| `SkeletonCard` | none | none | none |
| `StatePanel` | `title: string`, `message?: string`, `actionLabel?: string` | `action` (button clicked, e.g. "Try again"). The button only shows when `actionLabel` is set. | none |

> *Note:* The early prototype component `CategoryRail.vue` was retired and replaced by `SideBar.vue` to support the full-screen Reddit-style left navigation rail across all views.

## Post detail (`/posts/:id`)

| Component | Props | Events | State owner |
|---|---|---|---|
| `PostDetailView` | none (reads the `id` route param with `useRoute()`) | none | current post and comments in `posts` store |

## Create post (`/posts/new`)

| Component | Props | Events | State owner |
|---|---|---|---|
| `CreatePostView` | none | none | form fields, selected category and `submitting` are local. Calls `posts` store to save and reads `session` for the author. Validation: category required, title 3 to 100, content required. |

## Profile (`/users/:id`, `/profile`)

| Component | Props | Events | State owner |
|---|---|---|---|
| `ProfileView` | none (reads the `id` route param with `useRoute()`) | none | profile and pins in `profile` store. Reads `session` to know whose profile is "mine". |

## Moderation (`/moderation`, moderators only)

| Component | Props | Events | State owner |
|---|---|---|---|
| `ModerationView` | none | none | reports in `reports` store. Route guard checks `session` role. |

## Why state lives where it does

- **In stores:** data from the server that several pages use, the loading and error flags, and the session. It must survive moving between pages.
- **In components:** what is typed in the form, post-card editing buffers, the search text, drawer open/closed status, and `submitting` flag. It disappears when the screen closes or resets.
