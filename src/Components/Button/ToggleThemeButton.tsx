import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "../ThemeProvider";

export default function ToggleThemeButton() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <>
      <button
        className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-200 lg:ml-2 "
        onClick={() => toggleDarkMode()}
      >
        {darkMode ? (
          <MoonIcon className="h-6 w-6 shrink-0" />
        ) : (
          <SunIcon className="h-6 w-6 shrink-0" />
        )}
      </button>
    </>
  );
}
