import { createContext, useContext } from "react";

type FileType = {
  name: string;
  path?: string;
};

type FileContextType = {
  files: FileType[];
  setFiles: (files: FileType[]) => void;
  newFiles: FileType[];
  setNewFiles: (files: FileType[]) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
};

export const FileContext = createContext<FileContextType | null>(null);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used inside FileProvider");
  }
  return context;
};