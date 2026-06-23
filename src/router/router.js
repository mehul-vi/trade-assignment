import { createRouter, createWebHistory } from "vue-router";

import WorkspaceSummary from "../views/WorkSummary.vue";
import DealsView from "../views/DealView.vue";
import IbsView from "../views/IbsView.vue";

const routes = [
    { path: "/", redirect: "/workspace/summary" },
    { path: "/workspace", redirect: "/workspace/summary" },
    { path: "/workspace/summary", component: WorkspaceSummary },
    { path: "/workspace/deals", component: DealsView },
    { path: "/partners/ibs", component: IbsView },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});