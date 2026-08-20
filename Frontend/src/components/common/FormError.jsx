export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <span className="text-red-500 text-xl">⚠️</span>
      <p className="text-red-600 text-sm font-medium">
        {message}
      </p>
    </div>
  );
}