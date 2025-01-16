// utils/api.js

"use strict";

import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// Create Axios instance
const api = axios.create({
	withCredentials: true,
});

// Handle token refresh logic
let isRefreshing = false;
let subscribers = [];

function onAccessTokenFetched() {
	subscribers.forEach((callback) => callback());
	subscribers = [];
}

// Add Axios interceptor
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const authStore = useAuthStore();

		// Check for 401 errors
		if (error.response?.status === 401 && !error.config._retry) {
			error.config._retry = true;

			// Handle token refresh
			if (!isRefreshing) {
				isRefreshing = true;

				try {
					await authStore.refreshAccessToken();
					onAccessTokenFetched();
				} catch {
					authStore.logout();
					return Promise.reject(error);
				} finally {
					isRefreshing = false;
				}
			}

			// Queue subsequent requests
			return new Promise((resolve) => {
				subscribers.push(() => resolve(api.request(error.config)));
			});
		}

		return Promise.reject(error); // Handle other errors
	},
);

export default api;
