// Template 2: Tech Industry Modern (Inspired by Canva)
import { Mail, Phone, MapPin, Linkedin, Github, Code2, Briefcase, Award, ExternalLink } from "lucide-react";

interface ResumeTemplate2Props {
  skills: Array<{ id: string; name: string; level: string }>;
  projects: Array<{ id: string; title: string; description: string; technologies: string[] }>;
  certifications: Array<{ id: string; name: string; issuer: string; date: string }>;
  education: Array<{ id: string; degree: string; institution: string; year: string; cgpa?: string }>;
  experience: Array<{ id: string; role: string; company: string; duration: string; responsibilities: string }>;
  achievements: Array<{ id: string; title: string; description: string; date: string }>;
  publications: Array<{ id: string; title: string; publisher: string; date: string; link?: string }>;
  activities: Array<{ id: string; title: string; organization: string; role: string }>;
  userProfile: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    occupation?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    photo?: string;
    objective?: string;
    languages?: string[];
    interests?: string[];
  };
}

export default function ResumeTemplate2({
  skills,
  projects,
  certifications,
  education,
  experience,
  achievements,
  publications,
  activities,
  userProfile,
}: ResumeTemplate2Props) {
  return (
    <div className="bg-gray-50 flex" style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Poppins', sans-serif" }}>
      {/* Left Sidebar - Dark Theme */}
      <div className="w-2/5 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-8">
        {/* Photo */}
        {userProfile.photo && (
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl blur-sm opacity-75" />
              <img
                src={userProfile.photo}
                alt="Profile"
                className="relative w-full aspect-square rounded-2xl object-cover border-4 border-gray-700"
              />
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-cyan-400" />
            <h3 className="text-sm font-bold tracking-wider text-cyan-400">CONTACT</h3>
          </div>
          <div className="space-y-3 text-sm">
            {userProfile.email && (
              <div className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white transition-colors break-all">
                  {userProfile.email}
                </span>
              </div>
            )}
            {userProfile.phone && (
              <div className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {userProfile.phone}
                </span>
              </div>
            )}
            {userProfile.location && (
              <div className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {userProfile.location}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Links Section */}
        {(userProfile.linkedin || userProfile.github) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-cyan-400" />
              <h3 className="text-sm font-bold tracking-wider text-cyan-400">LINKS</h3>
            </div>
            <div className="space-y-3 text-sm">
              {userProfile.linkedin && (
                <div className="flex items-start gap-3 group">
                  <Linkedin className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300 group-hover:text-white transition-colors break-all">
                    {userProfile.linkedin.replace('https://', '')}
                  </span>
                </div>
              )}
              {userProfile.github && (
                <div className="flex items-start gap-3 group">
                  <Github className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300 group-hover:text-white transition-colors break-all">
                    {userProfile.github.replace('https://', '')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-cyan-400" />
              <h3 className="text-sm font-bold tracking-wider text-cyan-400">SKILLS</h3>
            </div>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                    <span className="text-xs text-cyan-400 font-semibold">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full"
                      style={{
                        width:
                          skill.level === "Advanced"
                            ? "95%"
                            : skill.level === "Intermediate"
                            ? "75%"
                            : "55%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-cyan-400" />
              <h3 className="text-sm font-bold tracking-wider text-cyan-400">CERTIFICATIONS</h3>
            </div>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="border-l-2 border-cyan-400 pl-3">
                  <h4 className="text-sm font-semibold text-white leading-tight">{cert.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{cert.issuer}</p>
                  <p className="text-xs text-cyan-400 mt-1">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content - Light Theme */}
      <div className="flex-1 bg-white p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 leading-tight">
            {userProfile.firstName || "Your"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              {userProfile.lastName || "Name"}
            </span>
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
            <p className="text-xl text-gray-700 font-semibold">
              {userProfile.occupation || "Your Professional Title"}
            </p>
          </div>
        </div>

        {/* About Section */}
        {userProfile.bio && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
            </div>
            <p className="text-gray-700 leading-relaxed pl-9">{userProfile.bio}</p>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-gray-900">Projects & Experience</h2>
            </div>
            <div className="space-y-6 pl-9">
              {projects.map((project, index) => (
                <div key={project.id} className="relative">
                  {/* Card Style */}
                  <div className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-cyan-500 p-5 rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm mb-3">
                      {project.description}
                    </p>
                    
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-full text-xs font-semibold border border-cyan-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
