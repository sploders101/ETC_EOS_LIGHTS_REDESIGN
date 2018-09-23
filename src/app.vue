<template>
	<div class="root">
		<titlebar>
			<md-button slot="menubtn" class="md-icon-button" @click="menuVisible = !menuVisible">
				<md-icon>menu</md-icon>
			</md-button>
		</titlebar>
		<navlist :active.sync="menuVisible" />
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import Vue from './wrapper/vue';
import {VueConstructor} from 'vue';
import {ipcRenderer} from 'electron';
import VueRouter from './wrapper/vue-router';

let home = require('./pages/home');
let fx = require('./pages/fx');
let faders = require('./pages/faders');

let router = new VueRouter({
	routes: [
		{
			path: "./",
			name: "Home",
			component: home
		},
		{
			path: "./fx",
			name: "FX",
			component: fx
		},
		{
			path: "./faders",
			name: "Faders",
			component: faders
		}
	]
});

export default Vue.extend({
	components: {
		titlebar: require('./components/header.vue'),
		navlist: require('./components/navlist.vue')
	},
	data() {
		return {
			menuVisible: false
		}
	},
	router: router,
	mounted() {
		ipcRenderer.send("done");
	}
});
</script>

<style lang="scss">
div.root {
	h2 {
		color: red;
	}
}
</style>
