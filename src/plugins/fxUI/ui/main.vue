<template>
    <div class="fxUI">
        <div class="effects">
            <fx-toggle v-for="effect in effects" :key="effect.fxName" :effect="effect.fxName" :enabled.sync="effect.state">{{ effect.displayName }}</fx-toggle>
        </div>
        <div class="clicks"></div>
        <div class="secondaryClicks"></div>
    </div>
</template>

<script lang="ts">
    import Vue from '../../../ui/wrapper/vue';
    import { VueConstructor } from 'vue';
    import { ipcRenderer } from 'electron';
    import { fxDescriptor } from './typings';
    export default Vue.extend({
        components: {
            fxToggle: require("./fxtoggle"),
            fxClick: require("./fxclick")
        },
        data: function() {
            return {
                effects: [] as fxDescriptor[]
            }
        },
        mounted: function() {
            ipcRenderer.on("/fxui/register", (_:any, fxD:fxDescriptor) => {
                this.effects.push(fxD);
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
    }

    .effects {
        grid-area: fx-start / fx-start / secondary-clicks-start / clicks-start;
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
    }
</style>
