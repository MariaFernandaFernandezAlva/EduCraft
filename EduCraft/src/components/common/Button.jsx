export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}) {
  const baseStyles = "font-semibold rounded-lg transition-all duration-300 cursor-pointer";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
 
  const variantStyles = {
    primary: "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg",
    secondary: "bg-white text-blue-900 border-2 border-blue-900 hover:bg-blue-50",
    tertiary: "bg-teal-500 text-white hover:bg-teal-600 hover:shadow-lg"
  };
 
  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
 
  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}