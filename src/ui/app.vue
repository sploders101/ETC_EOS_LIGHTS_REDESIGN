<template>
		<md-app>
			<md-app-toolbar>
				<titlebar>
					<md-button slot="menubtn" class="md-icon-button" @click="menuVisible = !menuVisible">
						<md-icon>menu</md-icon>
					</md-button>
					<md-button slot="status" class="md-icon-button" @click="connectionDialogVisible = true;">
						<md-icon v-if="board_connected">wifi</md-icon>
						<md-icon v-if="!board_connected">wifi_off</md-icon>
					</md-button>
				</titlebar>
			</md-app-toolbar>
			<md-app-drawer :md-active.sync="menuVisible">
				<navlist :md-active.sync="menuVisible"></navlist>
			</md-app-drawer>
			<md-app-content>
				<md-dialog :md-active.sync="connectionDialogVisible">
					<md-dialog-title>Board Connection</md-dialog-title>
					<p class="dialogContent">
						The light board is {{ (board_connected) ? ("") : ("not ") }}connected.
					</p>
					<md-dialog-actions>
						<md-button class="md-primary" v-for="action in pingActions" :key="action.action" @click="sendAction(action.action)">{{ action.display }}</md-button>
						<md-button class="md-primary" @click="connectionDialogVisible = false;">OK</md-button>
					</md-dialog-actions>
				</md-dialog>
				<router-view></router-view>
			</md-app-content>
		</md-app>
</template>

<script lang="ts">
import Vue from 'vue';
import VueMaterial from 'vue-material';
import {VueConstructor} from 'vue';
import {ipcRenderer} from 'electron';
import VueRouter from 'vue-router';
// import mdSlider from './components/mdSlider/index.js';
import {UIEntry} from '../interfaces'
import { setInterval } from 'timers';

Vue.use(VueRouter);
Vue.use(VueMaterial);
// Vue.use(mdSlider);

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
		name: uiData.link || uiData.name,
		component: require(uiData.componentPath)
	}]);
});

export default Vue.extend({
	components: {
		titlebar: require('./components/header'),
		navlist: require('./components/navlist')
	},
	data() {
		return {
			menuVisible: false,
			board_connected: false,
			connectionDialogVisible: false,
			pingActions: [] as {
				display: string;
				action: string;
			}[]
		}
	},
	router: router,
	methods: {
		sendAction(path:string) {
			ipcRenderer.send(path);
		}
	},
	mounted() {
		ipcRenderer.send("/ui/mounted");
		ipcRenderer.on("/board/ping/response",() => {
			this.board_connected = true;
		});
		ipcRenderer.on("/board/ping/timeout",() => {
			this.board_connected = false;
		});
		setInterval(() => {
			ipcRenderer.send("/board/ping");
		},500);
		ipcRenderer.on("/board/ping/actions",(_:any, descriptor:{display:string;action:string;}[]) => {
			descriptor.forEach((v) => {
				this.pingActions.push(v);
			})
		});
		ipcRenderer.send("/board/ping/getActions");
	}
});
</script>

<style lang="scss">
	// beacon:if(production)
		@import "../node_modules/vue-material/dist/vue-material.min.css";
		@import "../node_modules/vue-material/dist/theme/default-dark.css";
		@import "../node_modules/material-design-icons/iconfont/material-icons.css";
	// beacon:endif
	// beacon:if(!production)
		@import "../../node_modules/vue-material/dist/vue-material.min.css";
		@import "../../node_modules/vue-material/dist/theme/default-dark.css";
		@import "../../node_modules/material-design-icons/iconfont/material-icons.css";
	// beacon:endif
	@import "https://fonts.googleapis.com/icon?family=Material+Icons";

	.md-app {
		height: 100vh;
		.md-content {
			overflow: auto;
			padding: 0;
		}
	}
	.dialogContent {
        margin-left: 24px;
        margin-right: 24px;
    }
</style>
