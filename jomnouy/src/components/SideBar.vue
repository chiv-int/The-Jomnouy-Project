<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import { CATEGORIES } from '@/types'
import type { Category } from '@/types'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const session = useSessionStore()

interface NavItem {
  id: string
  label: string
  category?: Category | 'All'
  to: RouteLocationRaw
  icon: string
  isModeratorOnly?: boolean
}

// 24x24 line icons matching CategoryRail and design system
const ICONS = {
  All: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  Question:
    '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17v.01"/>',
  Help: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
  Rent: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
  Sell: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
  Moderation:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
}

const currentQueryQ = computed(() =>
  typeof route.query.q === 'string' && route.query.q ? route.query.q : undefined,
)

const navItems = computed<NavItem[]>(() => {
  const baseItems: NavItem[] = [
    {
      id: 'all',
      label: 'Home (All)',
      category: 'All',
      to: {
        name: 'home',
        query: currentQueryQ.value ? { q: currentQueryQ.value } : undefined,
      },
      icon: ICONS.All,
    },
    ...CATEGORIES.map((cat) => ({
      id: cat.toLowerCase(),
      label: cat,
      category: cat,
      to: {
        name: 'home',
        query: currentQueryQ.value
          ? { category: cat, q: currentQueryQ.value }
          : { category: cat },
      },
      icon: ICONS[cat],
    })),
  ]

  if (session.isModerator) {
    baseItems.push({
      id: 'moderation',
      label: 'Moderation',
      to: { name: 'moderation' },
      icon: ICONS.Moderation,
      isModeratorOnly: true,
    })
  }

  return baseItems
})

function isItemActive(item: NavItem): boolean {
  if (item.id === 'moderation') {
    return route.name === 'moderation'
  }
  if (route.name !== 'home') {
    return false
  }
  const routeCategory = route.query.category
  if (!routeCategory || routeCategory === 'All') {
    return item.category === 'All'
  }
  return item.category === routeCategory
}
</script>

<template>
  <div>
    <!-- Mobile drawer backdrop -->
    <div
      v-if="isOpen"
      class="sidebar-backdrop"
      aria-hidden="true"
      @click="emit('close')"
    ></div>

    <!-- Sidebar container -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-open': isOpen }"
      aria-label="Sidebar navigation"
    >
      <div class="sidebar-header-mobile">
        <span class="sidebar-mobile-title">Navigation</span>
        <button
          type="button"
          class="sidebar-close-btn"
          aria-label="Close sidebar"
          @click="emit('close')"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-title">Feeds & Categories</div>
        <ul class="sidebar-list">
          <li v-for="item in navItems" :key="item.id">
            <RouterLink
              :to="item.to"
              class="sidebar-item"
              :class="{ 'is-active': isItemActive(item) }"
              :aria-current="isItemActive(item) ? 'page' : undefined"
              :title="item.label"
              @click="emit('close')"
            >
              <span class="sidebar-icon-wrap">
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
                  v-html="item.icon"
                ></svg>
              </span>
              <span class="sidebar-label">{{ item.label }}</span>
              <span class="sidebar-tooltip" aria-hidden="true">{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>
