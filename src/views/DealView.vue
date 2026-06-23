<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { VueDraggable } from "vue-draggable-plus";

const startDeals = ref([]);
const negotiationDeals = ref([]);

const title = ref("");
const value = ref("");

const isLoading = ref(false);
const isCreating = ref(false);
const isSaving = ref(false);
const errorMessage = ref("");

async function getDeals() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/deals");
    const deals = response.data || [];

    startDeals.value = deals.filter(
      (deal) => deal.stage === "starts_conversation"
    );

    negotiationDeals.value = deals.filter(
      (deal) => deal.stage === "negotiation"
    );
  } catch (error) {
    console.error("GET deals error:", error);
    errorMessage.value = "Deals load nahi ho paaye. Server check karo.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(getDeals);

function getNewId() {
  const allDeals = [...startDeals.value, ...negotiationDeals.value];

  const ids = allDeals
    .map((deal) => Number(deal.id))
    .filter((id) => !Number.isNaN(id));

  return ids.length ? String(Math.max(...ids) + 1) : "1";
}

async function createDeal() {
  if (!title.value.trim() || !value.value) {
    errorMessage.value = "Client name aur value dono fill karo.";
    return;
  }

  if (Number(value.value) <= 0) {
    errorMessage.value = "Deal value 0 se greater honi chahiye.";
    return;
  }

  isCreating.value = true;
  errorMessage.value = "";

  try {
    const response = await api.post("/deals", {
      id: getNewId(),
      title: title.value.trim(),
      value: Number(value.value),
      stage: "starts_conversation",
    });

    startDeals.value.push(response.data);

    title.value = "";
    value.value = "";
  } catch (error) {
    console.error("Create deal error:", error);
    errorMessage.value = "Deal create nahi hua.";
  } finally {
    isCreating.value = false;
  }
}

/*
  Drag complete hone ke baad:
  - startDeals ke sab deals ko starts_conversation save karega
  - negotiationDeals ke sab deals ko negotiation save karega
*/
async function syncDealStages() {
  if (isSaving.value) return;

  isSaving.value = true;
  errorMessage.value = "";

  try {
    const updates = [
      ...startDeals.value.map((deal) => ({
        id: deal.id,
        stage: "starts_conversation",
      })),
      ...negotiationDeals.value.map((deal) => ({
        id: deal.id,
        stage: "negotiation",
      })),
    ];

    await Promise.all(
      updates.map((deal) =>
        api.patch(`/deals/${deal.id}`, {
          stage: deal.stage,
        })
      )
    );

    console.log("All deal stages saved successfully");
  } catch (error) {
    console.error("Stage save error:", error);
    errorMessage.value = "Stage save nahi hua. Server check karo.";

    // Agar backend me save fail hua, database wali state wapas load hogi
    await getDeals();
  } finally {
    isSaving.value = false;
  }
}

function formatValue(amount) {
  return Number(amount || 0).toLocaleString("en-US");
}
</script>

<template>
  <section class="min-h-full bg-slate-50 p-5 md:p-8 dark:bg-slate-950">
    <!-- Header -->
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

      <!-- Create Deal Form -->
      <div
        class="flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row lg:w-auto dark:border-slate-800 dark:bg-slate-900"
      >
        <input
          v-model="title"
          type="text"
          placeholder="Client name"
          class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 sm:w-44 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          @keyup.enter="createDeal"
        />

        <input
          v-model="value"
          type="number"
          min="1"
          placeholder="Value"
          class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 sm:w-28 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          @keyup.enter="createDeal"
        />

        <button
          class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isCreating"
          @click="createDeal"
        >
          {{ isCreating ? "Creating..." : "+ Create Deal" }}
        </button>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
    >
      {{ errorMessage }}
    </div>

    <!-- Saving status -->
    <p
      v-if="isSaving"
      class="mb-4 text-sm font-medium text-indigo-600 dark:text-indigo-300"
    >
      Saving deal stage...
    </p>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      Loading deals...
    </div>

    <!-- Pipeline -->
    <div v-else class="grid gap-5 lg:grid-cols-2">
      <!-- Starts Conversation -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-slate-900 dark:text-white">
              Starts Conversation
            </h2>

            <p class="text-sm text-slate-500 dark:text-slate-400">
              New leads to contact
            </p>
          </div>

          <span
            class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
          >
            {{ startDeals.length }}
          </span>
        </div>

        <div
          class="relative min-h-64 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
        >
          <p
            v-if="startDeals.length === 0"
            class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400"
          >
            Drop deals here
          </p>

          <VueDraggable
            v-model="startDeals"
            item-key="id"
            :animation="150"
            :group="{ name: 'deals', pull: true, put: true }"
            class="min-h-64 space-y-3"
            @end="syncDealStages"
          >
            <div
              v-for="deal in startDeals"
              :key="deal.id"
              class="cursor-grab select-none rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p
                    class="truncate font-semibold text-slate-900 dark:text-white"
                  >
                    {{ deal.title }}
                  </p>

                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    New opportunity
                  </p>
                </div>

                <span
                  class="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                >
                  ${{ formatValue(deal.value) }}
                </span>
              </div>
            </div>
          </VueDraggable>
        </div>
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

            <p class="text-sm text-slate-500 dark:text-slate-400">
              Deals in progress
            </p>
          </div>

          <span
            class="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
          >
            {{ negotiationDeals.length }}
          </span>
        </div>

        <div
          class="relative min-h-64 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
        >
          <p
            v-if="negotiationDeals.length === 0"
            class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400"
          >
            Drop deals here
          </p>

          <VueDraggable
            v-model="negotiationDeals"
            item-key="id"
            :animation="150"
            :group="{ name: 'deals', pull: true, put: true }"
            class="min-h-64 space-y-3"
            @end="syncDealStages"
          >
            <div
              v-for="deal in negotiationDeals"
              :key="deal.id"
              class="cursor-grab select-none rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-500"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p
                    class="truncate font-semibold text-slate-900 dark:text-white"
                  >
                    {{ deal.title }}
                  </p>

                  <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Negotiation in progress
                  </p>
                </div>

                <span
                  class="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                >
                  ${{ formatValue(deal.value) }}
                </span>
              </div>
            </div>
          </VueDraggable>
        </div>
      </div>
    </div>
  </section>
</template>