<script setup>
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";
import Pagination from "../components/Pagination.vue";

const ibList = ref([]);
const loading = ref(false);

const page = ref(1);
const limit = ref(25);

// Sorting
const sortBy = ref("");
const sortOrder = ref("");

// Add/Edit form
const userName = ref("");
const userEmail = ref("");
const fName = ref("");
const lName = ref("");
const ibState = ref("Active");

const editingId = ref(null);

// Table filters
const usernameFilter = ref("");
const emailFilter = ref("");
const firstNameFilter = ref("");
const lastNameFilter = ref("");
const stateFilter = ref("");

let searchTimer = null;

/* -------------------- SORTING -------------------- */

const sortedList = computed(() => {
  const data = [...ibList.value];

  if (!sortBy.value || !sortOrder.value) {
    return data;
  }

  data.sort((a, b) => {
    const first = String(a?.[sortBy.value] ?? "").toLowerCase();
    const second = String(b?.[sortBy.value] ?? "").toLowerCase();

    if (sortBy.value === "id") {
      const firstId = Number(a?.id) || 0;
      const secondId = Number(b?.id) || 0;

      return sortOrder.value === "asc"
        ? firstId - secondId
        : secondId - firstId;
    }

    return sortOrder.value === "asc"
      ? first.localeCompare(second)
      : second.localeCompare(first);
  });

  return data;
});

/* -------------------- FILTERING -------------------- */

const finalList = computed(() => {
  return sortedList.value.filter((item) => {
    const username = String(item.username || "").toLowerCase();
    const email = String(item.email || "").toLowerCase();
    const firstName = String(item.firstName || "").toLowerCase();
    const lastName = String(item.lastName || "").toLowerCase();
    const state = String(item.state || "").toLowerCase();

    return (
      username.includes(usernameFilter.value.trim().toLowerCase()) &&
      email.includes(emailFilter.value.trim().toLowerCase()) &&
      firstName.includes(firstNameFilter.value.trim().toLowerCase()) &&
      lastName.includes(lastNameFilter.value.trim().toLowerCase()) &&
      state.includes(stateFilter.value.trim().toLowerCase())
    );
  });
});

/* -------------------- PAGINATION -------------------- */

const totalPage = computed(() => {
  return Math.max(1, Math.ceil(finalList.value.length / limit.value));
});

const showData = computed(() => {
  const start = (page.value - 1) * limit.value;
  return finalList.value.slice(start, start + limit.value);
});

/* -------------------- API GET -------------------- */

async function getIBData() {
  loading.value = true;

  try {
    const params = {};

    // Search params Network tab me visible honge
    if (usernameFilter.value.trim()) {
      params.username__contains = usernameFilter.value.trim();
    }

    if (emailFilter.value.trim()) {
      params.email__contains = emailFilter.value.trim();
    }

    if (firstNameFilter.value.trim()) {
      params.firstName__contains = firstNameFilter.value.trim();
    }

    if (lastNameFilter.value.trim()) {
      params.lastName__contains = lastNameFilter.value.trim();
    }

    if (stateFilter.value.trim()) {
      params.state__contains = stateFilter.value.trim();
    }

    // Sorting params bhi request me jayenge
    if (sortBy.value && sortOrder.value) {
      params.ordering =
        sortOrder.value === "desc"
          ? `-${sortBy.value}`
          : sortBy.value;
    }

    // Pagination params Network tab me visible honge
    params.limit = limit.value;
    params.offset = (page.value - 1) * limit.value;

    const res = await api.get("/ibs", { params });

    /*
      json-server normally array return karta hai.
      Agar params ke wajah se empty array aaye,
      fallback normal request karega.
    */
    if (Array.isArray(res.data) && res.data.length > 0) {
      ibList.value = res.data;
    } else {
      const fallbackRes = await api.get("/ibs");
      ibList.value = Array.isArray(fallbackRes.data)
        ? fallbackRes.data
        : [];
    }
  } catch (error) {
    console.log("IB fetch error:", error);

    try {
      const fallbackRes = await api.get("/ibs");

      ibList.value = Array.isArray(fallbackRes.data)
        ? fallbackRes.data
        : [];
    } catch (fallbackError) {
      console.log("IB fallback fetch error:", fallbackError);
      ibList.value = [];
    }
  } finally {
    loading.value = false;
  }
}

