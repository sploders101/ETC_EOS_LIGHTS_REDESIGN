<template>
    <div class="fxClick">
        <div class="assign" @click="assignf()"></div>
        <div class="label" @click="setDefault()" :class="(defaultClick==click) ? ('green') : ('red')"><slot></slot></div>
        <div class="tap" @click="tap()"></div>
    </div>
</template>

<script lang="ts">
    import Vue from '../../../ui/wrapper/vue';
    import { VueConstructor } from 'vue';
import { ipcRenderer } from 'electron';
    export default Vue.extend({
        props: ["defaultClick","click","assign"],
        data: function() {
            return {

            }
        },
        methods: {
            setDefault: function() {
                ipcRenderer.send(`/fx/click/${this.click}/setDefault`);
            },
            tap: function() {
                ipcRenderer.send(`/fx/click/${this.click}/tap`);
            },
            assignf: function() {
                this.$emit("update:assign",this.click);
            }
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
        }
    }
</style>
