// stores/auth.js

"use strict";

import { defineStore } from "pinia";
import axios from "axios";

// Buffer time (in milliseconds) before token expiration
const REFRESH_BUFFER = 30 * 1000;

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isAuthenticated: false,
		isLoggedIn: false,
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
				const response = await axios.get("/api/users/auth-check/", {
					withCredentials: true,
				});
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
				await axios.post("/api/users/login/", { email, password });

				// Verify authentication after login
				const authCheck = await axios.get("/api/users/auth-check/", {
					withCredentials: true,
				});

				if (authCheck.data.is_authenticated) {
					this.isAuthenticated = true;
					this.isLoggedIn = true;
					this.username = authCheck.data.username;
					this.email = email;

					// Persist to localStorage
					localStorage.setItem(
						"auth",
						JSON.stringify({
							isLoggedIn: this.isLoggedIn,
							email: this.email,
						}),
					);

					// Schedule token refresh
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
				const response = await axios.post(
					"/api/users/token/refresh/",
					{},
					{
						withCredentials: true,
					},
				);

				// Schedule the next refresh
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
				const refreshTime = expiresIn * 1000 - REFRESH_BUFFER;

				// Clear any existing timer
				if (this.tokenRefreshTimer) {
					clearTimeout(this.tokenRefreshTimer);
				}

				// Schedule the token refresh
				this.tokenRefreshTimer = setTimeout(async () => {
					await this.refreshAccessToken();
				}, refreshTime);
				console.log(`Refresh scheduled for ${refreshTime}`);
			}
		},

		// Log the user out
		logout() {
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
				await axios.delete("/api/users/delete-user/", {
					withCredentials: true,
				});

				// Clear state and storage after deletion
				this.logout();
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
				await this.checkAuth();
			}
		},
	},
});
