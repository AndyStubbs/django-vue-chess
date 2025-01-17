import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/play",
			name: "play",
			component: () => import("@/views/PlayView.vue"),
		},
		{
			path: "/account",
			name: "account",
			component: () => import("@/views/AccountView.vue"),
		},
	],
});

router.beforeEach((to, from, next) => {
	const auth = useAuthStore();
	if (to.meta.requiresAuth && !auth.isLoggedIn) {
		next({ path: "/" });
	} else {
		next();
	}
});

export default router;
