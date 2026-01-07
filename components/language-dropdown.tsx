"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type LanguageOption = {
  code: string;
  label: string;
  short: string;
  flag: string;
};

type LanguageDropdownProps = {
  languages: LanguageOption[];
  language: string;
  onChange: (code: string) => void;
  align?: "start" | "end";
  fullWidth?: boolean;
};

const LanguageDropdown = ({
  languages,
  language,
  onChange,
  align = "end",
  fullWidth = false,
}: LanguageDropdownProps) => {
  const activeLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  if (!activeLanguage) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`group inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground/80 shadow-sm transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            fullWidth ? "w-full justify-between" : ""
          }`}
          aria-label="Tilni tanlash"
        >
          <span className="flex items-center gap-2">
            <span className="text-base leading-none">
              {activeLanguage.flag}
            </span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={`w-48 rounded-md border-border bg-background p-1 shadow-lg ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {languages.map((lang) => {
          const isActive = lang.code === language;
          return (
            <DropdownMenuItem
              key={lang.code}
              className={`cursor-pointer rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-100! hover:text-black! ${
                isActive ? "bg-muted/60 text-foreground" : ""
              }`}
              onSelect={() => onChange(lang.code)}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="ml-2 flex-1">{lang.label}</span>
              {isActive ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
