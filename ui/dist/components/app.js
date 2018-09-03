var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 2, stdin */\n.md-field[_v-23b1ea56] {\n  margin-top: 0; }\n\n/* line 6, stdin */\ndiv.root[_v-23b1ea56] {\n  background-color: orange; }\n")














module.exports = {
	data: function() {
		return {
			text: ""
		};
	},
	components: {

	}
};

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"root\" _v-23b1ea56=\"\">\n\t<md-field _v-23b1ea56=\"\">\n\t\t<label _v-23b1ea56=\"\">Testing</label>\n\t\t<md-input v-model=\"text\" _v-23b1ea56=\"\"></md-input>\n\t</md-field>\n\t<div _v-23b1ea56=\"\">\n\t\t{{text}}\n\t</div>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 2, stdin */\n.md-field[_v-23b1ea56] {\n  margin-top: 0; }\n\n/* line 6, stdin */\ndiv.root[_v-23b1ea56] {\n  background-color: orange; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-23b1ea56", module.exports)
  } else {
    hotAPI.update("_v-23b1ea56", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}