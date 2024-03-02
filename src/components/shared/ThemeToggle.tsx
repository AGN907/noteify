import { useTheme } from "@/providers/ThemeProvider";
import { PiMoonStars, PiSun } from "react-icons/pi";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      className="w-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? <PiMoonStars size={20} /> : <PiSun size={20} />}
    </Button>
  );
}
