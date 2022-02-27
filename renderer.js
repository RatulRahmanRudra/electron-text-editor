const { ipcRenderer } = require("electron");
const path = require("path")


window.addEventListener("DOMContentLoaded", () => {
  const el = {
    createDocumentBtn: document.getElementById("createDocumentBtn"),
    openDocumentBtn: document.getElementById("openDocumentBtn"),
    documentName: document.getElementById("documentName"),
    fileTextarea: document.getElementById("fileTextarea"),
  }


  el.createDocumentBtn.addEventListener("click", () => {
    console.log('create document');
    ipcRenderer.send("create-document-triggered");
  })


  el.openDocumentBtn.addEventListener("click", () => {
    console.log('open document');
  })
  ipcRenderer.on("document-created", (_, filePath) => {
    el.documentName.innerHTML = path.parse(filePath).base;
    el.fileTextarea.removeAttribute("disabled");
    el.fileTextarea.focus();
  })
})



