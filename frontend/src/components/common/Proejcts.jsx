/**
 * @author Anish
 * @description Projects component for the landing page (Airforce blue theme)
 * @date 30-11-2025 (updated)
 * @returns a JSX component
 */

import ProjectCard from "./ProjectCard";
import Project1 from "@/assets/Common/project1.jpg";
import Project2 from "@/assets/Common/project1.png";
import Project3 from "@/assets/Common/project1.jpg";

const highlightedProjects = [
  {
    projectName: "Lipspeak : An End to End Deep Learning Model",
    technology: ["Tensorflow", "Next JS", "Python"],
    supervisor: "Ms. Sayani Manna",
    team: ["Anish Kumar","Arpan Haldar" ,"Bidipta Barua", "Dibyasmita Hati"],
    projectLink: "https://github.com/anish-107/LipSpeak",
    image: Project1,
    description:
      "An deep learning model for visual speech recognition.",
  },
  {
    projectName: "AI-Powered Health Diagnosis",
    technology: ["Cybersecurity", "Artificial Intelligence", "React"],
    supervisor: "Dr. Michael Chen",
    team: ["Rupam Bhadra", "Antika Halder", "Deep Ghosh", "Srijeeb Naskar"],
    projectLink: "https://github.com/example/phising",
    image: Project2,
    description:
      "AI Based phising detection.",
  },
];

export default function Projects() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #e6f0f7 0%, #dbe7f0 50%, #e6f0f7 100%)",
        padding: "4rem 0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        {/* Section Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(245, 158, 11, 0.12)",
              color: "#b45309",
              padding: "0.375rem 1rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: "600",
              marginBottom: "1rem",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            Student Excellence
          </span>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#0f1c2c",
              marginBottom: "0.5rem",
              fontFamily: "Georgia, serif",
            }}
          >
            Highlighted Projects
          </h2>
          <p
            style={{
              color: "#3f4c5d",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Discover the innovative work of our talented students pushing the
            boundaries of technology.
          </p>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #f59e0b, #06b6d4)",
              margin: "1rem auto 0",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Projects List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
          }}
        >
          {highlightedProjects.map((project, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                gap: "2.5rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Project Card */}
              <div style={{ flex: "0 0 auto" }}>
                <ProjectCard
                  projectName={project.projectName}
                  technology={project.technology}
                  supervisor={project.supervisor}
                  team={project.team}
                  projectLink={project.projectLink}
                  image={project.image}
                />
              </div>

              {/* Project Description */}
              <div
                style={{
                  flex: "1 1 350px",
                  minWidth: "280px",
                }}
              >
                <div
                  style={{
                    background: "rgba(248, 250, 252, 0.95)",
                    borderRadius: "16px",
                    padding: "2rem",
                    border: "1px solid rgba(148, 163, 184, 0.4)",
                    position: "relative",
                  }}
                >
                  {/* Project number badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "1.5rem",
                      background:
                        "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                      color: "#ffffff",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "0.875rem",
                      boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#0f1c2c",
                      marginBottom: "1rem",
                      marginTop: "0.5rem",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    About This Project
                  </h3>

                  <p
                    style={{
                      color: "#3f4c5d",
                      fontSize: "1rem",
                      lineHeight: "1.75",
                      textAlign: "justify",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Decorative line */}
                  <div
                    style={{
                      marginTop: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, rgba(6, 182, 212, 0.6) 0%, transparent 100%)",
                      }}
                    />
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      style={{ opacity: 0.7 }}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.6) 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
