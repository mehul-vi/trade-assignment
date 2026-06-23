<script setup>
defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPage: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  "first",
  "previous",
  "next",
  "last",
  "changeLimit",
]);
</script>

<template>
  <div
    class="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
  >
    <!-- left -->
    <p class="text-xs text-slate-600 dark:text-slate-300">
      Page {{ page }} of {{ totalPage }}
    </p>

    <!-- center -->
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        class="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        :disabled="page === 1"
        @click="emit('first')"
      >
        First
      </button>

      <button
        class="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg font-bold leading-none text-slate-800 transition hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        :disabled="page === 1"
        @click="emit('previous')"
      >
        ←
      </button>

      <button
        class="flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-800 px-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
      >
        {{ page }}
      </button>

      <button
        class="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg font-bold leading-none text-slate-800 transition hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        :disabled="page === totalPage"
        @click="emit('next')"
      >
        →
      </button>

      <button
        class="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        :disabled="page === totalPage"
        @click="emit('last')"
      >
        Last
      </button>
    </div>

    <!-- right -->
    <div class="flex items-center justify-end gap-2">
      <span class="text-xs font-medium text-slate-600 dark:text-slate-300">
        Per Page:
      </span>

      <select
        :value="limit"
        class="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        @change="emit('changeLimit', Number($event.target.value))"
      >
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>
  </div>
</template>