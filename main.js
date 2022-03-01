require("electron-reloader")(module);
const {BrowserWindow, app, ipcMain, ipcRenderer, Notification} = require("electron");
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
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    frame: false,
    // titleBarStyle: "hiddenInset",
    
  })
  mainWindow.loadFile("index.html");
  
  // mainWindow.minimize();
}

app.whenReady().then(createWindow);


const handleError = (error) => {
  new Notification({
    title: "Error",
    body: error
  })
}




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
    handleError(error)
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
        handleError(error);
      }else{
        mainWindow.webContents.send("document-opened", {filePath, content});
      }
    })

  } catch (error) {
    handleError(error)
  }
});


ipcMain.on("file-content-updated", (_, textAereaContent) => {
  fs.writeFile(currentFilePath, textAereaContent, (error) => {
    if(error){
      handleError(error);
    }
  })
})


ipcMain.on("minimize-triggered", () => {
  mainWindow.minimize();
})

ipcMain.on("maximize-triggered", () => {
  if(!mainWindow.isMaximized()){
    mainWindow.maximize();
  }else   mainWindow.restore();
  ;
  // console.log(mainWindow.isMaximized())
  
})

ipcMain.on("close-triggered", () => {
  mainWindow.close();
})




