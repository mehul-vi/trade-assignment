<script setup>
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
import { useThemeStore } from "./stores/theme.js";

const themeStore = useThemeStore();
</script>

<template>
  <div :class="{ dark: themeStore.isDark }">
    <div
      class="flex flex-col h-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white"
    >
      <!-- Top Navbar: Covers complete width -->
      <Navbar />

      <!-- Bottom Layout Section: Sidebar & Page Content -->
      <div class="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <!-- Mobile Sidebar Backdrop Overlay -->
        <div
          v-if="themeStore.isMobileSidebarOpen"
          class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          @click="themeStore.closeMobileSidebar"
        ></div>

        <!-- Main Router View Area -->
        <main class="flex-1 overflow-y-auto">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>