import React from "react";

interface LoadingSpinnerProps {
    className?: string;
    fullScreen?: boolean;
}

const LoadingSpinner = ({ className = "", fullScreen = false }: LoadingSpinnerProps) => {
    const containerClasses = fullScreen
        ? "min-h-[60vh] flex flex-col items-center justify-center w-full"
        : `flex flex-col items-center justify-center py-10 ${className}`;

    return (
        <div className={containerClasses}>
            <div className="relative overflow-hidden mb-6 px-4">
                <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary/80 via-foreground to-primary/80 animate-[shimmer_2.5s_ease-in-out_infinite] bg-[length:200%_auto] pb-1">
                    Angola <span className="text-primary italic font-serif opacity-90">sem filtros</span>
                </h2>
                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent w-full animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
            </div>

            <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1 uppercase tracking-wider text-xs">
                <span>A carregar</span>
                <span className="flex space-x-[2px] mt-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                </span>
            </p>
        </div>
    );
};

export default LoadingSpinner;
