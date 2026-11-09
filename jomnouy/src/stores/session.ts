import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Role, User } from '@/types'

// Who is logged in and what they are allowed to see.
// Real login comes in a later milestone, so the user is fixed and the role is a demo switch.
export const useSessionStore = defineStore('session', () => {
  const currentUser = ref<User>({ id: 1, name: 'Dara' })
  const role = ref<Role>('member')
  const isModerator = computed(() => role.value === 'moderator')

  function setRole(newRole: Role) {
    role.value = newRole
  }

  return { currentUser, role, isModerator, setRole }
})
