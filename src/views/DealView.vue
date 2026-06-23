<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { VueDraggable } from "vue-draggable-plus";

const startDeals = ref([]);
const negotiationDeals = ref([]);

const title = ref("");
const value = ref("");

async function getDeals() {
  try {
    const response = await api.get("/deals");

    startDeals.value = response.data.filter(
      (deal) => deal.stage === "starts_conversation"
    );

    negotiationDeals.value = response.data.filter(
      (deal) => deal.stage === "negotiation"
    );
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getDeals();
});

function getNewId() {
  const allDeals = [...startDeals.value, ...negotiationDeals.value];
  if (allDeals.length === 0) {
    return 1;
  }

  const ids = allDeals
    .map((item) => Number(item.id))
    .filter((id) => !isNaN(id));

  if (ids.length === 0) {
    return 1;
  }

  return Math.max(...ids) + 1;
}

async function createDeal() {
  if (!title.value.trim() || !value.value) return;

  const newDeal = {
    id: String(getNewId()),
    title: title.value.trim(),
    value: Number(value.value),
    stage: "starts_conversation",
  };

  try {
    const response = await api.post("/deals", newDeal);

    startDeals.value.push(response.data);

    title.value = "";
    value.value = "";
  } catch (error) {
    console.log(error);
  }
}

async function updateStage(event, stage) {
  const deal = event.added?.element;

  if (!deal) return;

  try {
    await api.patch(`/deals/${deal.id}`, {
      stage,
    });
  } catch (error) {
    console.log(error);
    getDeals();
  }
}
</script>

<template>
  <section class="min-h-full bg-slate-50 p-5 md:p-8 dark:bg-slate-950">
    <div
      class="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <p class="text-sm font-semibold text-indigo-600">WORKSPACE</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
          Deals Pipeline
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create and manage your deals.
        </p>
      </div>

      <div
        class="flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row lg:w-auto dark:border-slate-800 dark:bg-slate-900"
      >
        <input
          v-model="title"
          type="text"
          placeholder="Client name"
          class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 sm:w-44 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <input
          v-model="value"
          type="number"
          placeholder="Value"
          class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 sm:w-28 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <button
          class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
          @click="createDeal"
        >
          + Create Deal
        </button>
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <!-- Starts Conversation -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-slate-900 dark:text-white">
              Starts Conversation
            </h2>
            <p class="text-sm text-slate-500">New leads to contact</p>
          </div>

          <span
            class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
          >
            {{ startDeals.length }}
          </span>
        </div>

        <VueDraggable
          v-model="startDeals"
          group="deals"
          item-key="id"
          class="min-h-64 space-y-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
          @change="updateStage($event, 'starts_conversation')"
        >
          <div
            v-for="deal in startDeals"
            :key="deal.id"
            class="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">
                  {{ deal.title }}
                </p>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  New opportunity
                </p>
              </div>

              <span
                class="rounded-lg bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
              >
                ${{ deal.value }}
              </span>
            </div>
          </div>

          <p
            v-if="startDeals.length === 0"
            class="py-10 text-center text-sm text-slate-400"
          >
            Drop deals here
          </p>
        </VueDraggable>
      </div>

      <!-- Negotiation -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-slate-900 dark:text-white">
              Negotiation
            </h2>
            <p class="text-sm text-slate-500">Deals in progress</p>
          </div>

          <span
            class="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
          >
            {{ negotiationDeals.length }}
          </span>
        </div>

        <VueDraggable
          v-model="negotiationDeals"
          group="deals"
          item-key="id"
          class="min-h-64 space-y-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
          @change="updateStage($event, 'negotiation')"
        >
          <div
            v-for="deal in negotiationDeals"
            :key="deal.id"
            class="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">
                  {{ deal.title }}
                </p>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Negotiation in progress
                </p>
              </div>

              <span
                class="rounded-lg bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
              >
                ${{ deal.value }}
              </span>
            </div>
          </div>

          <p
            v-if="negotiationDeals.length === 0"
            class="py-10 text-center text-sm text-slate-400"
          >
            Drop deals here
          </p>
        </VueDraggable>
      </div>
    </div>
  </section>
</template>