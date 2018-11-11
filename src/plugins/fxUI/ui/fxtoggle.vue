<template>
    <div class="fxToggle" :class="[(enabled ? 'fxActive':'fxInactive')]" @click="toggleEffect()">
        <slot></slot>
        <div class="click">{{clickName}}</div>
    </div>
</template>

<script lang="ts">
    import Vue from '../../../ui/wrapper/vue';
    import { VueConstructor } from 'vue';
    import { ipcRenderer } from 'electron';
    export default Vue.extend({
        props: ["effect", "enabled","assign"],
        data: function() {
            return {
                clickName: "default"
            }
        },
        mounted: function() {
            ipcRenderer.on(`/fx/${this.effect}/using`,(_:any, clickName:string) => {
                this.clickName = clickName;
            });
            ipcRenderer.send(`/fx/${this.effect}/getClick`);
        },
        methods: {
            toggleEffect: function() {
                if(this.assign) {
                    ipcRenderer.send(`/fx/${this.effect}/use`,this.assign);
                    this.$emit("update:assign",false);
                } else {
                    if(this.enabled) {
                        ipcRenderer.send(`/anime/${this.effect}/stop`);
                        this.$emit('update:enabled', false);
                    } else {
                        ipcRenderer.send(`/anime/${this.effect}/play`);
                        this.$emit('update:enabled', true);                    
                    }
                }
            }
        }
    });
</script>

<style lang="scss" scoped>
    .fxToggle {
        display: inline-flex;
        flex-flow: column nowrap;
        align-items: center;
        align-content: center;
        padding: 1.5em;
        margin: 1em;
        font-size: 1.5em;

        div.click {
            font-size: 0.5em;
        }
    }

    .fxActive {
        background-color: #2E7D32; // green, 800
        color: white;
    }
    .fxInactive {
        background-color: #C62828; // red, 800
        color: white;
    }
</style>
