import { useState, useEffect } from "react";

export default function Toast({ id, message, type = "success", onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [id]);

  // Colores y iconos según el tipo
  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-800",
      icon: "✓",
      iconColor: "text-green-600"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-800",
      icon: "✕",
      iconColor: "text-red-600"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-800",
      icon: "ℹ",
      iconColor: "text-blue-600"
    }
  };

  const style = styles[type] || styles.success;

  return (
    <div
      className={`
        mb-3 p-4 rounded-lg border-l-4 flex items-start gap-3 shadow-lg
        transition-all duration-300 transform
        ${style.bg} ${style.border} ${style.text}
        ${isExiting ? "opacity-0 translate-x-96" : "opacity-100 translate-x-0"}
      `}
    >
      {/* Icon */}
      <div className={`shrink-0 text-xl font-bold ${style.iconColor} mt-0.5`}>
        {style.icon}
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`shrink-0 text-lg font-bold opacity-60 hover:opacity-100 transition-opacity ${style.iconColor}`}
      >
        ✕
      </button>
    </div>
  );
}