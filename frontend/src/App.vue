<template>
	<div id="app">
		<!-- Header -->
		<header>
			<nav>
				<ul class="nav-links">
					<li><router-link to="/">Chess App</router-link></li>
					<li><router-link to="/play">Play</router-link></li>
					<li>
						<router-link to="/account" v-if="authStore.isAuthenticated"
							>Account</router-link
						>
					</li>
				</ul>
			</nav>
			<div class="other-links">
				<div class="theme-toggle">
					<CustomButton
						@click="toggleTheme"
						variant="icon"
						:title="theme === 'dark' ? 'Light Mode' : 'Dark Mode'"
					>
						<LightmodeIcon v-if="theme === 'dark'" />
						<DarkmodeIcon v-else />
					</CustomButton>
				</div>
				<div class="auth-links">
					<CustomButton
						@click="openAccountModal"
						variant="icon"
						title="Login/Register Account"
					>
						<AccountIcon />
					</CustomButton>
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
		<Teleport to="body">
			<CustomModal
				:title="showLoginForm ? 'Login' : 'Register'"
				:isVisible="showAccountModal"
				@close="closeAccountModal"
			>
				<LoginForm
					v-if="showLoginForm"
					@register="showLoginForm = false"
					@close="closeAccountModal"
				/>
				<RegisterForm v-else @login="showLoginForm = true" @close="closeAccountModal" />
			</CustomModal>
		</Teleport>
		<ToastContainer />
	</div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useAuthStore } from "./stores/auth.js";
import CustomModal from "@/components/custom/CustomModal.vue";
import AccountIcon from "@/components/icons/AccountIcon.vue";
import LightmodeIcon from "@/components/icons/LightmodeIcon.vue";
import DarkmodeIcon from "@/components/icons/DarkmodeIcon.vue";
import CustomButton from "@/components/custom/CustomButton.vue";
import LoginForm from "./components/user/LoginForm.vue";
import RegisterForm from "./components/user/RegisterForm.vue";
import ToastContainer from "./components/custom/ToastContainer.vue";

const authStore = useAuthStore();
const showLoginForm = ref(true);
const showAccountModal = ref(false);

function openAccountModal() {
	showAccountModal.value = true;
}

function closeAccountModal() {
	showAccountModal.value = false;
}

const theme = ref("light");

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
	theme.value = "dark";
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	theme.value = e.matches ? "dark" : "light";
	applyTheme();
});

function toggleTheme() {
	theme.value = theme.value === "dark" ? "light" : "dark";
	applyTheme();
}

function applyTheme() {
	document.body.className = theme.value;
}

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
