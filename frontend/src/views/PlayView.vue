<template>
	<div>
		<h1>Play</h1>
		<div class="wrapper">
			<div class="menu">
				<div class="game-select">
					<CustomButton toggle>Bullet</CustomButton>
					<CustomButton toggle selected>Blitz</CustomButton>
					<CustomButton toggle>Rapid</CustomButton>
					<CustomButton toggle>Classical</CustomButton>
				</div>
				<CustomButton variant="1">Play Human</CustomButton>
				<CustomButton variant="1">Play Bot</CustomButton>
				<CustomButton variant="1">Practice</CustomButton>
			</div>
		</div>
	</div>
</template>

<script setup>
import CustomButton from "@/components/custom/CustomButton.vue";
</script>

<style scoped>
.wrapper {
	display: flex;
	justify-content: center;
}
.menu {
	display: flex;
	flex-direction: column;
	row-gap: 16px;
	max-width: 800px;
	width: 100%;
}
.menu button {
	height: 60px;
}
.game-select {
	display: flex;
	flex-direction: row;
	gap: 16px;
}
.game-select button {
	width: 180px;
}
</style>
