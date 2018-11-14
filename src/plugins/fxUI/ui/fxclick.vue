<template>
    <div class="fxClick">
        <div class="assign" @click="assignf()">
            <div v-if="assign==click"></div>
        </div>
        <div class="label" @click="setDefault()" :class="(defaultClick==click) ? ('green') : ('red')"><slot></slot></div>
        <div class="tap" @click="tap('click')" @touchstart="tap('touch',$event)">
            <div :style="{opacity: state}"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { VueConstructor } from 'vue';
    import { ipcRenderer } from 'electron';
    export default Vue.extend({
        props: ["defaultClick","click","assign"],
        data: function() {
            return {
                state: 0
            }
        },
        methods: {
            setDefault: function() {
                ipcRenderer.send(`/fx/click/${this.click}/setDefault`);
            },
            tap: function(type:string,e?:Event) {
                if(type=="touch") e!.preventDefault();
                ipcRenderer.send(`/fx/click/${this.click}/tap`);
            },
            assignf: function() {
                if(this.click==this.assign) {
                    this.$emit("update:assign", false);
                } else {
                    this.$emit("update:assign",this.click);
                }
            }
        },
        mounted: function() {
            ipcRenderer.on(`/fxui/click/${this.click}/state`,(_:any, num:number) => {
                this.state = -Math.abs(num-1)+1;
            });
        }
    });
</script>

<style lang="scss" scoped>
    .fxClick {
        display: grid;
        grid-template-columns: [assign] 20% [end-assign] 5% [label] 50% [end-label] 5% [tap] 20% [end-tap];
        grid-template-rows: [top] 100% [bottom];
        height: 5em;
        margin: 0.5em;

        .assign {
            background-color: #616161;
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
        .label {
            grid-area: top / label / bottom / end-label;
            font-size: 2em;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .green {
            background-color: #2E7D32; // green, 800
        }
        .red {
            background-color: #C62828; // red, 800
        }
        .tap {
            background-color: #616161;
            grid-area: top / tap / bottom / end-tap;

            display: flex;
            justify-content: center;
            align-items: center;

            div {
                width: 30%;
                height: 30%;
                border-radius: 50%;
                background-color: white;
            }
        }
    }
</style>
