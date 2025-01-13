<template>
	<div id="app">
		<!-- Header -->
		<header>
			<div class="logo">Chess App</div>
			<nav>
				<ul class="nav-links">
					<li><router-link to="/">Home</router-link></li>
					<li><router-link to="/play">Play</router-link></li>
					<li><router-link to="/leaderboard">Leaderboard</router-link></li>
				</ul>
				<div class="auth-links">
					<button @click="openLoginModal">Login</button>
					<button @click="openRegisterModal">Register</button>
				</div>
				<!-- Dark Mode Toggle -->
				<div class="theme-toggle">
					<button @click="toggleTheme">
						{{ theme === "dark" ? "Light Mode" : "Dark Mode" }}
					</button>
				</div>
			</nav>
		</header>

		<!-- Main Content -->
		<main>
			<router-view />
		</main>

		<!-- Footer -->
		<footer>
			<p>© 2025 Chess App. All rights reserved.</p>
		</footer>

		<!-- Modals -->
		<BasicModal
			v-if="showLoginModal"
			title="Login"
			:isVisible="showLoginModal"
			@close="closeLoginModal"
		/>
		<BasicModal
			v-if="showRegisterModal"
			title="Register"
			:isVisible="showRegisterModal"
			@close="closeRegisterModal"
		/>
	</div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import BasicModal from "@/components/BasicModal.vue";

// Modals
const showLoginModal = ref(false);
const showRegisterModal = ref(false);

function openLoginModal() {
	showLoginModal.value = true;
}

function closeLoginModal() {
	showLoginModal.value = false;
}

function openRegisterModal() {
	showRegisterModal.value = true;
}

function closeRegisterModal() {
	showRegisterModal.value = false;
}

// Theme Management
const theme = ref("light");

// Detect system preference on mount
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
	theme.value = "dark";
}

// Watch for system changes to theme preference
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	theme.value = e.matches ? "dark" : "light";
	applyTheme();
});

function toggleTheme() {
	theme.value = theme.value === "dark" ? "light" : "dark";
	applyTheme();
}

// Apply the theme to the body element
function applyTheme() {
	document.body.className = theme.value;
}

// Apply the theme initially and on change
watchEffect(() => {
	applyTheme();
});
</script>
