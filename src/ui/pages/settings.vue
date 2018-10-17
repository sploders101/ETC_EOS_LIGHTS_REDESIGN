<template>
	<div class="settings">
		<component v-for="settingCard in settings" :is="settingCard.component" :key="settingCard.path" />
	</div>
</template>

<script lang="ts">
	import Vue from '../wrapper/vue';
	import {ipcRenderer} from 'electron';
	import {VueConstructor} from 'vue';
	import {UICard} from '../../interfaces';

	export default Vue.extend({
		data: () => {
			return {
				settings: [] as UICard[]
			}
		},
		mounted: function() {
			ipcRenderer.on("/settings/add",(_:any,path:string) => {
				this.settings.push({
					path: path,
					component: require(path)
				});
			});
			ipcRenderer.send("/settings/mounted");
		}
	});
</script>

<style lang="scss" scoped>
	.md-card {
		margin-top: 16px;
	}
</style>
