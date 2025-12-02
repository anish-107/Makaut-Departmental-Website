/** AdminFooter.jsx
 * @author Anish
 * @description This is the Footer component for the admin panel
 * @date 2/12/2025
 * @returns a jsx component
 */

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full py-6"
      style={{ background: "#0a1628" }}
    >
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
          <p className="text-sm text-slate-400 text-center">
            © {currentYear} Department of Information Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}