import { Badge } from "@/components/ui/badge";

interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface ResumeTemplateProps {
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export default function ResumeTemplate4({ skills, projects, certifications }: ResumeTemplateProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border p-6 rounded-lg shadow-sm min-h-[600px]">
      {/* Modern header */}
      <div className="text-center mb-8 relative">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">JD</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          John Doe
        </h2>
        <p className="text-purple-700 font-medium">Frontend Developer</p>
        <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-600">
          <span>john.doe@email.com</span>
          <span>•</span>
          <span>+91 9876543210</span>
          <span>•</span>
          <span>LinkedIn</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-bold text-purple-900 mb-3">Skills</h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    skill.level === "Advanced" ? "bg-purple-100 text-purple-800" :
                    skill.level === "Intermediate" ? "bg-pink-100 text-pink-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-bold text-purple-900 mb-3">Certifications</h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="border-l-3 border-pink-400 pl-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{cert.name}</h4>
                  <p className="text-xs text-purple-600">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-bold text-purple-900 mb-3">Projects</h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-purple-200 rounded-lg p-3">
                  <h4 className="font-bold text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}