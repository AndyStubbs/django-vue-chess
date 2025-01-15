// stores/auth.js
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		isAuthenticated: false,
		username: "",
		email: "",
	}),
	actions: {
		async checkAuth() {
			try {
				const response = await axios.get("/api/users/auth-check/", {
					withCredentials: true,
				});
				this.isAuthenticated = response.data.is_authenticated;
				this.username = response.data.username;
				this.email = response.data.email;
			} catch {
				this.isAuthenticated = false;
				this.username = "No one";
				this.email = "nope@example.com";
			}
		},
	},
});
