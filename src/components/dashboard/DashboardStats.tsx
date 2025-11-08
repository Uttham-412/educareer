import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Briefcase, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className={`text-xs ${trendColor} flex items-center gap-1`}>
          {trend === "up" && <TrendingUp className="w-3 h-3" />}
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    {
      title: "Certifications Completed",
      value: "0",
      change: "Start your first certification",
      icon: <Award className="w-4 h-4" />,
      trend: "neutral" as const,
    },
    {
      title: "Applications Sent",
      value: "0",
      change: "Ready to apply?",
      icon: <Briefcase className="w-4 h-4" />,
      trend: "neutral" as const,
    },
    {
      title: "Profile Strength",
      value: "25%",
      change: "Complete your profile",
      icon: <Target className="w-4 h-4" />,
      trend: "neutral" as const,
    },
  ]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          // Calculate profile strength based on user data
          let profileStrength = 0;
          if (user.firstName) profileStrength += 25;
          if (user.lastName) profileStrength += 25;
          if (user.phone) profileStrength += 15;
          if (user.occupation) profileStrength += 15;
          if (user.location) profileStrength += 10;
          if (user.skills && user.skills.length > 0) profileStrength += 10;

          setStats([
            {
              title: "Certifications Completed",
              value: "0",
              change: "Start your first certification",
              icon: <Award className="w-4 h-4" />,
              trend: "neutral" as const,
            },
            {
              title: "Applications Sent",
              value: "0",
              change: "Ready to apply?",
              icon: <Briefcase className="w-4 h-4" />,
              trend: "neutral" as const,
            },
            {
              title: "Profile Strength",
              value: `${profileStrength}%`,
              change: profileStrength < 100 ? "Complete your profile" : "Profile complete!",
              icon: <Target className="w-4 h-4" />,
              trend: profileStrength >= 80 ? "up" as const : "neutral" as const,
            },
          ]);

        } catch (error) {
          console.error('Error calculating user stats:', error);
        }
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <div className="grid grid-cols-3 w-full">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}