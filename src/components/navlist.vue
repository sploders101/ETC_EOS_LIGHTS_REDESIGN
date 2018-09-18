<template>
	<md-drawer clipped :md-active="active" @update:mdActive="$emit('update:active',$event)">
		<md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

		<md-list>
			<router-link @click.native="$emit('update:active',false);" :to="{name: 'Home'}">
				<md-list-item>
						<md-icon>home</md-icon>
						<span class="md-list-item-text">Home</span>
				</md-list-item>
			</router-link>

			<router-link @click.native="$emit('update:active',false);" :to="{name: 'Settings'}">
				<md-list-item>
						<md-icon>settings</md-icon>
						<span class="md-list-item-text">Settings</span>
				</md-list-item>
			</router-link>

			<router-link @click.native="$emit('update:active',false);" :to="{name: 'Faders'}">
				<md-list-item>
						<md-icon>settings_remote</md-icon>
						<span class="md-list-item-text">Faders</span>
				</md-list-item>
			</router-link>

			<router-link @click.native="$emit('update:active',false);" :to="{name: 'FX'}">
				<md-list-item>
						<md-icon>play_circle_filled</md-icon>
						<span class="md-list-item-text">FX</span>
				</md-list-item>
			</router-link>
		</md-list>
	</md-drawer>
</template>

<script lang="ts">
	export default {
		props: ["active"]
	}
</script>

<style lang="scss">

</style>
