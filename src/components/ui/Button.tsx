import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'google' | 'glow';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-accent via-[#8e44ad] to-accent-hover text-white shadow-[0_0_20px_rgba(112,0,255,0.3)] hover:shadow-[0_0_30px_rgba(112,0,255,0.5)] border border-white/10",
        secondary: "bg-surface-100 backdrop-blur-md text-neutral-200 border border-white/10 hover:border-white/30 hover:text-white hover:bg-surface-200 shadow-lg shadow-black/20",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        ghost: "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5",
        google: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm",
        glow: "bg-accent/10 border border-accent/50 text-accent-glow hover:bg-accent/20 hover:shadow-[0_0_25px_rgba(112,0,255,0.6)] hover:border-accent"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs uppercase tracking-wider",
        md: "px-6 py-3 text-sm tracking-wide",
        lg: "px-8 py-4 text-base tracking-widest uppercase",
        xl: "px-10 py-5 text-xl tracking-widest uppercase"
    };

    const width = fullWidth ? "w-full" : "";

    return (
        <motion.button
            whileHover={!disabled && !isLoading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Shine Effect for Primary Buttons */}
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-10"></div>
            )}

            {isLoading ? (
                <div className="flex items-center gap-2 relative z-20">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 relative z-20">
                    {leftIcon && <span>{leftIcon}</span>}
                    {children}
                    {rightIcon && <span>{rightIcon}</span>}
                </div>
            )}
        </motion.button>
    );
};

export default Button;
