import { app,BrowserWindow,ipcMain } from 'electron';
import {init} from './plugins/loader';
// import {WindowState} from './interfaces';


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
	// beacon:if(!production)
	// Install devtools
	require("vue-devtools").install();
	// beacon:endif

	// Create the browser window.
	mainWindow = new BrowserWindow({
		show: false,
		frame: false,
		// transparent: true
	});
	init(mainWindow);

	// beacon:if(!production)
		mainWindow.show();
		mainWindow.setFullScreen(false);
		mainWindow.maximize();
	// beacon:endif
	ipcMain.once('/ui/mounted', function() {
		mainWindow.show();
		mainWindow.setFullScreen(false);
		mainWindow.maximize();
	});
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
	mainWindow.loadURL(`file://${__dirname}/ui/index.html`);

	// Emitted when the window is closed.
	// Typescript error when dereferencing, and the main window should always
	// be open unless closing the app
	// mainWindow.on('closed', () => {
	// 	mainWindow = null;
	// });

};

function sendWindowState(): void {
	mainWindow.webContents.send("windowState", {
		maximized: mainWindow.isMaximized(),
		minimized: mainWindow.isMinimized()
	});
}
