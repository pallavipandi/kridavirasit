const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let nextServer = null;
let mainWindow = null;

const PORT = 3000;
const HOST = "127.0.0.1";

function getNextServerPath() {
  if (app.isPackaged) {
    return path.join(
      process.resourcesPath,
      "next-server",
      "server.js"
    );
  }

  return path.join(
    __dirname,
    "..",
    ".next",
    "standalone",
    "server.js"
  );
}

function getNextServerCwd() {
  if (app.isPackaged) {
    return path.join(
      process.resourcesPath,
      "next-server"
    );
  }

  return path.join(
    __dirname,
    "..",
    ".next",
    "standalone"
  );
}

function startNextServer() {
  const serverPath = getNextServerPath();
  const serverCwd = getNextServerCwd();

  console.log("=================================");
  console.log("KRIDAVIRASAT Electron");
  console.log("=================================");
  console.log("Packaged:", app.isPackaged);
  console.log("Server path:", serverPath);
  console.log("Server cwd:", serverCwd);

  nextServer = spawn(process.execPath, [serverPath], {
    cwd: serverCwd,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      NODE_ENV: "production",
      PORT: String(PORT),
      HOSTNAME: HOST
    },
    windowsHide: true
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
    console.log(
      "Next.js stopped.",
      "code:",
      code,
      "signal:",
      signal
    );
  });
}

function waitForServer() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 60;

    function check() {
      attempts++;

      const request = http.get(
        `http://${HOST}:${PORT}`,
        (response) => {
          response.resume();

          console.log("Next.js server is ready.");
          resolve();
        }
      );

      request.on("error", () => {
        if (attempts >= maxAttempts) {
          reject(
            new Error(
              "Next.js server did not start within the expected time."
            )
          );
          return;
        }

        setTimeout(check, 500);
      });

      request.setTimeout(1000, () => {
        request.destroy();
      });
    }

    check();
  });
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
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(`http://${HOST}:${PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error(
        "Electron failed to load page:",
        errorCode,
        errorDescription
      );
    }
  );

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    startNextServer();

    await waitForServer();

    createWindow();
  } catch (error) {
    console.error("KRIDAVIRASAT startup failed:", error);

    if (mainWindow) {
      mainWindow.loadURL(
        `data:text/html,
        <html>
          <body style="font-family:Arial;padding:40px">
            <h1>KRIDAVIRASAT could not start</h1>
            <p>Next.js server failed to start.</p>
            <p>Please check the application logs.</p>
          </body>
        </html>`
      );
    }
  }
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
    nextServer = null;
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
