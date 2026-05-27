import type { FileType } from './types/types'; // adjust path if needed

export {};

declare global {
    interface Window {
        electronAPI: {
            selectFolder: () => Promise<FileType[]>;
            selectFile: () => Promise<FileType[]>;
            renameFiles: (
              files: FileType[],
              newFiles: { name: string }[]
            ) => Promise<{ success: boolean; error?: unknown }>;
        };
    }
}