var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 2, stdin */\n.md-field[_v-2cd5b495] {\n  margin-top: 0; }\n\n/* line 5, stdin */\ndiv.root[_v-2cd5b495] {\n  background-color: orange;\n  color: white;\n  display: block; }\n")












module.exports = {
	data: function() {
		return {
			test: "Hello World!"
		};
	},
	components: {

	}
};

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div class=\"root\" _v-2cd5b495=\"\">\n\t<div _v-2cd5b495=\"\">{{test}}</div>\n\t<md-field _v-2cd5b495=\"\">\n\t\t<label _v-2cd5b495=\"\">Testing</label>\n\t\t<md-input v-model=\"test\" _v-2cd5b495=\"\"></md-input>\n\t</md-field>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 2, stdin */\n.md-field[_v-2cd5b495] {\n  margin-top: 0; }\n\n/* line 5, stdin */\ndiv.root[_v-2cd5b495] {\n  background-color: orange;\n  color: white;\n  display: block; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-2cd5b495", module.exports)
  } else {
    hotAPI.update("_v-2cd5b495", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}