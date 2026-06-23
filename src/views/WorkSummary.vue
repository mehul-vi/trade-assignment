<script setup>
import {
  LayoutDashboard,
  Zap,
  ListTodo,
  Users,
  Handshake,
  CalendarDays,
  FileText,
  Award,
  Activity,
  Calendar,
  DollarSign,
  CircleDollarSign,
  TrendingUp,
  Clock3,
  UserRoundCheck,
  Play,
  ArrowDownToLine,
  WalletCards,
} from "lucide-vue-next";

const tabs = [
  {
    name: "Summary",
    icon: LayoutDashboard,
    active: true,
    path: "/workspace",
  },
  {
    name: "Focus Mode",
    icon: Zap,
  },
  {
    name: "Tasks",
    icon: ListTodo,
  },
  {
    name: "Leads",
    icon: Users,
  },
  {
    name: "Deals",
    icon: Handshake,
    path: "/workspace/deals",
  },
  {
    name: "Schedule",
    icon: CalendarDays,
  },
  {
    name: "Pending Documents",
    icon: FileText,
  },
  {
    name: "Performance",
    icon: Award,
  },
];

const metrics = [
  {
    title: "Deposits",
    value: "$482,299.11",
    subTitle: "Net: $72,984.19",
    transactions: "377 transactions",
    icon: DollarSign,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  {
    title: "Non-FTD",
    value: "$197,610.88",
    subTitle: "Non-FTD",
    transactions: "174 transactions",
    icon: CircleDollarSign,
    iconClass:
      "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    title: "FTD",
    value: "$284,688.23",
    subTitle: "FTD",
    transactions: "203 transactions",
    icon: TrendingUp,
    iconClass:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  },
  {
    title: "Pending deposits",
    value: "$0.00",
    subTitle: "Pending deposits",
    transactions: "0 transactions",
    icon: Clock3,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    title: "Withdrawals",
    value: "$124,626.69",
    subTitle: "Withdrawals",
    transactions: "246 transactions",
    icon: ArrowDownToLine,
    iconClass:
      "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
  {
    title: "Pending withdrawals",
    value: "$0.00",
    subTitle: "Pending withdrawals",
    transactions: "0 transactions",
    icon: WalletCards,
    iconClass:
      "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300",
  },
  {
    title: "Active traders",
    value: "267",
    subTitle: "Active traders",
    transactions: "Current active users",
    icon: UserRoundCheck,
    iconClass:
      "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300",
  },
];

const tasks = [
  {
    title: "Review new IB applications",
    text: "Check and approve pending partner applications.",
    time: "Today",
  },
  {
    title: "Follow up with new leads",
    text: "Contact leads added in the last 24 hours.",
    time: "Today",
  },
  {
    title: "Prepare weekly performance report",
    text: "Review deposits, withdrawals and trader activity.",
    time: "Tomorrow",
  },
];
</script>

<template>
  <section class="min-h-full bg-slate-50 p-4 md:p-6 dark:bg-slate-950">
    <!-- Tabs -->
    <div
      class="mb-5 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex min-w-max items-center gap-1">
        <template v-for="tab in tabs" :key="tab.name">
          <!-- Router tab -->
          <RouterLink
            v-if="tab.path"
            :to="tab.path"
            class="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition"
            :class="
              tab.active
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            "
          >
            <component :is="tab.icon" :size="14" />
            {{ tab.name }}
          </RouterLink>

          <!-- Normal tab -->
          <button
            v-else
            class="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <component :is="tab.icon" :size="14" />
            {{ tab.name }}
          </button>
        </template>
      </div>
    </div>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
      <!-- Left content -->
      <div>
        <!-- Welcome card -->
        <section
          class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p
            class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
          >
            Good Morning
          </p>

          <h1 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            Welcome Back, Mehul
          </h1>

          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Here’s your workspace overview. Stay productive!
          </p>
        </section>

        <!-- Metrics -->
        <section
          class="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-sm font-bold text-slate-900 dark:text-white">
              Metrics
            </h2>

            <button
              class="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              <Calendar :size="14" />
              May 19, 2026 – Jun 17, 2026
            </button>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article
              v-for="metric in metrics"
              :key="metric.title"
              class="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
            >
              <div class="flex items-center gap-2">
                <div class="rounded-md p-2" :class="metric.iconClass">
                  <component :is="metric.icon" :size="15" />
                </div>

                <p class="text-base font-bold text-slate-900 dark:text-white">
                  {{ metric.value }}
                </p>
              </div>

              <p
                class="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {{ metric.subTitle }}
              </p>

              <p class="mt-1 text-[11px] text-slate-400">
                {{ metric.transactions }}
              </p>
            </article>
          </div>
        </section>

        <!-- Tasks -->
        <section
          class="mt-5 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800"
          >
            <h2
              class="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"
            >
              <ListTodo :size="16" />
              Your Tasks
            </h2>

            <button
              class="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            >
              <Play :size="13" fill="currentColor" />
              Start Executing
            </button>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="task in tasks"
              :key="task.title"
              class="flex items-center justify-between gap-4 px-4 py-4"
            >
              <div class="flex items-start gap-3">
                <button
                  class="mt-0.5 h-4 w-4 rounded border border-slate-300 dark:border-slate-600"
                ></button>

                <div>
                  <p
                    class="text-sm font-medium text-slate-800 dark:text-slate-100"
                  >
                    {{ task.title }}
                  </p>

                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {{ task.text }}
                  </p>
                </div>
              </div>

              <span class="text-xs font-medium text-slate-400">
                {{ task.time }}
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Activity Feed -->
      <aside
        class="min-h-[250px] rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div
          class="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800"
        >
          <Activity :size="16" class="text-slate-500" />

          <h2 class="text-sm font-bold text-slate-900 dark:text-white">
            Activity Feed
          </h2>
        </div>

        <div class="flex min-h-[190px] items-center justify-center px-4">
          <p class="text-xs text-slate-400">No recent activity</p>
        </div>
      </aside>
    </div>
  </section>
</template>