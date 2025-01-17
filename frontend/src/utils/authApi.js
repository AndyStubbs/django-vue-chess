// utils/authApi.js

"use strict";

import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const authApi = axios.create({
	withCredentials: true,
});

// Handle token refresh logic
let isRefreshing = false;
let subscribers = [];

function onAccessTokenFetched() {
	subscribers.forEach((callback) => callback());
	subscribers = [];
}

authApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		// Check for 401 errors and retry if necessary
		if (error.response?.status === 401 && !error.config._retry) {
			error.config._retry = true;

			const authStore = useAuthStore();

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
				subscribers.push(() => resolve(authApi.request(error.config)));
			});
		}

		return Promise.reject(error);
	},
);

export default authApi;
