import { Download, RotateCcw, Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";

type ActionButtonsProps = {
  onImport?: (buffer: ArrayBuffer) => void;
  onExport?: () => ArrayBuffer;
  onReset?: () => void;
};

function ActionButtons({ onImport, onExport, onReset }: ActionButtonsProps) {
  const { t } = useTranslation("common");
  const [importedFilename, setImportedFilename] = useState("");

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleImportClick = () => {
    hiddenFileInput.current?.click();
  };
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      console.error("e.target.files is null");
      return;
    }

    const targetFile = e.target.files[0];
    const reader = new FileReader();
    setImportedFilename(targetFile.name);

    reader.onload = (e) => {
      if (e.target === null) {
        console.error("e.target is null");
        return;
      }

      const buffer = e.target.result;
      if (!(buffer instanceof ArrayBuffer)) {
        console.error("buffer is not an instance of ArrayBuffer");
        return;
      }

      onImport?.(buffer);
    };
    reader.readAsArrayBuffer(targetFile);
  };

  const handleExport = () => {
    const buf = onExport?.();
    if (buf === undefined) {
      return;
    }

    const href = URL.createObjectURL(new Blob([buf]));
    const link = document.createElement("a");
    link.href = href;
    link.download = importedFilename || "unknown.save";
    link.click();
  };

  return (
    <div className={"space-x-1"}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} onClick={handleImportClick}>
              <Upload className={"h-[1.2rem] w-[1.2rem]"} />
              <input hidden={true} type={"file"} ref={hiddenFileInput} onChange={handleImport} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className={"text-sm"}>{t("action.import")}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} disabled={importedFilename.length === 0} onClick={handleExport}>
              <Download className={"h-[1.2rem] w-[1.2rem]"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className={"text-sm"}>{t("action.export")}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"ghost"} onClick={onReset}>
              <RotateCcw className={"h-[1.2rem] w-[1.2rem]"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className={"text-sm"}>{t("action.reset")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ActionButtons;
