import { Moon, Sun } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/theme-provider.tsx";

function Root() {
  const navigate = useNavigate();
  const [selection, setSelection] = React.useState("");
  const { t } = useTranslation("common");
  const { theme, setTheme } = useTheme();

  const handleSelectionChange = (value: string) => {
    setSelection(value);
    navigate(value);
  };

  const handleHomeClick = () => {
    setSelection("");
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div>
      <header className={"flex h-16 border-b px-36"}>
        <nav className={"flex flex-row grow gap-6 items-center"}>
          <Link onClick={handleHomeClick} to={"/"}>
            Retro
          </Link>
          <div className={"grow"} />
          <Select onValueChange={handleSelectionChange} value={selection}>
            <SelectTrigger className={"w-[180px]"}>
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="/swd-2e">{t("title.swd-2e")}</SelectItem>
              <SelectItem value="/pal">{t("title.pal")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;
