<template>
	<div>
		<component v-for="homeCard in home" :is="homeCard.component" :key="homeCard.path" />
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
				home: [] as UICard[]
			}
		},
		mounted: function() {
			ipcRenderer.on("/home/add",(_:any,path:string) => {
				this.home.push({
					path: path,
					component: require(path)
				});
			});
			ipcRenderer.send("/home/mounted");
		}
	});
</script>

<style lang="scss">
	.md-card {
		margin-top: 16px;
	}
</style>
