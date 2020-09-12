const {app, BrowserWindow, Menu} = require('electron');

function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });

    const template = [
        {
            label: 'Window commands',
            submenu: [
                {
                    label: 'Quit',
                    click: () => {
                        app.quit();
                    },
                    accelerator: 'ESC'
                } 
            ]
        },
        {
            label: 'Toggle Developer',
            click: function() {
                win.webContents.toggleDevTools();
            }
        },
        //{
        //    label: 'Translate',
        //    click: function() {
        //        win.webContents.send('translate-input');
        //    },
        //    accelerator: 'Enter'
        //}
    ]

    const menu = Menu.buildFromTemplate(template);
    win.setMenu(menu);

    win.loadFile('./index.html');
    
}

app.on('ready', () => {createWindow()});

app.on('window-all-closed', () => {app.quit()});
