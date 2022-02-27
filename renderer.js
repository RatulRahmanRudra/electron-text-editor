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
    ipcRenderer.send("create-document-triggered")
  })


  el.openDocumentBtn.addEventListener("click", () => {
    ipcRenderer.send("open-document-triggered")
  })

  el.fileTextarea.addEventListener("input", (e) => {
    ipcRenderer.send("file-content-updated", e.target.value);
  });

  /*------------------------------------*/



  const handlDocument = (filePath, content = "") => {
    el.documentName.innerHTML = path.parse(filePath).base;
    el.fileTextarea.removeAttribute("disabled");
    el.fileTextarea.value = content;
    el.fileTextarea.focus();
  }

  ipcRenderer.on("document-created", (_, filePath) => {
    handlDocument(filePath);
  });

  ipcRenderer.on("document-opened", (_, {filePath, content}) => {
    handlDocument(filePath, content);
  });


 


});

