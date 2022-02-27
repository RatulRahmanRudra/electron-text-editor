require("electron-reloader")(module);
const {BrowserWindow, app, ipcMain, ipcRenderer} = require("electron");
const { dialog } = require("electron/main");
const path = require("path")
const fs = require("fs");


let mainWindow;
let currentFilePath;

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
    currentFilePath = filePath;
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


ipcMain.on("open-document-triggered", async () => {
  try {
    const res = await dialog.showOpenDialog(mainWindow, {
      filters: [{name: "text files", extensions: ["txt"]}]
    });
    const {filePaths} = res;
    const filePath = currentFilePath = filePaths[0];
    fs.readFile(filePath, "utf-8", (error, content) => {
      if(error){
        console.error(error);
      }else{
        mainWindow.webContents.send("document-opened", {filePath, content});
      }
    })

  } catch (error) {
    console.error(error)
  }
});


ipcMain.on("file-content-updated", (_, textAereaContent) => {
  fs.writeFile(currentFilePath, textAereaContent, (error) => {
    if(error){
      console.error(err);
    }
  })
})
