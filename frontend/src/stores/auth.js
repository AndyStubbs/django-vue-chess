// stores/auth.js

"use strict";

import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isAuthenticated: false,
		isLoggedIn: false,
		username: "",
		email: "",
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
				} else {
					throw new Error("Authentication verification failed.");
				}
			} catch (error) {
				throw new Error(error.response?.data?.error || "Login failed. Please try again.");
			}
		},

		// Log the user out
		logout() {
			this.isAuthenticated = false;
			this.isLoggedIn = false;
			this.username = "";

			// Persist to localStorage
			localStorage.setItem(
				"auth",
				JSON.stringify({
					isLoggedIn: this.isLoggedIn,
					email: this.email,
				}),
			);
		},

		// Restore auth state from localStorage
		restoreAuth() {
			const authData = JSON.parse(localStorage.getItem("auth"));
			if (authData) {
				this.isLoggedIn = authData.isLoggedIn || false;
				this.email = authData.email || "";
			}
		},
	},
});
