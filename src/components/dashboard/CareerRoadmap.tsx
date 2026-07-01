import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  type: "certification" | "internship" | "job";
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: "1",
    title: "Complete Core Certifications",
    description: "Frontend development, Data Structures, React.js",
    status: "completed",
    type: "certification",
  },
  {
    id: "2",
    title: "Apply for Summer Internships",
    description: "Target 10-15 companies in your domain",
    status: "current",
    type: "internship",
  },
  {
    id: "3",
    title: "Build Portfolio Projects",
    description: "3-4 industry-relevant projects to showcase skills",
    status: "current",
    type: "certification",
  },
  {
    id: "4",
    title: "Secure Full-time Position",
    description: "Apply to target companies with strong profile",
    status: "upcoming",
    type: "job",
  },
];

interface CareerRoadmapProps {
  currentYear?: number;
}

function getStepColor(type: string) {
  switch (type) {
    case "certification":
      return "bg-accent-certification/10 text-accent-certification border border-accent-certification/20";
    case "internship":
      return "bg-accent-internship/10 text-accent-internship border border-accent-internship/20";
    case "job":
      return "bg-accent-job/10 text-accent-job border border-accent-job/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function CareerRoadmap({ currentYear = 4 }: CareerRoadmapProps) {
  const roadmapSteps: RoadmapStep[] = [
    {
      id: "1",
      title: "Complete Core Certifications",
      description: "Frontend development, Data Structures, React.js",
      status: currentYear >= 2 ? "completed" : "current",
      type: "certification",
    },
    {
      id: "2",
      title: "Build Portfolio Projects",
      description: "3-4 industry-relevant projects to showcase skills",
      status: currentYear >= 3 ? "completed" : currentYear === 2 ? "current" : "upcoming",
      type: "certification",
    },
    {
      id: "3",
      title: "Apply for Summer Internships",
      description: "Target 10-15 companies in your domain",
      status: currentYear >= 4 ? "completed" : currentYear === 3 ? "current" : "upcoming",
      type: "internship",
    },
    {
      id: "4",
      title: "Secure Full-time Position",
      description: "Apply to target companies with strong profile",
      status: currentYear >= 4 ? "current" : "upcoming",
      type: "job",
    },
  ];

  return (
    <Card className="h-full border border-border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          Your Career Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {roadmapSteps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            {/* Status Icon */}
            <div className="flex flex-col items-center">
              {step.status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-success fill-success/10 shrink-0" />
              ) : step.status === "current" ? (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground"></div>
                </div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              
              {index < roadmapSteps.length - 1 && (
                <div className={`w-0.5 h-10 mt-2 ${step.status === "completed" ? "bg-success/35" : "bg-border"}`}></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className={`font-semibold text-sm ${
                  step.status === "completed" 
                    ? "text-success" 
                    : step.status === "current"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}>
                  {step.title}
                </h4>
                <Badge 
                  variant="secondary" 
                  className={`text-[10px] px-2 py-0.5 ${getStepColor(step.type)}`}
                >
                  {step.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}