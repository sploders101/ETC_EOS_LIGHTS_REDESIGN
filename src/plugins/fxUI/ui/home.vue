<template>
    <md-card md-with-hover>
        <md-card-header>
            FX LiveUI
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
                This plugin links with "TempoKeeper" and "Anime.js FX Renderer" in order to provide a simple UI for controlling a live production environment.
                This only adds a UI which acts as a remote for APIs exposed by other plugins
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
