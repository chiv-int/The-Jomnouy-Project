<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '@/components/PostCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import StatePanel from '@/components/StatePanel.vue'
import { usePostsStore } from '@/stores/posts'
import { CATEGORIES } from '@/types'
import type { Category } from '@/types'

const store = usePostsStore()
const route = useRoute()

// Read the category from the route query instead of local state
const category = computed<Category | 'All'>(() => {
  const cat = route.query.category
  if (typeof cat === 'string' && (CATEGORIES as readonly string[]).includes(cat)) {
    return cat as Category
  }
  return 'All'
})
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

function load() {
  void store.loadPosts({ category: category.value, q: query.value })
}

// Load when the page opens, and again whenever the category or search changes.
watch([category, query], load, { immediate: true })
</script>

<template>
  <div class="feed-layout">
    <main class="feed-col stack">
      <p v-if="route.query.denied === '1'" class="notice" role="alert">
        You need to be a moderator to open that page.
      </p>

      <div class="feed-filter-bar">
        <p class="muted">
          Showing: <strong>{{ category }}</strong><template v-if="query"> · search “{{ query }}”</template>
        </p>
      </div>

      <!-- Loading state -->
      <template v-if="store.loading">
        <div class="post-feed">
          <SkeletonCard v-for="n in 3" :key="n" />
        </div>
      </template>

      <!-- Error state -->
      <StatePanel
        v-else-if="store.error"
        title="Something went wrong"
        :message="store.error"
        action-label="Try again"
        @action="load"
      />

      <!-- Empty state -->
      <StatePanel
        v-else-if="store.posts.length === 0"
        title="No posts found"
        message="Try another category or a different search."
      />

      <!-- Normal state -->
      <div v-else class="post-feed">
        <PostCard v-for="post in store.posts" :key="post.id" :post="post" />
      </div>
    </main>

    <aside class="right-col stack">
      <div class="box pad dashed announcement-box">
        <h2>Announcement</h2>
        <p class="muted">Reminder: meet in public places and never pay in advance.</p>
      </div>
      <div class="box pad rules-box">
        <h2>Community rules</h2>
        <p class="muted">Be kind. No commercial spam. Report bad behavior.</p>
      </div>
    </aside>
  </div>
</template>
