<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import {
  LayoutDashboard,
  Handshake,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-vue-next";
import { useThemeStore } from "../stores/theme.js";

const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();

const isCollapsed = ref(false);
const isPartnersOpen = ref(true);

const isWorkspaceActive = computed(() => {
  return route.path.startsWith("/workspace");
});

const isPartnersActive = computed(() => {
  return route.path.startsWith("/partners");
});

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function togglePartners() {
  if (isCollapsed.value) {
    router.push("/partners/ibs");
  } else {
    isPartnersOpen.value = !isPartnersOpen.value;
  }
}
</script>

<template>
  <aside
    :class="[
      'h-screen overflow-y-auto border-r border-slate-200 bg-white p-3 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between',
      'fixed inset-y-0 left-0 z-50 w-64 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:z-0 md:translate-x-0',
      themeStore.isMobileSidebarOpen ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full w-64 md:w-auto',
      isCollapsed ? 'md:w-20' : 'md:w-64',
    ]"
  >
    <!-- Top Section: Logo & Navigation Links -->
    <div class="flex-1">
      <!-- Mobile Drawer Header -->
      <div class="mb-6 flex items-center justify-between px-2 md:hidden">
        <div class="flex items-center gap-2">
          <TrendingUp class="h-5 w-5 text-indigo-600" />
          <span class="text-lg font-bold text-slate-900 dark:text-white">
            Trade
          </span>
        </div>

        <button
          class="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="themeStore.closeMobileSidebar"
        >
          <ChevronLeft :size="20" />
        </button>
      </div>

      <!-- Nav Links -->
      <div class="space-y-1">
        <RouterLink
          to="/workspace/summary"
          :class="[
            'mb-2 flex items-center gap-3 rounded-lg px-3 py-3 transition-colors',
            isWorkspaceActive
              ? 'bg-slate-900 text-white hover:bg-slate-900 dark:bg-indigo-600'
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
          ]"
          @click="themeStore.closeMobileSidebar"
        >
          <LayoutDashboard :size="20" />
          <span v-if="!isCollapsed">My Workspace</span>
        </RouterLink>

        <button
          :class="[
            'flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-colors',
            isPartnersActive
              ? (isCollapsed
                  ? 'bg-slate-900 text-white hover:bg-slate-900 dark:bg-indigo-600'
                  : 'bg-indigo-50/50 text-indigo-600 font-semibold dark:bg-indigo-500/10 dark:text-indigo-400')
              : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
          ]"
          @click="togglePartners"
        >
          <Handshake :size="20" />

          <span v-if="!isCollapsed" class="flex-1 text-left">
            Partners
          </span>

          <ChevronDown
            v-if="!isCollapsed"
            :size="18"
            :class="{ 'rotate-180': isPartnersOpen }"
            class="transition-transform"
          />
        </button>

        <div v-if="isPartnersOpen && !isCollapsed" class="ml-6 mt-1">
          <RouterLink
            to="/partners/ibs"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            active-class="bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
            @click="themeStore.closeMobileSidebar"
          >
            <Users :size="17" />
            IBs
          </RouterLink>
        </div>
      </div>
    </div>

    <!--  Collapse Control -->
    <div
      class="border-t border-slate-100 pt-3 dark:border-slate-800 hidden md:block"
    >
      <button
        class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition"
        @click="toggleSidebar"
      >
        <component
          :is="isCollapsed ? ChevronRight : ChevronLeft"
          :size="20"
        />
        <span v-if="!isCollapsed" class="text-sm font-medium">
          Collapse
        </span>
      </button>
    </div>
  </aside>
</template>