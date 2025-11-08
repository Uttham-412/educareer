import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, BellRing, CheckCircle, Briefcase, Award, Calendar, Settings } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "opportunity" | "application" | "certification" | "reminder";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New Job Opening Matches Your Profile!",
    description: "Senior Frontend Developer at TechCorp - 95% match based on your skills",
    type: "opportunity",
    read: false,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Application Update",
    description: "Your application for Backend Intern at StartupXYZ is under review",
    type: "application",
    read: false,
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    title: "Certification Reminder",
    description: "Complete your React.js course by this Friday to earn certificate",
    type: "reminder",
    read: true,
    timestamp: "1 day ago",
  },
  {
    id: "4",
    title: "New Internship Opportunities",
    description: "3 new remote internships added matching your frontend skills",
    type: "opportunity",
    read: true,
    timestamp: "2 days ago",
  },
  {
    id: "5",
    title: "Certificate Earned!",
    description: "Congratulations! You've earned JavaScript Algorithms certification",
    type: "certification",
    read: true,
    timestamp: "3 days ago",
  },
  {
    id: "6",
    title: "Interview Scheduled",
    description: "Video interview with TechCorp scheduled for March 25, 2024 at 2:00 PM",
    type: "application",
    read: false,
    timestamp: "1 week ago",
  },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case "opportunity":
      return <Briefcase className="w-5 h-5 text-primary" />;
    case "application":
      return <Calendar className="w-5 h-5 text-accent-internship" />;
    case "certification":
      return <Award className="w-5 h-5 text-accent-certification" />;
    case "reminder":
      return <Bell className="w-5 h-5 text-warning" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
}

function getNotificationBadge(type: string) {
  switch (type) {
    case "opportunity":
      return "bg-primary text-primary-foreground";
    case "application":
      return "bg-accent-internship text-white";
    case "certification":
      return "bg-accent-certification text-white";
    case "reminder":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function Notifications() {
  const [notificationList, setNotificationList] = useState(notifications);
  
  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const groupedNotifications = {
    today: notificationList.filter(n => n.timestamp.includes("hour")),
    yesterday: notificationList.filter(n => n.timestamp.includes("1 day")),
    older: notificationList.filter(n => n.timestamp.includes("day") && !n.timestamp.includes("1 day") || n.timestamp.includes("week")),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your career opportunities and progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} size="sm" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Real-time Updates Banner */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <BellRing className="w-5 h-5 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Real-time Updates Enabled</h3>
              <p className="text-sm text-muted-foreground">
                Get instant notifications via email and WhatsApp when new opportunities match your profile
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <div className="space-y-6">
        {/* Today */}
        {groupedNotifications.today.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-foreground">Today</h2>
            <div className="space-y-2">
              {groupedNotifications.today.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? "border-primary/50 bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`text-xs ${getNotificationBadge(notification.type)}`}>
                              {notification.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.timestamp}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Yesterday */}
        {groupedNotifications.yesterday.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-foreground">Yesterday</h2>
            <div className="space-y-2">
              {groupedNotifications.yesterday.map((notification) => (
                <Card 
                  key={notification.id} 
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-medium text-muted-foreground">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`text-xs ${getNotificationBadge(notification.type)}`}>
                              {notification.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Older */}
        {groupedNotifications.older.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-foreground">Earlier</h2>
            <div className="space-y-2">
              {groupedNotifications.older.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? "border-primary/50 bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`text-xs ${getNotificationBadge(notification.type)}`}>
                              {notification.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {notificationList.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">
              We'll notify you when new opportunities match your profile
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}