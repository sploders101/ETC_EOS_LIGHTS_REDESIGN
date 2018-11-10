<template>
    <md-card md-with-hover>
			<md-card-header>
				OSCPort Settings
			</md-card-header>
			<md-card-content>
				<md-field>
					<label>Interface IP (find for autoconfig)</label>
					<md-input :disabled="!status.receivedSettings" v-model="osc.port.localAddress"></md-input>
				</md-field>
				<md-field>
					<label>Local Port</label>
					<md-input :disabled="!status.receivedSettings" v-model="osc.port.localPort"></md-input>
				</md-field>
				<md-field>
					<label>Remote Address</label>
					<md-input :disabled="!status.receivedSettings" v-model="osc.port.remoteAddress"></md-input>
				</md-field>
				<md-field>
					<label>Remote Port</label>
					<md-input :disabled="!status.receivedSettings" v-model="osc.port.remotePort"></md-input>
				</md-field>
				<md-field>
					<label>Faders to sync</label>
					<md-input :disabled="!status.receivedSettings" v-model.number="osc.faders"></md-input>
				</md-field>
				<md-button @click="submit" class="md-raised md-primary">Save</md-button>
			</md-card-content>
		</md-card>
</template>

<script lang="ts">
	import Vue from '../../../ui/wrapper/vue';
	import {VueConstructor} from 'vue';
	import {oscCfg} from '../typings/interfaces';
	import {ipcRenderer} from 'electron';

    export default Vue.extend({
        data: () => {return {
            osc: {
                port: {
                    localAddress: "",
                    localPort: 0,
                    remoteAddress: "",
                    remotePort: 0
                },
                faders: 0
            } as oscCfg,
            status: {
                receivedSettings: false
            }
		}},
		methods: {
			submit: function() {
				ipcRenderer.send("/settings/etcElement/update/save",this.osc);
			}
		},
		mounted: function() {
			ipcRenderer.on("/config/get/etcElement",(_:any,settings:oscCfg) => {
				this.osc = settings;
				this.status.receivedSettings = true;
			});
			ipcRenderer.send("/etcElement/getConfig");
		}
	});
</script>

<style lang="scss" scoped>
	
</style>
