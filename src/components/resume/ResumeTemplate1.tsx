// Template 1: Premium Professional (Inspired by Novoresume)
import { Mail, Phone, MapPin, Linkedin, Github, Calendar, Award, BookOpen, GraduationCap, Briefcase, Trophy, Globe, User } from "lucide-react";

interface ResumeTemplate1Props {
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

export default function ResumeTemplate1({
  skills,
  projects,
  certifications,
  education,
  experience,
  achievements,
  publications,
  activities,
  userProfile,
}: ResumeTemplate1Props) {
  return (
    <div className="bg-white text-slate-800 p-12" style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Inter', sans-serif" }}>
      {/* Header Section */}
      <div className="border-b-2 border-primary pb-6 mb-8 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
            {userProfile.firstName || "Your"} {userProfile.lastName || "Name"}
          </h1>
          <p className="text-lg text-primary font-semibold">
            {userProfile.occupation || "Your Professional Title"}
          </p>
          {userProfile.bio && (
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed mt-3">
              {userProfile.bio}
            </p>
          )}
        </div>

        {/* Contact details */}
        <div className="text-xs space-y-2 text-slate-600 flex-shrink-0 text-right">
          {userProfile.email && (
            <p className="flex items-center justify-end gap-2">
              <span>{userProfile.email}</span>
              <Mail className="w-3.5 h-3.5 text-slate-400" />
            </p>
          )}
          {userProfile.phone && (
            <p className="flex items-center justify-end gap-2">
              <span>{userProfile.phone}</span>
              <Phone className="w-3.5 h-3.5 text-slate-400" />
            </p>
          )}
          {userProfile.location && (
            <p className="flex items-center justify-end gap-2">
              <span>{userProfile.location}</span>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
            </p>
          )}
          {userProfile.linkedin && (
            <p className="flex items-center justify-end gap-2">
              <span className="truncate max-w-[180px]">{userProfile.linkedin.replace('https://', '')}</span>
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
            </p>
          )}
          {userProfile.github && (
            <p className="flex items-center justify-end gap-2">
              <span className="truncate max-w-[180px]">{userProfile.github.replace('https://', '')}</span>
              <Github className="w-3.5 h-3.5 text-slate-400" />
            </p>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-3 gap-8">
        
        {/* Left Column (Skills, Languages, Certifications) */}
        <div className="space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b pb-1 mb-3">
                Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-xs">
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>{skill.name}</span>
                      <span className="text-slate-400 font-normal">{skill.level}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
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
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b pb-1 mb-3">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <h3 className="font-bold text-slate-800">{cert.name}</h3>
                    <p className="text-slate-500">{cert.issuer}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {userProfile.languages && userProfile.languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b pb-1 mb-3">
                Languages
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.languages.map((lang, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {userProfile.interests && userProfile.interests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase border-b pb-1 mb-3">
                Interests
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.interests.map((interest, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Work Experience, Education, Projects, Achievements) */}
        <div className="col-span-2 space-y-6">
          {/* Work Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b pb-1 mb-4 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                      <span className="text-slate-400 font-medium">{exp.duration}</span>
                    </div>
                    <p className="text-primary font-semibold mb-2">{exp.company}</p>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{exp.responsibilities}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b pb-1 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                      <span className="text-slate-400 font-medium">{edu.year}</span>
                    </div>
                    <p className="text-slate-700 font-semibold mb-1">{edu.institution}</p>
                    {edu.cgpa && (
                      <p className="text-slate-500 font-medium">CGPA / Grade: {edu.cgpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b pb-1 mb-4 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="text-xs">
                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">{project.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-2">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 border px-2 py-0.5 rounded text-[10px] font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b pb-1 mb-4 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-primary" />
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="text-xs">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-bold text-slate-900">{ach.title}</h3>
                      <span className="text-slate-400">{ach.date}</span>
                    </div>
                    <p className="text-slate-600">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b pb-1 mb-4 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-primary" />
                Publications
              </h2>
              <div className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id} className="text-xs">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-bold text-slate-900">{pub.title}</h3>
                      <span className="text-slate-400">{pub.date}</span>
                    </div>
                    <p className="text-slate-600">{pub.publisher}</p>
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-[10px] font-medium mt-1 inline-block">
                        View Publication
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {activities.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b pb-1 mb-4 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-primary" />
                Extracurricular Activities
              </h2>
              <div className="space-y-3">
                {activities.map((act) => (
                  <div key={act.id} className="text-xs">
                    <h3 className="font-bold text-slate-900">{act.title}</h3>
                    <p className="text-slate-700 font-semibold mt-0.5">{act.organization} • {act.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
