import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'google';
    size?: 'sm' | 'md' | 'lg';
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
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

    const variants = {
        primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-white/10",
        secondary: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 shadow-lg",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
        google: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-sm"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
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
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : leftIcon ? (
                <span className="mr-2">{leftIcon}</span>
            ) : null}

            {children}

            {!isLoading && rightIcon && (
                <span className="ml-2">{rightIcon}</span>
            )}
        </motion.button>
    );
};

export default Button;
