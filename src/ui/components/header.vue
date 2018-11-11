<template>
	<div class="main">
		<div class="left nodrag"><slot name="menubtn" /></div>
		<h3 class="left md-title">EOS Control</h3>
		<div class="right nodrag"><slot name="status" /></div>
		<md-button class="right md-icon-button nodrag" @click='window("minimize")'>
			<md-icon>minimize</md-icon>
		</md-button>
		<md-button class="right md-icon-button nodrag" @click='window("maximize")'>
			<md-icon>{{ maximized ? "fullscreen_exit" : "fullscreen" }}</md-icon>
		</md-button>
		<md-button class="right md-icon-button nodrag" @click='window("close")'>
			<md-icon>close</md-icon>
		</md-button>
	</div>
</template>

<script lang="ts">
	import {ipcRenderer} from 'electron';
	import {WindowState} from '../../interfaces';
	import Vue from '../wrapper/vue';
	import {VueConstructor} from 'vue';

	export default Vue.extend({
		data: () => {
			return {
				maximized: false
			}
		},
		methods: {
			window: (action:string) => {
				ipcRenderer.send("window",action);
			}
		},
		mounted: function() {
			ipcRenderer.on('windowState', (_:any,state:WindowState) => {
				this.maximized = state.maximized;
			});
		}
	});
</script>

<style lang="scss" scoped>
	div.main {
		-webkit-app-region: drag;
		width: 100%;
		height: 100%;
		align-items: center;
		display: flex;
		flex-flow: row nowrap;
		.left {
			justify-self: flex-start;
		}
		.right {
			justify-self: flex-end;
		}
	}
	.md-title {
		flex: 1;
	}
	.nodrag {
		-webkit-app-region: no-drag;
	}
</style>
