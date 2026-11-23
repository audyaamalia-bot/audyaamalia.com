"use client";

/** Submit button that asks for confirmation before running its form's action (e.g. delete). */
export default function ConfirmButton({
  children,
  message = "Yakin mau hapus? Tindakan ini tidak bisa dibatalkan.",
  className = "mini",
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
