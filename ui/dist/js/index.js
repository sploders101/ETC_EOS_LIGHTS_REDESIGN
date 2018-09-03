global.Vue = require("vue/dist/vue");
let appRoot = require(`${__dirname}/components/app`);
let vMaterial = require("vue-material").default;
let vRouter = require("vue-router");

Vue.use(vMaterial);
Vue.use(vRouter);

// const router = new vRouter

window.addEventListener("load", function() {
	let app = new Vue({
		el: "#app",
		components: {
			app: appRoot
		},
		// router: router,
		template: "<app />",
		data: {

		}
	});
});
