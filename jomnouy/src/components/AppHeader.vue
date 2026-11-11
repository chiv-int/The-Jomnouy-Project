<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/session'
import type { Role } from '@/types'

const emit = defineEmits<{
  toggleMenu: []
}>()

const route = useRoute()
const router = useRouter()
const session = useSessionStore()
const { currentUser, role } = storeToRefs(session)

// Local state: only the header cares about what is typed in the search box.
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')

watch(
  () => route.query.q,
  (q) => {
    search.value = typeof q === 'string' ? q : ''
  },
)

// If the role is switched to member while on a moderator page, leave that page.
watch(
  role,
  (newRole) => {
    if (newRole !== 'moderator' && route.meta.moderatorOnly) void router.push({ name: 'home' })
  },
)

function onRoleChange(event: Event) {
  const select = event.target as HTMLSelectElement
  session.setRole(select.value as Role)
}

function submitSearch() {
  const q = search.value.trim()
  void router.push({ name: 'home', query: q ? { q } : {} })
}
</script>

<template>
  <header class="nav">
    <div class="nav-left">
      <button
        type="button"
        class="hamburger-btn"
        aria-label="Open navigation menu"
        @click="emit('toggleMenu')"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <RouterLink :to="{ name: 'home' }" class="brand">
        <svg
          class="brand-icon"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span class="brand-text">Jomnouy</span>
      </RouterLink>
    </div>

    <div class="nav-center">
      <form class="search" role="search" @submit.prevent="submitSearch">
        <label class="sr-only" for="search">Search posts</label>
        <div class="search-wrap">
          <svg
            class="search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search"
            v-model="search"
            type="search"
            placeholder="Search posts by keyword"
          />
        </div>
      </form>
    </div>

    <div class="nav-right">
      <RouterLink :to="{ name: 'post-new' }" class="btn btn-primary btn-new-post">
        + New post
      </RouterLink>

      <div class="role-selector">
        <label for="role-select" class="role-label">View as</label>
        <select
          id="role-select"
          :value="role"
          class="role-select"
          aria-label="Switch user role"
          @change="onRoleChange"
        >
          <option value="member">Member</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>

      <RouterLink
        :to="{ name: 'profile', params: { id: currentUser.id } }"
        class="avatar"
        aria-label="My profile"
        :title="currentUser.name"
      >
        {{ currentUser.name.charAt(0) }}
      </RouterLink>
    </div>
  </header>
</template>
