<script setup>
import ThemeToggle from "../views/Toggle.vue";
import { Settings, Menu, TrendingUp } from "lucide-vue-next";
import { useThemeStore } from "../stores/theme.js";

const themeStore = useThemeStore();
</script>

<template>
  <header
    class="relative flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-900 z-30"
  >
    <!-- Left:  Toggle -->
    <div class="flex items-center gap-3">
      <!-- Mobile Hamburger Menu Button -->
      <button
        class="rounded-lg border border-slate-300 p-1.5 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition md:hidden active:scale-95"
        @click="themeStore.toggleMobileSidebar"
      >
        <Menu :size="18" />
      </button>

      <!-- Logo -->
      <div class="flex items-center gap-2">
        <TrendingUp class="h-6 w-6 text-indigo-600" />
        <span
          class="text-xl font-bold text-slate-900 dark:text-white tracking-tight"
        >
          Trade
        </span>
      </div>
    </div>

    <!-- Right-aligned theme controls -->
    <div class="flex items-center gap-2">
      <ThemeToggle />

      <button
        class="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition active:scale-95"
      >
        <Settings :size="20" />
      </button>
    </div>
  </header>
</template>
