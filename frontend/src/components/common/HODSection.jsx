/**
 * @author Anish
 * @description This is the HOD Section for the landing page
 * @date 30-11-2025
 * @returns a JSX component
 */

import "@/index.css";
import HodImage from '@/assets/Common/hod.jpg';

export default function HODSection({
  hodImage = HodImage,
  hodName = "DND - Definitely Not Debashish",
  hodTitle = "Head of Department, Information Technology",
  message = "Welcome to the Department of Information Technology. Our department is committed to nurturing the next generation of technology leaders through cutting-edge curriculum, hands-on research opportunities, and industry partnerships. We believe in fostering innovation, critical thinking, and ethical responsibility in all our students. Our faculty comprises distinguished researchers and industry experts who are dedicated to providing world-class education. Together, we strive to push the boundaries of technology and create solutions that make a meaningful impact on society.",
}) {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "4rem 0",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Section Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "0.5rem",
              fontFamily: "Georgia, serif",
            }}
          >
            Message from the HOD
          </h2>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
              margin: "0 auto",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Content */}
        <div
            className="hod-container"
            style={{
                display: "flex",
                flexDirection: "column",   // mobile default
                alignItems: "center",
                gap: "3rem",
            }}
        >
          {/* Left: Image */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "280px",
                height: "320px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                border: "3px solid rgba(6, 182, 212, 0.3)",
              }}
            >
              {/* Decorative corners */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(135deg, rgba(6, 182, 212, 0.4) 0%, transparent 100%)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(315deg, rgba(245, 158, 11, 0.4) 0%, transparent 100%)",
                  zIndex: 1,
                }}
              />
              <img
                src={hodImage || "/placeholder.svg"}
                alt={hodName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.src = "/professional-professor-portrait.png";
                }}
              />
            </div>

            {/* Name & Title */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: "0.25rem",
                  fontFamily: "Georgia, serif",
                }}
              >
                {hodName}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  maxWidth: "280px",
                }}
              >
                {hodTitle}
              </p>
            </div>
          </div>

          {/* Right: Message */}
          <div
            style={{
              flex: "1 1 400px",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
                borderRadius: "16px",
                padding: "2rem",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Quote icon */}
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1.5rem",
                  fontSize: "4rem",
                  color: "rgba(6, 182, 212, 0.15)",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1,
                }}
              >
                "
              </div>

              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "#e2e8f0",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  paddingTop: "2rem",
                  textAlign: "justify",
                }}
              >
                {message}
              </p>

              {/* Signature */}
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    background: "linear-gradient(90deg, #f59e0b, #06b6d4)",
                    borderRadius: "1px",
                  }}
                />
                <span
                  style={{
                    color: "#f59e0b",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {hodName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
