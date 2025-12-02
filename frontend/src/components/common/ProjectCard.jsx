/**
 * @author Anish
 * @description Project card component (Airforce blue theme)
 * @date 30-11-2025 (updated)
 * @returns a JSX component
 */

export default function ProjectCard({
  projectName,
  technology,
  supervisor,
  team,
  projectLink = "https://www.google.com/",
  image = "/project1.png",
}) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fbfd 100%)",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(148, 163, 184, 0.5)",
        boxShadow: "0 10px 40px -10px rgba(15, 23, 42, 0.15)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        width: "100%",
        maxWidth: "380px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 20px 50px -10px rgba(56, 189, 248, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 40px -10px rgba(15, 23, 42, 0.15)";
      }}
    >
      {/* Project Image */}
      <div
        style={{
          position: "relative",
          height: "180px",
          overflow: "hidden",
        }}
      >
        <img
          src={image || "/placeholder.svg"}
          alt={projectName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.src = "/technology-project-screenshot.jpg";
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background:
              "linear-gradient(to top, rgba(248, 250, 252, 1) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: "1.5rem" }}>
        {/* Project Name */}
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#0f1c2c",
            marginBottom: "1rem",
            fontFamily: "Georgia, serif",
          }}
        >
          {projectName}
        </h3>

        {/* Technology Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {technology.map((tech, index) => (
            <span
              key={index}
              style={{
                background: "rgba(6, 182, 212, 0.12)",
                color: "#0369a1",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: "500",
                border: "1px solid rgba(6, 182, 212, 0.35)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Supervisor */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Supervisor:{" "}
          </span>
          <span
            style={{
              color: "#f59e0b",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
          >
            {supervisor}
          </span>
        </div>

        {/* Team */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Team:{" "}
          </span>
          <span style={{ color: "#0f1c2c", fontSize: "0.875rem" }}>
            {team.join(", ")}
          </span>
        </div>

        {/* Project Link Button */}
        <a
          href={projectLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            color: "#ffffff",
            padding: "0.625rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          View Project
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </div>
  );
}
