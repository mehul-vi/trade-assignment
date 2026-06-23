import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(localStorage.getItem("theme") === "dark");
  const isMobileSidebarOpen = ref(false);

  function toggleTheme() {
    isDark.value = !isDark.value;

    localStorage.setItem(
      "theme",
      isDark.value ? "dark" : "light"
    );
  }

  function toggleMobileSidebar() {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen.value = false;
  }

  return {
    isDark,
    toggleTheme,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
  };
});