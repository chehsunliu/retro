import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Root() {
  const navigate = useNavigate();
  const [selection, setSelection] = React.useState("");

  const handleSelectionChange = (value: string) => {
    setSelection(value);
    navigate(value);
  };

  const handleHomeClick = () => {
    setSelection("");
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
              <SelectItem value="/swd-2e">SWD2E</SelectItem>
              <SelectItem value="/pal">PAL</SelectItem>
            </SelectContent>
          </Select>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;
