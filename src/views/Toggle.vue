<script setup>
import { useThemeStore } from "../stores/theme";
import { Moon, Sun } from "lucide-vue-next";

const themeStore = useThemeStore();
</script>

<template>
  <button
    class="rounded-lg border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
    @click="themeStore.toggleTheme"
  >
    <Sun v-if="themeStore.isDark" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>