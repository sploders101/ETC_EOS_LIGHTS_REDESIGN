<template>
    <md-card md-with-hover>
			<md-card-header>
				OSCPort Settings
			</md-card-header>
			<md-card-content>
				<md-field>
					<label>Interface IP (0.0.0.0 for all)</label>
					<md-input :disabled="!status.receivedSettings" v-model="config.localAddress"></md-input>
				</md-field>
				<md-field>
					<label>Local Port</label>
					<md-input :disabled="!status.receivedSettings" v-model="config.localPort"></md-input>
				</md-field>
				<md-button @click="submit" :disabled="!status.receivedSettings" class="md-raised md-primary">Save</md-button>
			</md-card-content>
		</md-card>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {VueConstructor} from 'vue';
	import {ipcRenderer} from 'electron';
	import { oscCfg } from 'oscPlugin';

    export default Vue.extend({
        data: () => {return {
            config: {
				localAddress: "",
				localPort: 0
            } as oscCfg,
            status: {
                receivedSettings: false
            }
		}},
		methods: {
			submit: function() {
				ipcRenderer.send("/config/set","oscPort",this.config);
			}
		},
		mounted: function() {
			ipcRenderer.on("/config/get/safe/oscPort/ui/oscPort",(_:any,settings:oscCfg) => {
				this.config = settings;
				this.status.receivedSettings = true;
			});
			ipcRenderer.send("/config/get/safe","oscPort/ui","oscPort");
		}
	});
</script>

<style lang="scss" scoped>
	
</style>
