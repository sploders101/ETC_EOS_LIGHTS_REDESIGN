<template>
	<div class="root">
		<titlebar>
			<md-button slot="menubtn" class="md-icon-button" @click="menuVisible = !menuVisible">
				<md-icon>menu</md-icon>
			</md-button>
		</titlebar>
		<navlist :active.sync="menuVisible" />
		<router-view />
	</div>
</template>

<script lang="ts">

let {ipcRenderer} = require("electron");

export default {
	components: {
		titlebar: require('./components/header.vue'),
		navlist: require('./components/navlist.vue')
	},
	data() {
		return {
			menuVisible: false
		}
	},
	mounted() {
		ipcRenderer.send("done");
	}
}
</script>

<style lang="scss">
div.root {
	h2 {
		color: red;
	}
}
</style>
