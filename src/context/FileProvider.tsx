import { useState } from "react";
import { FileContext } from "./FileContext";

type FileType = {
  name: string;
  path?: string;
};

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [newFiles, setNewFiles] = useState<FileType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <FileContext.Provider value={{ files, setFiles, newFiles, setNewFiles, isProcessing, setIsProcessing }}>
      {children}
    </FileContext.Provider>
  );
};