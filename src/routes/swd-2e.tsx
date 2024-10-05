import { Upload, Download, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { H1, H2 } from "@/components/typography.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Swd2eApp() {
  const { t } = useTranslation("common");

  return (
    <>
      <div className={"flex flex-row justify-between items-end"}>
        <H1>{t("title.swd-2e")}</H1>
        <div className={"space-x-1"}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"}>
                  <Upload className={"h-[1.2rem] w-[1.2rem]"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className={"text-sm"}>{t("action.import")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"}>
                  <Download className={"h-[1.2rem] w-[1.2rem]"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className={"text-sm"}>{t("action.export")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"}>
                  <RotateCcw className={"h-[1.2rem] w-[1.2rem]"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className={"text-sm"}>{t("action.reset")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <H2>{t("subtitle.general")}</H2>
    </>
  );
}

export default Swd2eApp;
