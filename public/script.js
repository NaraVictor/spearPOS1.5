const { ipcRenderer } = require("electron");
const ipc = ipcRenderer;

// CLOSE BTN
const closebtn = document.getElementById("closebtn");
const maxbtn = document.getElementById("maxbtn");
const minbtn = document.getElementById("minbtn");

closebtn.addEventListener("click", () => {
	ipc.send("closeApp");
	console.log("close btn clicked");
});

minbtn.addEventListener("click", () => {
	ipc.send("minApp");
});

maxbtn.addEventListener("click", () => {
	ipc.send("maxRestoreApp");
});
