<script lang="ts">
	import {NavListData,UIEntry} from '../../interfaces';
	import Vue from '../wrapper/vue';
	import {VueConstructor} from 'vue';
	import {ipcRenderer} from 'electron';

	export default Vue.extend({
		props: ["mdActive"],
		data: () => {return {
			links: [
				{
					icon: "home",
					name: "Home"
				},
				{
					icon: "settings",
					name: "Settings"
				}
			]
		} as NavListData},
		mounted: function() {
			ipcRenderer.on("/ui/addRoute", (_:any, uiData: UIEntry) => {
				this.links.push({
					name: uiData.name,
					icon: uiData.icon,
					link: uiData.link
				});
			});
		}
	});
</script>

<template>
	<div>
		<md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>
		<md-list>
			<router-link v-for="link in links" :key="link.name" @click.native="$emit('update:mdActive',false);" :to="{name: link.link || link.name}">
				<md-list-item>
					<md-icon>{{link.icon}}</md-icon>
					<span class="md-list-item-text">{{link.name}}</span>
				</md-list-item>
			</router-link>
		</md-list>
	</div>
</template>

<style lang="scss">

</style>
