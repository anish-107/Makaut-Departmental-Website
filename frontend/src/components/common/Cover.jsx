/**
 * @author Anish
 * @description Cover Section
 * @date 30-11-2025
 * @returns JSX Component
 */

import CoverImg from "@/assets/common/cover.jpg";

export default function Cover() {
  return (
    <section className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Cover Image */}
      <img
        src={CoverImg}
        alt="Department of Information Technology"
        className="w-full h-full object-cover"
      />
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(10, 22, 40, 0.4) 0%, rgba(10, 22, 40, 0.7) 100%)",
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg" style={{ color: "#ffffff" }}>
          Department of Information Technology
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl drop-shadow-md" style={{ color: "#e2e8f0" }}>
          Empowering the future through technology and innovation
        </p>

        {/* Decorative line */}
        <div
          className="mt-6 h-1 w-24 rounded-full"
          style={{
            background: "linear-gradient(90deg, #0891b2, #3b82f6)",
          }}
        />
      </div>
    </section>
  )
}
