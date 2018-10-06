<script lang="ts">
	import {NavListData} from '../interfaces';
	import Vue from '../wrapper/vue';

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
				},
				{
					icon: "settings_remote",
					name: "Faders"
				},
				{
					icon: "play_circle_filled",
					name: "FX"
				}
			]
		} as NavListData},
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
