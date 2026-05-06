export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "open" | "in_progress" | "resolved" | "escalated" | "closed";
export type UserRole = "citizen" | "agent" | "supervisor" | "admin";
export type UserStatus = "active" | "inactive" | "pending";

export interface Complaint {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: Status;
  date: string;
  submittedBy?: string;  
  assignee?: string;     
  supervisor?: string;   
}

export interface StatsCardData {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  
  icon: React.ComponentType<any>;
  color: "blue" | "amber" | "green" | "red";
}

export interface NavItem {
  label: string;
  href: string;
  
  icon: React.ComponentType<any>;
  badge?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  count: number;
  resolved: number;
  avgResolutionDays: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  supervisorId?: string;
  assignedComplaints: number;
  resolvedComplaints: number;
  joinedDate: string;
  avatarInitials: string;
  avatarColor: string;
}
