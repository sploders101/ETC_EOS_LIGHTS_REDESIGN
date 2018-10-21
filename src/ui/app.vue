<template>
		<md-app>
			<md-app-toolbar>
				<titlebar>
					<md-button slot="menubtn" class="md-icon-button" @click="menuVisible = !menuVisible">
						<md-icon>menu</md-icon>
					</md-button>
				</titlebar>
			</md-app-toolbar>
			<md-app-drawer :md-active.sync="menuVisible">
				<navlist :md-active.sync="menuVisible" />
			</md-app-drawer>
			<md-app-content>
				<router-view></router-view>
			</md-app-content>
		</md-app>
</template>

<script lang="ts">
import Vue from './wrapper/vue';
import VueMaterial from 'vue-material';
import {VueConstructor} from 'vue';
import {ipcRenderer} from 'electron';
import VueRouter from './wrapper/vue-router';
import mdSlider from './components/mdSlider/index.js';
import {UIEntry} from '../interfaces'

Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(mdSlider);

let home = require('./pages/home');
let settings = require('./pages/settings');

let router = new VueRouter({
	routes: [
		{
			path: "",
			name: "Home",
			component: home
		},
		{
			path: "settings",
			name: "Settings",
			component: settings
		}
	]
});
ipcRenderer.on("/ui/addRoute", function(_:any,uiData:UIEntry) {
	router.addRoutes([{
		path: `./${(uiData.link || uiData.name).toLowerCase()}`,
		name: uiData.link || uiData.link,
		component: require(uiData.componentPath)
	}]);
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
		ipcRenderer.send("/ui/mounted");
	}
});
</script>

<style lang="scss">
	@import "../../node_modules/vue-material/dist/vue-material.min.css";
	@import "../../node_modules/vue-material/dist/theme/default-dark.css";
	@import "../../node_modules/material-design-icons/iconfont/material-icons.css";
	@import "https://fonts.googleapis.com/icon?family=Material+Icons";

	.md-app {
		height: 100vh;
		.md-content {
			overflow: auto;
			padding: 0;
		}
	}
</style>
