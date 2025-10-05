import { useTheme } from "next-themes";
import { HiOutlineSun, HiMoon } from "react-icons/hi2";
const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed  w-full max-w-[1440px]  flex items-center z-10 border-b-[1px] border-gray-hot px-10 h-14    bg-background-base">
      <h4>Task Manager</h4>
      <button
        className="rounded-lg shadow-lg w-12 h-12 flex items-center justify-center ml-auto"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      >
        {theme === "light" ? (
          <HiMoon className="w-8 h-8 text-blue-950" />
        ) : (
          <HiOutlineSun className="w-8 h-8 text-amber-400" />
        )}
      </button>
    </header>
  );
};

export default Header;
