const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let nextServer;
let mainWindow;

function startNextServer() {
  const serverPath = path.join(__dirname, "..", ".next", "standalone", "server.js");

  nextServer = spawn(process.execPath, [serverPath], {
    cwd: path.join(__dirname, "..", ".next", "standalone"),
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "3000",
      HOSTNAME: "localhost",
    },
    shell: false,
  });

  nextServer.stdout.on("data", (data) => {
    console.log(`Next.js: ${data}`);
  });

  nextServer.stderr.on("data", (data) => {
    console.error(`Next.js error: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startNextServer();

  setTimeout(() => {
    createWindow();
  }, 2000);
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextServer) {
    nextServer.kill();
  }
});
