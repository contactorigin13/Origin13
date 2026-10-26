import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("origin13-appearance");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.dataset["theme"] = saved;
      }
    } catch {
      // The switch still works when browser storage is unavailable.
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset["theme"] = next;
    try {
      localStorage.setItem("origin13-appearance", next);
    } catch {
      // Keep the selected appearance for this visit.
    }
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  return (
    <Button type="button" variant="ghost" size="icon" onClick={toggle}
      aria-label={label} title={label}
      className="shrink-0 rounded-full border border-border text-foreground">
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}