"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";

export default function LanguageSwitch() {
  const { changeLanguage, translations } = useContext(LanguageContext);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>{translations.changelanguage}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent slide="top">
          <DropdownMenuItem onClick={() => changeLanguage("ru")}>
            🇷🇺 Русский
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("en")}>
            🇺🇸 English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("ua")}>
            🇺🇦 Українська
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("br")}>
            🇧🇷 Brasileira
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("be")}>
            🇧🇾 Беларуская
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
