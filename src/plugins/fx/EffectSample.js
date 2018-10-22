let e = require("electron");
e.ipcRenderer.send("/anime/timeline/new", {
	name: "test2",
	linkToSubs: true,
	common: {
		targets: {
			sub56: 0,
			sub57: 0,
			sub59: 0,
			sub60: 1
		},
		easing: 'easeInOutQuint',
		duration: 900,
		loop: true
	},
	objects: [
		{
			sub56: 1,
			sub57: 0,
			sub59: 0,
			sub60: 0
		},
		{
			sub56: 0,
			sub57: 0,
			sub59: 1,
			sub60: 0
		},
		{
			sub56: 0,
			sub57: 1,
			sub59: 0,
			sub60: 0
		},
		{
			sub56: 0,
			sub57: 0,
			sub59: 0,
			sub60: 1
		}
	]
});