// Main process. Starts forks and facilitates communication

const {app,BrowserWindow} = require("electron");
const {fork} = require("child_process");

let main, live;

app.on('ready', function() {
	// Init main process
	main = fork(`${__dirname}/main/index.js`);

	// Init live window
	require("vue-devtools").install();
	let win = new BrowserWindow();
	win.on('close',function () {
		win = null;
	})
	win.loadURL(`file://${__dirname}/ui/dist/index.html`);
});
