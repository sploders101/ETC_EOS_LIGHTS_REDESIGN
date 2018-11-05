<template>
    <div class="fxUI">
        <div class="effects">
            <fx-toggle v-for="effect in effects" :key="effect.name" :assign.sync="assignMode" :effect="effect.name" :enabled.sync="effect.state">{{ effect.displayName }}</fx-toggle>
        </div>
        <div class="clicks">
            <div class="defaultClick" @click="assignDefaultClick()">Default</div>
            <fx-click v-for="click in clicks" :key="click.name" :click="click.name" :assign.sync="assignMode" :default.sync="click.state">{{ click.displayName }}</fx-click>
        </div>
        <div class="secondaryClicks"></div>
    </div>
</template>

<script lang="ts">
    import Vue from '../../../ui/wrapper/vue';
    import { VueConstructor } from 'vue';
    import { ipcRenderer } from 'electron';
    import { fxUIDescriptor } from './typings';
    export default Vue.extend({
        components: {
            fxToggle: require("./fxtoggle"),
            fxClick: require("./fxclick")
        },
        data: function() {
            return {
                effects: [] as fxUIDescriptor[],
                clicks: [] as fxUIDescriptor[],
                assignMode: false as boolean | string
            }
        },
        methods: {
            assignDefaultClick: function() {
                this.assignMode = "default";
            }
        },
        mounted: function() {
            ipcRenderer.on("/fxui/register", (_:any, fxD:fxUIDescriptor) => {
                this.effects.push(fxD);
            });
            ipcRenderer.on("/fxui/click/register", (_:any, clickD:fxUIDescriptor) => {
                this.clicks.push(clickD);
            });
            ipcRenderer.send("/fxui/mounted");
        }
    });
</script>

<style lang="scss" scoped>
    .fxUI {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: [fx-start] 80% [clicks-start] 20% [all-end];
        // grid-template-rows: [fx-start] 80% [secondary-clicks-start] 20% [all-end];
        grid-template-rows: [fx-start] 100% [secondary-clicks-start] 0% [all-end];
        user-select: none;
        cursor: default;
    }

    .effects {
        grid-area: fx-start / fx-start / secondary-clicks-start / clicks-start;
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
    }

    .defaultClick {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.5em;
        margin: 0.25em;
        background-color: #616161;
        font-size: 2em;
    }
</style>
