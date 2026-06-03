import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "secondary-border"
    | "outline"
    | "ghost"
    | "amber"
    | "emerald"
    | "danger"
    | "plain";

export type ButtonSize =
    | "sm"
    | "md"
    | "lg"
    | "icon-sm"
    | "icon-md"
    | "custom";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: string;
    iconPosition?: "left" | "right";
    loading?: boolean;
    loadingText?: string;
    children?: ReactNode;
}

export default function Button({
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    loading = false,
    loadingText,
    children,
    className = "",
    disabled,
    type = "button",
    ...props
}: ButtonProps) {
    // Styles mapping for different variants
    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
        secondary: "text-slate-600 hover:bg-slate-100 border border-transparent",
        "secondary-border": "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100",
        outline: "bg-white text-primary border border-primary/20 hover:border-primary hover:bg-primary/5",
        ghost: "text-slate-700 hover:bg-slate-200/50 border border-transparent",
        amber: "bg-amber-500 text-white hover:bg-amber-600",
        emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
        plain: "",
    };

    // Styles mapping for different sizes
    const sizeStyles: Record<ButtonSize, string> = {
        sm: "px-3 py-1.5 text-xs font-semibold rounded-md",
        md: "px-4 py-2 text-sm font-semibold rounded-lg",
        lg: "px-5 py-3 text-base font-bold rounded-lg",
        "icon-sm": "size-8 flex-shrink-0 rounded-lg",
        "icon-md": "size-10 flex-shrink-0 rounded-lg",
        custom: "",
    };

    // Determine icon size based on button size
    const iconSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

    const baseClasses = "inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none";
    const appliedVariant = variantStyles[variant];
    const appliedSize = sizeStyles[size];

    const hasChildren = !!children;
    const isIconOnly = !hasChildren && !!icon;

    // Render loading indicator or specified icon
    const renderIcon = () => {
        if (loading) {
            return (
                <span className={`material-symbols-outlined animate-spin ${iconSize}`}>
                    autorenew
                </span>
            );
        }
        if (icon) {
            return (
                <span className={`material-symbols-outlined ${iconSize}`}>
                    {icon}
                </span>
            );
        }
        return null;
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${baseClasses} ${appliedVariant} ${appliedSize} ${hasChildren ? "gap-2" : ""} ${className}`}
            {...props}
        >
            {iconPosition === "left" && renderIcon()}
            {loading && loadingText ? (
                <span>{loadingText}</span>
            ) : (
                children
            )}
            {iconPosition === "right" && !loading && renderIcon()}
        </button>
    );
}
