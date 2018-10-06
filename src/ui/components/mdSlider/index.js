import MdSlider from './mdSlider.vue';

export default function install(Vue) {
  Vue.component('md-slider', Vue.extend(MdSlider));
}
