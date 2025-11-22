// Template 3: Executive Premium (Inspired by Zety)
import { Mail, Phone, MapPin, Linkedin, Github, Award, TrendingUp, Target } from "lucide-react";

interface ResumeTemplate3Props {
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

export default function ResumeTemplate3({
  skills,
  projects,
  certifications,
  education,
  experience,
  achievements,
  publications,
  activities,
  userProfile,
}: ResumeTemplate3Props) {
  return (
    <div className="bg-white" style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Merriweather', serif" }}>
      {/* Elegant Header */}
      <div className="relative bg-gradient-to-r from-amber-50 via-white to-amber-50 px-12 py-10 border-b-4 border-amber-600">
        <div className="flex items-start gap-8">
          {/* Photo with Elegant Frame */}
          {userProfile.photo && (
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-amber-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-amber-600" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-amber-600" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-amber-600" />
                
                <img
                  src={userProfile.photo}
                  alt="Profile"
                  className="w-36 h-36 object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          )}
          
          {/* Header Content */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {userProfile.firstName || "Your"} {userProfile.lastName || "Name"}
            </h1>
            <div className="h-1 w-32 bg-amber-600 mb-3" />
            <p className="text-xl text-gray-700 font-semibold mb-4 tracking-wide">
              {userProfile.occupation || "Your Professional Title"}
            </p>
            
            {/* Contact Bar */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              {userProfile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>{userProfile.email}</span>
                </div>
              )}
              {userProfile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
              {userProfile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>{userProfile.location}</span>
                </div>
              )}
            </div>
            
            {/* Social Links */}
            {(userProfile.linkedin || userProfile.github) && (
              <div className="flex gap-6 mt-3 text-sm text-gray-600">
                {userProfile.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-amber-600" />
                    <span className="truncate max-w-xs">{userProfile.linkedin.replace('https://', '')}</span>
                  </div>
                )}
                {userProfile.github && (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-amber-600" />
                    <span className="truncate max-w-xs">{userProfile.github.replace('https://', '')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-12 py-8">
        {/* Executive Summary */}
        {userProfile.bio && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Executive Summary
              </h2>
            </div>
            <div className="border-l-4 border-amber-600 pl-6">
              <p className="text-gray-700 leading-relaxed text-justify italic">
                {userProfile.bio}
              </p>
            </div>
          </div>
        )}

        {/* Core Competencies */}
        {skills.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Core Competencies
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-amber-50 border-l-4 border-amber-600 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">{skill.name}</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                      {skill.level}
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
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

        {/* Professional Experience */}
        {projects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Professional Experience
              </h2>
            </div>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div key={project.id} className="relative">
                  {/* Timeline */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-200">
                    <div className="absolute top-2 -left-2 w-5 h-5 rounded-full bg-amber-600 border-4 border-white" />
                  </div>
                  
                  <div className="ml-8 bg-gradient-to-br from-white to-amber-50 border border-amber-200 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                      {project.description}
                    </p>
                    
                    {project.technologies.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">
                          Key Technologies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white text-amber-800 rounded border border-amber-300 text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Awards */}
        {certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Certifications & Awards
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-xs text-amber-700 mt-2 font-semibold">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Elegant Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />
    </div>
  );
}
