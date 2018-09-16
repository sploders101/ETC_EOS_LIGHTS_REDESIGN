<template>
	<div class="main">
		<md-toolbar class="md-primary">
			<div class="nodrag"><slot name="menubtn" /></div>
			<h3 class="md-title">EOS Control</h3>
			<md-button class="md-icon-button nodrag" @click='window("minimize")'>
				<md-icon>minimize</md-icon>
			</md-button>
			<md-button class="md-icon-button nodrag" @click='window("maximize")'>
				<md-icon>{{ maximized ? "fullscreen_exit" : "fullscreen" }}</md-icon>
			</md-button>
			<md-button class="md-icon-button nodrag" @click='window("close")'>
				<md-icon>close</md-icon>
			</md-button>
		</md-toolbar>
	</div>
</template>

<script lang="ts">
	import {ipcRenderer} from 'electron';
	import {WindowState} from '../interfaces';

	export default {
		data: () => {
			return {
				maximized: false;
			}
		},
		methods: {
			window: (action) => {
				ipcRenderer.send("window",action);
			}
		},
		mounted: function() {
			ipcRenderer.on('windowState', (_:any,state:WindowState) => {
				this.maximized = state.maximized;
			});
		}
	}
</script>

<style lang="scss" scoped>
	div.main {
		-webkit-app-region: drag;
	}
	.md-title {
		flex: 1;
	}
	.nodrag {
		-webkit-app-region: no-drag;
	}
</style>