/* -------------------- SORT CLICK -------------------- */

function sortData(key) {
  if (sortBy.value !== key) {
    sortBy.value = key;
    sortOrder.value = "asc";
  } else if (sortOrder.value === "asc") {
    sortOrder.value = "desc";
  } else {
    sortBy.value = "";
    sortOrder.value = "";
  }

  page.value = 1;

  // Network tab me sorting request dikhegi
  getIBData();
}

/* -------------------- FILTER WATCH + DEBOUNCE -------------------- */

watch(
  [
    usernameFilter,
    emailFilter,
    firstNameFilter,
    lastNameFilter,
    stateFilter,
  ],
  () => {
    page.value = 1;

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      getIBData();
    }, 500);
  }
);

/* -------------------- FORM -------------------- */

function resetForm() {
  userName.value = "";
  userEmail.value = "";
  fName.value = "";
  lName.value = "";
  ibState.value = "Active";
  editingId.value = null;
}

function editIB(item) {
  editingId.value = item.id;

  userName.value = item.username || "";
  userEmail.value = item.email || "";
  fName.value = item.firstName || "";
  lName.value = item.lastName || "";
  ibState.value = item.state || "Active";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function addIB() {
  if (
    !userName.value.trim() ||
    !userEmail.value.trim() ||
    !fName.value.trim() ||
    !lName.value.trim()
  ) {
    alert("Please fill all fields");
    return;
  }

  const formData = {
    username: userName.value.trim(),
    email: userEmail.value.trim(),
    firstName: fName.value.trim(),
    lastName: lName.value.trim(),
    state: ibState.value,
  };

  try {
    if (editingId.value !== null) {
      await api.patch(`/ibs/${editingId.value}`, formData);

      resetForm();
      await getIBData();
      return;
    }

    await api.post("/ibs", formData);

    resetForm();
    page.value = 1;

    await getIBData();
  } catch (error) {
    console.log("IB save error:", error);
  }
}

async function deleteIB(id) {
  const isConfirmed = confirm("Are you sure you want to delete this IB?");

  if (!isConfirmed) return;

  try {
    await api.delete(`/ibs/${id}`);

    if (showData.value.length === 1 && page.value > 1) {
      page.value--;
    }

    await getIBData();
  } catch (error) {
    console.log("IB delete error:", error);
  }
}

/* -------------------- PAGINATION -------------------- */

function firstPage() {
  page.value = 1;
}

function previousPage() {
  if (page.value > 1) {
    page.value--;
  }
}

function nextPage() {
  if (page.value < totalPage.value) {
    page.value++;
  }
}

function lastPage() {
  page.value = totalPage.value;
}

function changeLimit(newLimit) {
  limit.value = Number(newLimit);
  page.value = 1;
}

watch(totalPage, (newTotalPage) => {
  if (page.value > newTotalPage) {
    page.value = newTotalPage;
  }
});

onMounted(() => {
  getIBData();
});
</script>

<template>
  <section class="min-h-full bg-slate-50 p-5 md:p-8 dark:bg-slate-950">
    <div class="mb-7">
      <p class="text-sm font-semibold text-indigo-600">PARTNERS</p>

      <h1 class="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
        Introducing Brokers
      </h1>
    </div>

    <!-- Add / Edit Form -->
    <div
      class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="font-bold text-slate-900 dark:text-white">
          {{ editingId !== null ? "Edit IB" : "Add New IB" }}
        </h2>

        <button
          v-if="editingId !== null"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="resetForm"
        >
          Cancel Edit
        </button>
      </div>

      <div class="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <input
          v-model="userName"
          type="text"
          placeholder="Username"
          class="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <input
          v-model="userEmail"
          type="email"
          placeholder="Email address"
          class="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <input
          v-model="fName"
          type="text"
          placeholder="First name"
          class="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <input
          v-model="lName"
          type="text"
          placeholder="Last name"
          class="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <select
          v-model="ibState"
          class="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>

        <button
          class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
          @click="addIB"
        >
          {{ editingId !== null ? "Update IB" : "+ Add IB" }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        class="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800"
      >
        <h2 class="font-bold text-slate-900 dark:text-white">
          IB Directory
        </h2>

        <span
          v-if="loading"
          class="text-sm font-medium text-indigo-600 dark:text-indigo-400"
        >
          Searching...
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1050px] text-left">
          <thead
            class="bg-slate-50 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
          >
            <tr>
              <th
                class="cursor-pointer px-5 py-3 font-semibold hover:text-indigo-600"
                @click="sortData('id')"
              >
                ID
                {{ sortBy === "id" ? (sortOrder === "asc" ? "↑" : "↓") : "" }}
              </th>

              <th
                class="cursor-pointer px-5 py-3 font-semibold hover:text-indigo-600"
                @click="sortData('username')"
              >
                Username
                {{
                  sortBy === "username"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""
                }}
              </th>

              <th
                class="cursor-pointer px-5 py-3 font-semibold hover:text-indigo-600"
                @click="sortData('email')"
              >
                Email
                {{
                  sortBy === "email"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""
                }}
              </th>

              <th
                class="cursor-pointer px-5 py-3 font-semibold hover:text-indigo-600"
                @click="sortData('firstName')"
              >
                First Name
                {{
                  sortBy === "firstName"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""
                }}
              </th>

              <th
                class="cursor-pointer px-5 py-3 font-semibold hover:text-indigo-600"
                @click="sortData('lastName')"
              >
                Last Name
                {{
                  sortBy === "lastName"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""
                }}
              </th>

              <th
                class="cursor-pointer px-5 py-3 font-semibold hover:text-indigo-600"
                @click="sortData('state')"
              >
                State
                {{
                  sortBy === "state"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""
                }}
              </th>

              <th class="px-5 py-3 font-semibold">Actions</th>
            </tr>

            <tr class="border-t border-slate-200 dark:border-slate-700">
              <th class="px-3 py-2"></th>

              <th class="px-3 py-2">
                <input
                  v-model="usernameFilter"
                  type="text"
                  placeholder="Filter username"
                  class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </th>

              <th class="px-3 py-2">
                <input
                  v-model="emailFilter"
                  type="text"
                  placeholder="Filter email"
                  class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </th>

              <th class="px-3 py-2">
                <input
                  v-model="firstNameFilter"
                  type="text"
                  placeholder="Filter first name"
                  class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </th>

              <th class="px-3 py-2">
                <input
                  v-model="lastNameFilter"
                  type="text"
                  placeholder="Filter last name"
                  class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </th>

              <th class="px-3 py-2">
                <input
                  v-model="stateFilter"
                  type="text"
                  placeholder="Filter state"
                  class="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </th>

              <th class="px-3 py-2"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in showData"
              :key="item.id"
              class="border-t border-slate-100 dark:border-slate-800"
            >
              <td class="px-5 py-4 text-slate-500 dark:text-slate-400">
                {{ (page - 1) * limit + index + 1 }}
              </td>

              <td class="px-5 py-4 font-medium text-slate-900 dark:text-white">
                {{ item.username }}
              </td>

              <td class="px-5 py-4 text-slate-500 dark:text-slate-400">
                {{ item.email }}
              </td>

              <td class="px-5 py-4 text-slate-700 dark:text-slate-300">
                {{ item.firstName }}
              </td>

              <td class="px-5 py-4 text-slate-700 dark:text-slate-300">
                {{ item.lastName }}
              </td>

              <td class="px-5 py-4 text-slate-700 dark:text-slate-300">
                {{ item.state }}
              </td>

              <td class="px-5 py-4">
                <div class="flex gap-2">
                  <button
                    class="rounded-md border border-indigo-300 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/40 dark:hover:bg-indigo-500/10"
                    @click="editIB(item)"
                  >
                    Edit
                  </button>

                  <button
                    class="rounded-md border border-rose-300 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-500/40 dark:hover:bg-rose-500/10"
                    @click="deleteIB(item.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!loading && showData.length === 0">
              <td
                colspan="7"
                class="px-5 py-10 text-center text-sm text-slate-400"
              >
                No matching IB partners found.
              </td>
            </tr>

            <tr v-if="loading">
              <td
                colspan="7"
                class="px-5 py-10 text-center text-sm text-slate-400"
              >
                Loading IB partners...
              </td>
            </tr>
          </tbody>
        </table>

        <Pagination
          :page="page"
          :total-page="totalPage"
          :limit="limit"
          @first="firstPage"
          @previous="previousPage"
          @next="nextPage"
          @last="lastPage"
          @change-limit="changeLimit"
        />
      </div>
    </div>
  </section>
</template>