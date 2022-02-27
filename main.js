require("electron-reloader")(module);
const {BrowserWindow, app, ipcMain} = require("electron");
const { dialog } = require("electron/main");
const path = require("path")
const fs = require("fs");


let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences:{
      preload: path.join(app.getAppPath(), "renderer.js"),
      nodeIntegration: true
    },
    frame: false,
    // titleBarStyle: "hiddenInset",
    
  })
  // mainWindow.webContents.openDevTools();
  // mainWindow.setMenuBarVisibility(false);
  // mainWindow.menuBarVisible = true;
  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);


ipcMain.on("create-document-triggered", async () => {
  try {
    const res = await dialog.showSaveDialog(mainWindow, {
      filters: [{name: "text files", extensions: ["txt"]}]
    });
    const {filePath} = res;

    fs.writeFile(filePath, "", (error) => {
      if(error){
        console.log(error);
      }else{
        mainWindow.webContents.send("document-created", filePath);
      }
    })
  } catch (error) {
    alert(error);
  }  
})

