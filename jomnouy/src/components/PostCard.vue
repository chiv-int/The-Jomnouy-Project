<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useSessionStore } from '@/stores/session'
import type { Post } from '@/types'

const props = defineProps<{ post: Post }>()

const session = useSessionStore()
const postsStore = usePostsStore()
const commentCount = ref<number>(0)
const isEditing = ref(false)
const isConfirmingDelete = ref(false)
const isDeleted = ref(false)
const isMenuOpen = ref(false)

const currentTitle = ref(props.post.title)
const currentContent = ref(props.post.content)
const localTitle = ref(props.post.title)
const localContent = ref(props.post.content)

watch(
  () => props.post.title,
  (val) => {
    currentTitle.value = val
  },
)
watch(
  () => props.post.content,
  (val) => {
    currentContent.value = val
  },
)

const isOwner = computed(() => session.currentUser.id === props.post.userId)

onMounted(async () => {
  try {
    commentCount.value = await postsStore.getCommentCount(props.post.id)
  } catch {
    commentCount.value = 0
  }
  window.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  window.removeEventListener('click', closeMenu)
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleEditClick() {
  isMenuOpen.value = false
  startEdit()
}

function handleDeleteClick() {
  isMenuOpen.value = false
  promptDelete()
}

function startEdit() {
  localTitle.value = currentTitle.value
  localContent.value = currentContent.value
  isEditing.value = true
  isConfirmingDelete.value = false
}

function saveEdit() {
  const t = localTitle.value.trim()
  const c = localContent.value.trim()
  if (!t || !c) return
  currentTitle.value = t
  currentContent.value = c
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function promptDelete() {
  isConfirmingDelete.value = true
  isEditing.value = false
}

function cancelDelete() {
  isConfirmingDelete.value = false
}

function confirmDelete() {
  isDeleted.value = true
  isConfirmingDelete.value = false
}
</script>

<template>
  <!-- Deleted post notice -->
  <article v-if="isDeleted" class="feed-post-card post-deleted-card">
    <div class="card-body">
      <p class="muted post-deleted-text">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          />
        </svg>
        Your post has been deleted.
      </p>
    </div>
  </article>

  <!-- Inline Editing Mode -->
  <article v-else-if="isEditing" class="feed-post-card post-editing-card">
    <div class="card-body stack">
      <div class="row post-meta">
        <span class="tag">{{ post.category }}</span>
        <span class="muted font-semibold">Editing your post</span>
      </div>

      <label class="edit-field">
        <span class="edit-label-text">Title</span>
        <input
          v-model="localTitle"
          type="text"
          class="edit-input"
          maxlength="120"
          placeholder="Title"
        />
      </label>

      <label class="edit-field">
        <span class="edit-label-text">Content</span>
        <textarea
          v-model="localContent"
          rows="3"
          class="edit-textarea"
          placeholder="Content"
        ></textarea>
      </label>

      <div class="row end edit-actions">
        <button type="button" class="btn btn-sm btn-subtle" @click="cancelEdit">
          Cancel
        </button>
        <button type="button" class="btn btn-sm btn-primary" @click="saveEdit">
          Save changes
        </button>
      </div>
    </div>
  </article>

  <!-- Standard Post Card -->
  <article
    v-else
    class="feed-post-card"
    :class="{ 'post-no-image': post.category === 'Question' }"
  >
    <div v-if="post.category !== 'Question'" class="thumb ph">Image</div>
    <div class="card-body">
      <div class="row post-meta">
        <span class="tag">{{ post.category }}</span>
        <span
          v-if="post.category === 'Help'"
          class="tag"
          :class="{ fill: !post.isClosed }"
        >
          {{ post.isClosed ? 'Closed' : 'Open' }}
        </span>
        <span class="muted post-author">
          Posted by
          <RouterLink :to="{ name: 'profile', params: { id: post.userId } }">
            {{ post.authorName }}
          </RouterLink>
        </span>
      </div>

      <h3 class="post-title" :class="{ 'question-title': post.category === 'Question' }">
        <RouterLink :to="{ name: 'post-detail', params: { id: post.id } }">
          {{ currentTitle }}
        </RouterLink>
      </h3>

      <p class="muted clamp post-preview">{{ currentContent }}</p>

      <div class="post-footer">
        <RouterLink
          :to="{ name: 'post-detail', params: { id: post.id } }"
          class="post-action-btn"
          aria-label="View comments"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            />
          </svg>
          <span>{{ commentCount }} {{ commentCount === 1 ? 'comment' : 'comments' }}</span>
        </RouterLink>

        <!-- Option to edit and delete for one's own post -->
        <template v-if="isOwner">
          <span class="footer-divider" aria-hidden="true">·</span>

          <!-- Delete confirmation box -->
          <div v-if="isConfirmingDelete" class="delete-confirm-box">
            <span class="delete-prompt-text">Delete post?</span>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              @click.stop="confirmDelete"
            >
              Yes, delete
            </button>
            <button
              type="button"
              class="btn btn-sm btn-subtle"
              @click.stop="cancelDelete"
            >
              Cancel
            </button>
          </div>

          <!-- Three vertical dots menu button -->
          <div v-else class="owner-menu-container">
            <button
              type="button"
              class="btn-three-dots"
              aria-label="Post options"
              :aria-expanded="isMenuOpen"
              title="More options"
              @click.stop="toggleMenu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="12" cy="5" r="2.2" />
                <circle cx="12" cy="12" r="2.2" />
                <circle cx="12" cy="19" r="2.2" />
              </svg>
            </button>

            <!-- Expanded translucent dropdown -->
            <div v-if="isMenuOpen" class="owner-dropdown-menu" role="menu">
              <button
                type="button"
                class="owner-menu-item btn-menu-edit"
                role="menuitem"
                @click.stop="handleEditClick"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
                <span>Edit</span>
              </button>

              <button
                type="button"
                class="owner-menu-item btn-menu-delete"
                role="menuitem"
                @click.stop="handleDeleteClick"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </article>
</template>
