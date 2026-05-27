import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { ipcMain, dialog } from 'electron';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEBUG = process.env.DEBUG === 'true';

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
        },
    });

    win.setMinimumSize(1000, 700);
    win.removeMenu();
    win.loadFile(path.join(__dirname, '../dist/index.html'));

    if (DEBUG) {
        win.webContents.openDevTools();
    }
}

//
// 📁 HANDLE: Select Folder
//
ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });

    if (result.canceled) return [];

    const folderPath = result.filePaths[0];

    const files = fs.readdirSync(folderPath).map(file => ({
        name: file,
        path: path.join(folderPath, file),
    }));

    return files;
});

//
// 📄 HANDLE: Select File
//
ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
    });

    if (result.canceled) return [];

    return result.filePaths.map(filePath => ({
        name: path.basename(filePath),
        path: filePath,
    }));
});

//
//  Rename Files
//

ipcMain.handle('rename-files', async (_, files, newFiles) => {
    try {
        const sanitize = (name) => {
            return name
                .replace(/[\\/:*?"<>|]/g, ' ') 
                .replace(/\s+/g, ' ')          
                .trim();
        };

        files.forEach((file, index) => {
            const dir = path.dirname(file.path);
            const extension = path.extname(file.path);

            // get ONLY the name (remove extension if user added one)
            const rawName = path.parse(newFiles[index].name).name;

            const safeName = sanitize(rawName);

            // fallback to avoid empty filename
            const finalName = safeName || 'unnamed';

            const newName = finalName + extension;
            const newPath = path.join(dir, newName);

            fs.renameSync(file.path, newPath);
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
});

app.whenReady().then(createWindow);