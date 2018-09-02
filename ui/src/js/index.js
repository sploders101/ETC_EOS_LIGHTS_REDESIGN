global.Vue = require("vue/dist/vue.js");
let appRoot = require(`${__dirname}/components/app`);
let vMaterial = require("vue-material");

Vue.use(vMaterial.default);

window.addEventListener("load", function() {
	let app = new Vue({
		el: "#app",
		components: {
			app: appRoot
		},
		template: "<app />",
		data: {

		}
	});
});
