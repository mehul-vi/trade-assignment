<script setup>
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";
import Pagination from "../components/Pagination.vue";

const ibList = ref([]);

const page = ref(1);
const limit = ref(25);

const sortBy = ref("");
const sortOrder = ref("");

// form fields
const userName = ref("");
const userEmail = ref("");
const fName = ref("");
const lName = ref("");
const ibState = ref("Active");

// Edit mode
const editingId = ref(null);

// Filters
const usernameFilter = ref("");
const emailFilter = ref("");
const firstNameFilter = ref("");
const lastNameFilter = ref("");
const stateFilter = ref("");

// Sorting
const sortedList = computed(() => {
  const data = [...ibList.value];

  if (!sortBy.value || !sortOrder.value) {
    return data;
  }

  data.sort((a, b) => {
    const first = String(a?.[sortBy.value] || "").toLowerCase();
    const second = String(b?.[sortBy.value] || "").toLowerCase();

    if (sortOrder.value === "asc") {
      return first.localeCompare(second);
    }

    return second.localeCompare(first);
  });

  return data;
});

// Filtering
const finalList = computed(() => {
  return sortedList.value.filter((item) => {
    const matchUsername = String(item.username || "")
      .toLowerCase()
      .includes(usernameFilter.value.toLowerCase());

    const matchEmail = String(item.email || "")
      .toLowerCase()
      .includes(emailFilter.value.toLowerCase());

    const matchFirstName = String(item.firstName || "")
      .toLowerCase()
      .includes(firstNameFilter.value.toLowerCase());

    const matchLastName = String(item.lastName || "")
      .toLowerCase()
      .includes(lastNameFilter.value.toLowerCase());

    const matchState = String(item.state || "")
      .toLowerCase()
      .includes(stateFilter.value.toLowerCase());

    return (
      matchUsername &&
      matchEmail &&
      matchFirstName &&
      matchLastName &&
      matchState
    );
  });
});

// Pagination
const totalPage = computed(() => {
  return Math.max(1, Math.ceil(finalList.value.length / limit.value));
});

const showData = computed(() => {
  const start = (page.value - 1) * limit.value;
  return finalList.value.slice(start, start + limit.value);
});

// Sort
function sortData(key) {
  if (sortBy.value !== key) {
    sortBy.value = key;
    sortOrder.value = "asc";
    page.value = 1;
    return;
  }

  if (sortOrder.value === "asc") {
    sortOrder.value = "desc";
    page.value = 1;
    return;
  }

  sortBy.value = "";
  sortOrder.value = "";
  page.value = 1;
}

// GET
async function getIBData() {
  try {
    const res = await api.get("/ibs");
    ibList.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.log("IB fetch error:", error);
    ibList.value = [];
  }
}

// Clear form
function resetForm() {
  userName.value = "";
  userEmail.value = "";
  fName.value = "";
  lName.value = "";
  ibState.value = "Active";
  editingId.value = null;
}

// Edit
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

// set id
function getNewId() {
  if (ibList.value.length === 0) {
    return 1;
  }

  const ids = ibList.value
    .map((item) => Number(item.id))
    .filter((id) => !isNaN(id));

  if (ids.length === 0) {
    return 1;
  }

  return Math.max(...ids) + 1;
}

// Add / Update
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
    // Update
    if (editingId.value !== null) {
      const res = await api.patch(`/ibs/${editingId.value}`, formData);

      const index = ibList.value.findIndex(
        (item) => item.id === editingId.value
      );

      if (index !== -1) {
        ibList.value[index] = res.data;
      }

      resetForm();
      return;
    }

    // Add
    const newIB = {
      id: String(getNewId()),
      ...formData,
    };

    const res = await api.post("/ibs", newIB);

    ibList.value.push(res.data);

    resetForm();

    page.value = totalPage.value;
  } catch (error) {
    console.log("IB save error:", error);
  }
}

// Delete
async function deleteIB(id) {
  const isConfirmed = confirm("Are you sure you want to delete this IB?");

  if (!isConfirmed) {
    return;
  }

  try {
    await api.delete(`/ibs/${id}`);

    ibList.value = ibList.value.filter((item) => item.id !== id);

    if (page.value > totalPage.value) {
      page.value = totalPage.value;
    }
  } catch (error) {
    console.log("IB delete error:", error);
  }
}

// Pagination buttons
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

// Filter change => first page
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
  }
);

// Page limit change
function changeLimit(newLimit) {
  limit.value = newLimit;
  page.value = 1;
}

// Valid page check
watch(totalPage, (newPageCount) => {
  if (page.value > newPageCount) {
    page.value = newPageCount;
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
      <div class="border-b border-slate-200 p-4 dark:border-slate-800">
        <h2 class="font-bold text-slate-900 dark:text-white">IB Directory</h2>
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
                {{ ((page - 1) * limit) + index + 1 }}
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

            <tr v-if="finalList.length === 0">
              <td
                colspan="7"
                class="px-5 py-10 text-center text-sm text-slate-400"
              >
                No matching IB partners found.
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