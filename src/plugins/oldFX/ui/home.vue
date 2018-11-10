<template>
    <md-card md-with-hover>
        <md-card-header>
            Old FX port
        </md-card-header>
        <md-card-content>
            Plugin is initialized
        </md-card-content>
        <md-card-actions>
            <md-button @click="showDialog = true;">More Info</md-button>
        </md-card-actions>
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Details</md-dialog-title>
            <p class="dialogContent">
                This plugin ports over the effects from sploders101/ETC_EOS_Lights for the time being.
                These effects will eventually be phased out in favor of a custom effect designer, which will allow you to create your own.
            </p>
            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialog = false;">OK</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-card>
</template>

<script lang="ts">
    import Vue from '../../../ui/wrapper/vue';
    import {VueConstructor} from 'vue';
    export default Vue.extend({
        data: function() {
            return {
                showDialog: false
            }
        }
    });
</script>

<style lang="scss" scoped>
    .dialogContent {
        margin-left: 24px;
        margin-right: 24px;
    }
</style>
