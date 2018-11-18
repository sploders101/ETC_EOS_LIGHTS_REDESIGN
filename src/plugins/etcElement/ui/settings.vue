<template>
    <md-card md-with-hover>
			<md-card-header>
				etcElement Settings
			</md-card-header>
			<md-card-content>
				<md-field>
					<label>Remote Address</label>
					<md-input :disabled="!status.receivedSettings" v-model="config.OSCAddress"></md-input>
				</md-field>
				<md-field>
					<label>Remote Port</label>
					<md-input :disabled="!status.receivedSettings" v-model="config.OSCPort"></md-input>
				</md-field>
				<md-field>
					<label>Faders to sync</label>
					<md-input :disabled="!status.receivedSettings" v-model.number="config.OSCFaders"></md-input>
				</md-field>
				<md-button @click="submit" :disabled="!status.receivedSettings" class="md-raised md-primary">Save</md-button>
			</md-card-content>
		</md-card>
</template>

<script lang="ts">
	import Vue from 'vue';
	import {VueConstructor} from 'vue';
	import {ipcRenderer} from 'electron';
	import {ETCConfig} from '../typings/config';

    export default Vue.extend({
        data: () => {return {
            config: {
				OSCAddress: "",
				OSCPort: 0,
				OSCFaders: 0
            } as ETCConfig,
            status: {
                receivedSettings: false
            }
		}},
		methods: {
			submit: function() {
				ipcRenderer.send("/config/set","etcElement",this.config);
			}
		},
		mounted: function() {
			ipcRenderer.on("/config/get/safe/etcElement/ui/etcElement",(_:any,settings:ETCConfig) => {
				this.config = settings;
				this.status.receivedSettings = true;
			});
			ipcRenderer.send("/config/get/safe","etcElement/ui","etcElement");
		}
	});
</script>

<style lang="scss" scoped>
	
</style>
