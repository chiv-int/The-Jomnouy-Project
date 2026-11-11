import { ref } from 'vue'
import { defineStore } from 'pinia'
import { postsApi } from '@/api/posts'
import type { PostFilters } from '@/api/posts'
import { commentsApi } from '@/api/comments'
import type { NewPost, Post, PostComment, User } from '@/types'

// Data that comes from the server and is shared between pages lives here.
export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const comments = ref<PostComment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Wraps every request: loading on, clear old error, run, catch errors, loading off.
  async function run(task: () => Promise<void>) {
    loading.value = true
    error.value = null
    try {
      await task()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong'
    } finally {
      loading.value = false
    }
  }

  // Tracks the newest loadPosts request so older out-of-order responses are discarded.
  let latestPostsRequestId = 0

  function loadPosts(filters: PostFilters = {}) {
    const requestId = ++latestPostsRequestId
    return run(async () => {
      const list = await postsApi.list(filters)
      if (requestId === latestPostsRequestId) {
        posts.value = list
      }
    })
  }

  function loadPost(id: number) {
    return run(async () => {
      currentPost.value = null
      comments.value = []
      const [post, postComments] = await Promise.all([
        postsApi.get(id),
        commentsApi.listForPost(id),
      ])
      currentPost.value = post
      comments.value = postComments
    })
  }

  async function getCommentCount(postId: number): Promise<number> {
    const postComments = await commentsApi.listForPost(postId)
    return postComments.length
  }

  // Errors are not caught here: the form shows them next to the Publish button.
  async function addPost(data: NewPost, user: User) {
    const created = await postsApi.create(data, user)
    posts.value.unshift(created)
    return created
  }

  return {
    posts,
    currentPost,
    comments,
    loading,
    error,
    loadPosts,
    loadPost,
    getCommentCount,
    addPost,
  }
})
