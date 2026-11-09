<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useSessionStore } from '@/stores/session'
import { CATEGORIES } from '@/types'
import type { Category } from '@/types'

const router = useRouter()
const store = usePostsStore()
const session = useSessionStore()

// Local state: what the user is typing only matters while this form is open.
const category = ref<Category | ''>('')
const title = ref('')
const content = ref('')
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')

// Client-side validation: one message per field, empty string means "valid".
const errors = computed(() => {
  const t = title.value.trim()
  return {
    category: category.value ? '' : 'Choose a category.',
    title:
      t.length < 3
        ? 'Title must be at least 3 characters.'
        : t.length > 100
          ? 'Title must be 100 characters or fewer.'
          : '',
    content: content.value.trim() ? '' : 'Content is required.',
  }
})

const isValid = computed(
  () => !errors.value.category && !errors.value.title && !errors.value.content,
)

async function submit() {
  submitted.value = true
  submitError.value = ''
  const chosen = category.value
  if (!isValid.value || chosen === '') return

  submitting.value = true
  try {
    await store.addPost(
      { category: chosen, title: title.value.trim(), content: content.value.trim() },
      session.currentUser,
    )
    await router.push({ name: 'home' })
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Could not publish the post.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page narrow stack">
    <h1>New post</h1>

    <form class="box pad stack" novalidate @submit.prevent="submit">
      <fieldset class="row">
        <legend>Category</legend>
        <label v-for="option in CATEGORIES" :key="option" class="chip">
          <input v-model="category" type="radio" name="category" :value="option" />
          {{ option }}
        </label>
      </fieldset>
      <p v-if="submitted && errors.category" class="error">{{ errors.category }}</p>

      <label>
        Title
        <input v-model="title" type="text" maxlength="120" placeholder="Short, clear title" />
      </label>
      <p v-if="submitted && errors.title" class="error">{{ errors.title }}</p>

      <label>
        Content
        <textarea
          v-model="content"
          rows="6"
          placeholder="Describe the item or your question"
        ></textarea>
      </label>
      <p v-if="submitted && errors.content" class="error">{{ errors.content }}</p>

      <!-- Option to input image for the post -->
      <div class="image-upload-section">
        <label for="post-image-input" class="image-upload-header">
          <span class="label-title">Attach image (optional)</span>
          <span class="muted">Add a photo to showcase your item or illustrate your post</span>
        </label>
        <div class="file-dropzone">
          <input
            id="post-image-input"
            type="file"
            accept="image/*"
            class="file-input-native"
          />
          <div class="file-dropzone-ui">
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span class="dropzone-text">Click to choose image or drag and drop</span>
            <span class="dropzone-sub muted">PNG, JPG, WebP supported</span>
          </div>
        </div>
      </div>

      <p v-if="submitError" class="error" role="alert">{{ submitError }}</p>

      <div class="row end">
        <RouterLink :to="{ name: 'home' }" class="btn">Cancel</RouterLink>
        <button class="btn btn-primary" type="submit" :disabled="submitting">
          {{ submitting ? 'Publishing…' : 'Publish' }}
        </button>
      </div>
    </form>
  </div>
</template>
