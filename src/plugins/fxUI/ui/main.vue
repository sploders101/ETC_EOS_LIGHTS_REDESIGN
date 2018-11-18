<template>
    <div class="fxUI">
        <div class="effects">
            <fx-toggle v-for="effect in effects" :key="effect.name" :assign.sync="assignMode" :effect="effect.name" :enabled.sync="effect.state">{{ effect.displayName }}</fx-toggle>
        </div>
        <div class="clicks">
            <div class="defaultclick" @click="assignDefaultClick()" @dblclick="assignAllDefaultClick()">
                <div class="name">
                    Default
                </div>
                <div class="assign" v-if="assignMode=='default'"><div></div></div>
            </div>
            <fx-click v-for="click in clicks" :key="click.name" :defaultclick="defaultclick" :click="click.name" :assign.sync="assignMode" :default.sync="click.state">{{ click.displayName }}</fx-click>
        </div>
        <div class="secondaryClicks"></div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
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
                assignMode: false as boolean | string,
                defaultclick: "" as string
            }
        },
        methods: {
            assignDefaultClick: function() {
                if(this.assignMode=="default") {
                    this.assignMode = false;
                } else {
                    this.assignMode = "default";
                }
            },
            assignAllDefaultClick: function() {
                this.assignMode = false;
                this.effects.forEach((fx) => {
                    ipcRenderer.send(`/fx/${fx.name}/use`,"default");
                });
            }
        },
        mounted: function() {
            ipcRenderer.on("/fxui/register", (_:any, fxD:fxUIDescriptor) => {
                this.effects.push(fxD);
            });
            ipcRenderer.on("/fxui/click/register", (_:any, clickD:fxUIDescriptor) => {
                this.clicks.push(clickD);
            });
            ipcRenderer.on("/fx/click/default",(_:any, defaultFX:string) => {
                this.defaultclick = defaultFX;
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
        grid-template-columns: [fx-start] calc( 100% - 27em ) [clicks-start] 27em [all-end];
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

    .defaultclick {
        display: grid;
        grid-template-columns: [assign] 20% [end-assign] 5% [label] 50% [end-label] 5% [tap] 20% [end-tap];
        grid-template-rows: [top] 100% [bottom];
        height: 5em;
        margin: 0.5em;
        background-color: #616161;

        div.name {
            grid-area: top / assign / bottom / end-tap;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 2em;
        }
        div.assign {
            grid-area: top / assign / bottom / end-assign;
            display: flex;
            align-items: center;
            justify-content: center;

            div {
                width: 30%;
                height: 30%;
                border-radius: 50%;
                background-color: white;
            }
        }
    }
</style>
