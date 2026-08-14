import { useContext } from "react";
import Toast from "./Toast";
import { ToastContext } from "../../context/ToastContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm pointer-events-auto">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}