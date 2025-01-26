// stores/auth.js

"use strict";

import { defineStore } from "pinia";
import authApi from "@/utils/authApi";
import api from "@/utils/api";
import URLS from "@/utils/urls";

// Buffer time (in milliseconds) before token expiration
const REFRESH_BUFFER = 30 * 1000;

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isAuthenticated: false,
		isLoggedIn: false,
		name: "Guest",
		rating: 237,
		username: "",
		email: "",
		tokenRefreshTimer: null,
	}),
	actions: {
		// Check if the user is authenticated
		async checkAuth() {
			if (!this.isLoggedIn) {
				return;
			}
			try {
				const response = await authApi.get(URLS.CHECK_AUTH);
				this.isAuthenticated = response.data.is_authenticated;
				this.username = response.data.username;
				this.email = response.data.email;

				// Schedule token refresh if authenticated
				if (this.isAuthenticated) {
					this.scheduleTokenRefresh(response.data.token_exp);
				}
			} catch {
				this.logout();
			}
		},

		// Log the user in
		async login(email, password) {
			try {
				// Login and get initial response
				await api.post(URLS.LOGIN, { email, password });

				// Verify authentication after login
				const authCheck = await authApi.get("/api/users/check-auth/", {
					withCredentials: true,
				});

				if (authCheck.data.is_authenticated) {
					this.isAuthenticated = true;
					this.isLoggedIn = true;
					this.username = authCheck.data.username;
					this.email = email;

					// Save to localStorage
					localStorage.setItem(
						"auth",
						JSON.stringify({
							isLoggedIn: this.isLoggedIn,
							email: this.email,
						}),
					);

					this.scheduleTokenRefresh(authCheck.data.token_exp);
				} else {
					throw new Error("Authentication verification failed.");
				}
			} catch (error) {
				throw new Error(
					error.response?.data?.error ||
						"Login failed. Please double-check your email and password and try again.",
				);
			}
		},

		// Refresh access token
		async refreshAccessToken() {
			try {
				const response = await authApi.post(URLS.REFRESH, {});
				this.scheduleTokenRefresh(response.data.token_exp);
			} catch {
				this.logout();
				throw new Error("Session expired. Please log in again.");
			}
		},

		// Schedule token refresh
		scheduleTokenRefresh(expirationTime) {
			// Calculate remaining time until token expiration
			const currentTime = Math.floor(Date.now() / 1000);
			const expiresIn = expirationTime - currentTime;

			if (expiresIn > 0) {
				let refreshTime = Math.max(expiresIn * 1000 - REFRESH_BUFFER, 1000);

				// Clear any existing timer
				if (this.tokenRefreshTimer) {
					clearTimeout(this.tokenRefreshTimer);
				}

				// Schedule the token refresh
				this.tokenRefreshTimer = setTimeout(async () => {
					await this.refreshAccessToken();
				}, refreshTime);
			} else {
				console.log("Already expired");
			}
		},

		// Log the user out
		async logout(isDelete = false) {
			if (!isDelete) {
				try {
					await authApi.post(URLS.LOGOUT, {});
				} catch (error) {
					console.error(error);
				}
			}
			this.isAuthenticated = false;
			this.isLoggedIn = false;
			this.username = "";

			// Clear storage and timers
			localStorage.setItem(
				"auth",
				JSON.stringify({
					isLoggedIn: this.isLoggedIn,
					email: this.email,
				}),
			);
			if (this.tokenRefreshTimer) {
				clearTimeout(this.tokenRefreshTimer);
			}

			window.location.href = "/";
		},

		// Delete a user's account
		async deleteAccount() {
			try {
				await authApi.delete(URLS.DELETE_USER);
				this.logout(true);
			} catch (error) {
				throw new Error(error.response?.data?.error || "Failed to delete account.");
			}
		},

		// Restore auth state from localStorage
		async restoreAuth() {
			const authData = JSON.parse(localStorage.getItem("auth"));
			if (authData) {
				this.isLoggedIn = authData.isLoggedIn || false;
				this.email = authData.email || "";
			}

			// Verify authentication and schedule refresh if logged in
			if (this.isLoggedIn) {
				await this.refreshAccessToken();
				await this.checkAuth();
			}
		},
	},
});
