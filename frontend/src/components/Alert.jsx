// -------------------------------------------------------------
// Simple reusable alert / toast component.
// Types:
//  - "success": green
//  - "error": red
//  - "info": blue
// -------------------------------------------------------------

function Alert({ type = "info", children }) {
  const base =
    "mb-3 px-4 py-2 rounded-lg text-sm border flex items-start gap-2";

  const variants = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  const icon = {
    success: "✓",
    error: "⚠",
    info: "ℹ",
  }[type];

  return (
    <div className={`${base} ${variants[type] || variants.info}`}>
      <span className="mt-[1px]">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export default Alert;
