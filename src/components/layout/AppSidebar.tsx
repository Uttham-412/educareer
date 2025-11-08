import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Bell, 
  Calendar,
  GraduationCap,
  User
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Your career overview" 
  },
  { 
    title: "Timetable", 
    url: "/timetable", 
    icon: Calendar,
    description: "Smart schedule management" 
  },
  { 
    title: "Resume", 
    url: "/resume", 
    icon: FileText,
    description: "Build & download resume" 
  },
  { 
    title: "Opportunities", 
    url: "/opportunities", 
    icon: Briefcase,
    description: "Find internships & jobs" 
  },
  { 
    title: "Notifications", 
    url: "/notifications", 
    icon: Bell,
    description: "Latest updates" 
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-sidebar-accent transition-colors";
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sidebar-foreground">CareerPath</h2>
                <p className="text-xs text-muted-foreground">AI Career Assistant</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-4">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClasses(item.url)} flex items-center gap-3 px-3 py-3 rounded-lg`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs opacity-70 truncate">{item.description}</p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile at Bottom */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <NavLink 
            to="/student" 
            className={`${getNavClasses('/student')} flex items-center gap-3 p-2 rounded-lg transition-colors`}
          >
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground">Student</p>
                <p className="text-xs text-muted-foreground">Final Year</p>
              </div>
            )}
          </NavLink>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}