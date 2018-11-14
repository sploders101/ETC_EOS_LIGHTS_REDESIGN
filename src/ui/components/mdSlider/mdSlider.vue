<template>
    <input type="range" class="mdSlider">
</template>

<script lang="ts">
    import Vue from 'vue';
    import {VueConstructor} from 'vue';
    export default Vue.extend({
        
    });
</script>

<style lang="scss" scoped>
    .mdSlider {
        // &::-webkit-slider-runnable-track {

        // }
        &::-webkit-slider-thumb {
            width: 1em;
            height: 1em;
            border-radius: 0.5em;
            background-color: red;
        }
    }
    
</style>
