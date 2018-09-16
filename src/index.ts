import { app,BrowserWindow,ipcMain } from 'electron';
import { enableLiveReload } from 'electron-compile';
import {WindowState} from './interfaces';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;

app.on('ready', start);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

function start() {
	const isDevMode = process.execPath.match(/[\\/]electron/);

	if(isDevMode) {
		// Install devtools
		require("vue-devtools").install();
		enableLiveReload();
	}

	// Create the browser window.
	mainWindow = new BrowserWindow({
		show: false,
		frame: false,
		// transparent: true
	});

	// ipcMain.once('done', function() {
		mainWindow.show();
		mainWindow.setFullScreen(false);
		mainWindow.maximize();
	// });
	ipcMain.on('window', function(_:any,action:string) {
		switch(action) {
			case 'minimize':
				if(mainWindow.isMinimized()) {
					mainWindow.restore();
				} else {
					mainWindow.minimize();
				}
				break;
			case 'maximize':
				if(mainWindow.isMaximized()) {
					mainWindow.unmaximize();
				} else {
					mainWindow.maximize();
				}
				break;
			case 'close':
				mainWindow.close();
				break;
		}
	});
	mainWindow.on('maximize', sendWindowState);
	mainWindow.on('unmaximize', sendWindowState);
	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		mainWindow = null;
	});

};

function sendWindowState(): void {
	mainWindow.webContents.send("windowState", {
		maximized: mainWindow.isMaximized(),
		minimized: mainWindow.isMinimized()
	});
}
