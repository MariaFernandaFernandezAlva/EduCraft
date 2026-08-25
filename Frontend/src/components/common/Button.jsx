import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 cursor-pointer";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg"
  };
 
  const variantStyles = {
    primary: "group bg-amarillo text-azul hover:bg-amarillo/80 hover:shadow-lg",
    secondary: "text-white border border-white hover:bg-white/20",
    tertiary: "bg-teal-500 text-white hover:bg-teal-600 hover:shadow-lg"
  };
 
  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
 
  return (
    <button className={combinedStyles} {...props}>
      {children}
      {variant === "primary" && (
        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth="2"/>
      )}
    </button>
  );
}