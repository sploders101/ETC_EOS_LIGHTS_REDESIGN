const {app,BrowserWindow} = require("electron");

app.on('ready', function() {
	require("vue-devtools").install();
	let win = new BrowserWindow();
	win.on('close',function () {
		win = null;
	})
	win.loadURL(`file://${__dirname}/ui/dist/index.html`);
});
