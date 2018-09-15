import { app, BrowserWindow } from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

app.on('ready', start);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

function start() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		fullscreen: true,
		show: false,
		frame: false
	});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};
