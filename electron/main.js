const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let nextServer;
let mainWindow;

const PORT = 3000;
const HOST = "127.0.0.1";

function getAppPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "app");
  }

  return path.join(__dirname, "..");
}

function startNextServer() {
  const appPath = getAppPath();

  const serverPath = path.join(
    appPath,
    ".next",
    "standalone",
    "server.js"
  );

  console.log("App path:", appPath);
  console.log("Next server path:", serverPath);

  nextServer = spawn(process.execPath, [serverPath], {
    cwd: path.dirname(serverPath),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      NODE_ENV: "production",
      PORT: String(PORT),
      HOSTNAME: HOST,
    },
    windowsHide: true,
  });

  nextServer.stdout.on("data", (data) => {
    console.log("Next.js:", data.toString());
  });

  nextServer.stderr.on("data", (data) => {
    console.error("Next.js error:", data.toString());
  });

  nextServer.on("error", (error) => {
    console.error("Failed to start Next.js:", error);
  });

  nextServer.on("exit", (code, signal) => {
    console.log("Next.js server stopped:", { code, signal });
  });
}

function waitForServer(callback) {
  let attempts = 0;
  const maxAttempts = 60;

  const check = () => {
    attempts++;

    const request = http.get(
      `http://${HOST}:${PORT}`,
      (response) => {
        response.resume();

        console.log("Next.js server is ready.");
        callback();
      }
    );

    request.on("error", () => {
      if (attempts >= maxAttempts) {
        console.error("Next.js server did not start.");

        if (mainWindow) {
          mainWindow.loadURL(
            `data:text/html,
            <html>
              <body style="font-family: Arial; padding: 40px;">
                <h1>KRIDAVIRASAT could not start</h1>
                <p>The Next.js server did not start correctly.</p>
                <p>Please check the Electron logs.</p>
              </body>
            </html>`
          );
        }

        return;
      }

      setTimeout(check, 500);
    });
  };

  check();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://${HOST}:${PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error(
      "Electron failed to load page:",
      errorCode,
      errorDescription
    );
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startNextServer();

  waitForServer(() => {
    createWindow();
  });
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
    nextServer = null;
  }
});
