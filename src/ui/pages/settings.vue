<template>
	<div class="settings">
		<component v-for="settingCard in settings" :is="settingCard.component" :key="settingCard.path" />
	</div>
</template>

<script lang="ts">
	import Vue from '../wrapper/vue';
	import {ipcRenderer} from 'electron';
	import {VueConstructor} from 'vue';

	let self:any;

	ipcRenderer.on("/settings/add",(_:any,path:any) => {
		self.settings.push({
			path: path.settings,
			component: require(path.settings)
		});
	})

	export default Vue.extend({
		data: () => {
			return {
				settings: []
			}
		},
		mounted: function() {
			self = this;
			ipcRenderer.send("/settings/mounted");
		}
	});
</script>

<style lang="scss" scoped>
	.md-card {
		margin-top: 16px;
	}
</style>
