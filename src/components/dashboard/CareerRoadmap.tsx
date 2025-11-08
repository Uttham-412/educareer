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

function getStepColor(type: string) {
  switch (type) {
    case "certification":
      return "bg-accent-certification text-white";
    case "internship":
      return "bg-accent-internship text-white";
    case "job":
      return "bg-accent-job text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function CareerRoadmap() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Your Career Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {roadmapSteps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            {/* Status Icon */}
            <div className="flex flex-col items-center">
              {step.status === "completed" ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : step.status === "current" ? (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                </div>
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
              
              {index < roadmapSteps.length - 1 && (
                <div className="w-px h-8 bg-border mt-2"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium ${
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
                  className={`text-xs ${getStepColor(step.type)}`}
                >
                  {step.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}