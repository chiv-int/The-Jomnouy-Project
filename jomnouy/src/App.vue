<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import SideBar from '@/components/SideBar.vue'

const isMobileNavOpen = ref(false)

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

function closeMobileNav() {
  isMobileNavOpen.value = false
}
</script>

<template>
  <div class="app-layout">
    <AppHeader @toggle-menu="toggleMobileNav" />
    <SideBar :is-open="isMobileNavOpen" @close="closeMobileNav" />
    <div class="app-main">
      <RouterView />
    </div>
  </div>
</template>
