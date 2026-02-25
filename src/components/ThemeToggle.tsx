import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evitar erro de hidratação (hydration mismatch)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-8 h-8 rounded-full bg-secondary/50 animate-pulse" />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-all duration-300 group overflow-hidden"
            aria-label="Alternar tema"
        >
            <div className="relative z-10">
                {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-500 group-hover:rotate-45" />
                ) : (
                    <Moon className="w-5 h-5 text-zinc-900 transition-transform duration-500 group-hover:-rotate-12" />
                )}
            </div>

            {/* Micro-animação de fundo */}
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out transform ${isDark ? "scale-0 group-hover:scale-100 bg-yellow-500/10" : "scale-0 group-hover:scale-100 bg-zinc-900/10"
                }`} />
        </button>
    );
};

export default ThemeToggle;
