import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";

import { Icons } from "@/components/icons.tsx";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/theme-provider.tsx";

function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation("common");
  const { theme, setTheme } = useTheme();

  const handleSelectionChange = (value: string) => {
    navigate(value);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const games = ["swd-2e", "pal"];
  const selectedGame = location.pathname.split("/")[1];

  useEffect(() => {
    if (games.includes(selectedGame)) {
      document.title = t(`title.${selectedGame}`);
    } else {
      document.title = "Retro";
    }
  });

  return (
    <div>
      <header className={"flex h-16 border-b px-48"}>
        <nav className={"flex flex-row grow gap-2 items-center"}>
          <Link to={"/"}>Retro</Link>
          <div className={"grow"} />
          <Select onValueChange={handleSelectionChange} value={games.includes(selectedGame) ? selectedGame : ""}>
            <SelectTrigger className={"w-[180px]"}>
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"swd-2e"}>{t("title.swd-2e")}</SelectItem>
              <SelectItem value={"pal"}>{t("title.pal")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Link
            className={buttonVariants({ variant: "outline", size: "icon" })}
            to={"https://github.com/chehsunliu/retro"}
          >
            <Icons.github className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Link>
        </nav>
      </header>
      <main className={"px-48 py-6"}>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;
