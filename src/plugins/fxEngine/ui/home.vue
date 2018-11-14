<template>
    <md-card md-with-hover>
        <md-card-header>
            TempoKeeper FX Engine
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
                This plugin links with the FX renderer in order to sync effects with a tempo, rather than a pre-defined time.
                This allows changing the timing of effects on-the-fly, and better suits a live improvized environment.
            </p>
            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialog = false;">OK</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-card>
</template>

<script lang="ts">
    import Vue from 'vue';
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
