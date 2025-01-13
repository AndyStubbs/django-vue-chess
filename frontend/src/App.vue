<template>
	<div id="app">
		<!-- Header -->
		<header>
			<nav>
				<ul class="nav-links">
					<li><router-link to="/">Chess App</router-link></li>
					<li><router-link to="/play">Play</router-link></li>
					<li><router-link to="/about">About</router-link></li>
				</ul>
			</nav>
			<div class="other-links">
				<div class="theme-toggle">
					<button
						@click="toggleTheme"
						:title="theme === 'dark' ? 'Light Mode' : 'Dark Mode'"
					>
						<LightmodeIcon v-if="theme === 'dark'" />
						<DarkmodeIcon v-else />
					</button>
				</div>
				<div class="auth-links">
					<button @click="openAccountModal"><AccountIcon /></button>
				</div>
			</div>
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
			v-if="showAccountModal"
			title="Login"
			:isVisible="showAccountModal"
			@close="closeAccountModal"
		/>
	</div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import BasicModal from "@/components/BasicModal.vue";
import AccountIcon from "@/components/icons/AccountIcon.vue";
import LightmodeIcon from "@/components/icons/LightmodeIcon.vue";
import DarkmodeIcon from "@/components/icons/DarkmodeIcon.vue";

// Modals
const showAccountModal = ref(false);

function openAccountModal() {
	showAccountModal.value = true;
}

function closeAccountModal() {
	showAccountModal.value = false;
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

<style scoped>
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

header {
	background-color: var(--bg-color-2);
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
header ul {
	display: flex;
	justify-content: space-around;
	gap: 25px;
	margin: 0;
	padding: 0;
}
header li {
	list-style-type: none;
}
header nav {
	display: flex;
}
header nav a {
	text-decoration: none;
}
header .other-links {
	display: flex;
}

.auth-links button,
.theme-toggle button {
	background-color: var(--button-bg);
	color: var(--color-white);
	border: none;
	padding: 0.5rem 1rem;
	cursor: pointer;
	border-radius: 5px;
	font-family: var(--font-body);
}

.auth-links button:hover,
.theme-toggle button:hover {
	opacity: 0.8;
}

main {
	flex: 1;
	padding: 2rem 1rem;
	max-width: 1080px;
	width: 100%;
	margin: 0 auto;
}

footer {
	text-align: center;
	padding: 0.5rem;
	margin-top: auto;
}
footer p {
	margin: 0;
}
</style>
