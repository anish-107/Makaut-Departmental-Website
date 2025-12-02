/**
 * @author Anish
 * @description Floating footer for the landing page (Airforce blue theme)
 * @date 30-11-2025 (updated)
 * @returns JSX Component
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#e6f0f7] border-t border-[#c7d7e2] py-6">
      {/* Top gradient separator */}
      <div
        className="w-full h-0.5"
        style={{
          background: "linear-gradient(90deg, #0891b2, #3b82f6, #0891b2)",
        }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <p className="text-sm text-[#58677a] text-center">
            © {currentYear} Department of Information Technology. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
