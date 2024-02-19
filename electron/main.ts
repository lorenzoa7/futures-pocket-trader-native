import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

type Props = {
  url: string
  isTestnetAccount: boolean
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  body?: BodyInit
  apiKey?: string
}

ipcMain.handle(
  'request',
  async <T>(
    _: IpcMainInvokeEvent,
    { url, apiKey, isTestnetAccount, method, body }: Props,
  ) => {
    const baseUrl = isTestnetAccount
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': apiKey ?? '',
      },
      body,
    }

    try {
      const response = await fetch(`${baseUrl}${url}`, config)
      if (!response.ok) {
        throw new Error(
          JSON.stringify({
            status: response.status,
            body: await response.text(),
          }),
        )
      }
      const data = (await response.json()) as T
      return { data, ok: true }
    } catch (error: unknown) {
      const errorBody = JSON.parse(
        (error as { message: string }).message as string,
      ).body as string

      const errorMessage = JSON.parse(errorBody).msg as string

      return { message: errorMessage, ok: false }
    }
  },
)

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'bitcoin-icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    resizable: false,
  })

  // Hide menu bar
  win.setMenuBarVisibility(false)

  // Open dev tools
  win.webContents.openDevTools()

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
