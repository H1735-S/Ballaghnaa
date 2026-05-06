import type { Complaint, Category, User } from "@/types";

export const recentComplaints: Complaint[] = [
  { id: "CMP-1042", title: "Payment gateway timeout on checkout", category: "Billing", priority: "critical", status: "escalated", date: "2026-04-02" },
  { id: "CMP-1041", title: "Unable to reset account password", category: "Account", priority: "high", status: "open", date: "2026-04-02" },
  { id: "CMP-1040", title: "Dashboard charts not loading on Safari", category: "Technical", priority: "medium", status: "in_progress", date: "2026-04-01" },
  { id: "CMP-1039", title: "Incorrect invoice amount for March", category: "Billing", priority: "high", status: "open", date: "2026-04-01" },
  { id: "CMP-1038", title: "Email notifications delayed by 2+ hours", category: "Notifications", priority: "medium", status: "in_progress", date: "2026-03-31" },
  { id: "CMP-1037", title: "Export to CSV missing some columns", category: "Technical", priority: "low", status: "resolved", date: "2026-03-31" },
  { id: "CMP-1036", title: "Two-factor authentication not working", category: "Security", priority: "critical", status: "escalated", date: "2026-03-30" },
  { id: "CMP-1035", title: "Profile picture upload fails on mobile", category: "Account", priority: "low", status: "resolved", date: "2026-03-30" },
];

export const complaintsOverTime = [
  { month: "Oct", total: 42, resolved: 35 },
  { month: "Nov", total: 58, resolved: 44 },
  { month: "Dec", total: 47, resolved: 40 },
  { month: "Jan", total: 63, resolved: 51 },
  { month: "Feb", total: 71, resolved: 58 },
  { month: "Mar", total: 85, resolved: 67 },
  { month: "Apr", total: 38, resolved: 24 },
];

export const complaintsByCategory = [
  { category: "Billing", count: 34 },
  { category: "Technical", count: 28 },
  { category: "Account", count: 22 },
  { category: "Security", count: 15 },
  { category: "Notifications", count: 11 },
  { category: "Other", count: 8 },
];

export const statusDistribution = [
  { name: "Open", value: 31, color: "#3b82f6" },
  { name: "In Progress", value: 24, color: "#f59e0b" },
  { name: "Resolved", value: 67, color: "#22c55e" },
  { name: "Escalated", value: 12, color: "#ef4444" },
  { name: "Closed", value: 14, color: "#94a3b8" },
];

export const allComplaints: Complaint[] = [
  { id: "CMP-1042", title: "Payment gateway timeout on checkout", category: "Billing", priority: "critical", status: "escalated", date: "2026-04-02", assignee: "Sarah K." },
  { id: "CMP-1041", title: "Unable to reset account password", category: "Account", priority: "high", status: "open", date: "2026-04-02", assignee: "James R." },
  { id: "CMP-1040", title: "Dashboard charts not loading on Safari", category: "Technical", priority: "medium", status: "in_progress", date: "2026-04-01", assignee: "Lena M." },
  { id: "CMP-1039", title: "Incorrect invoice amount for March", category: "Billing", priority: "high", status: "open", date: "2026-04-01", assignee: "Sarah K." },
  { id: "CMP-1038", title: "Email notifications delayed by 2+ hours", category: "Notifications", priority: "medium", status: "in_progress", date: "2026-03-31", assignee: "Tom W." },
  { id: "CMP-1037", title: "Export to CSV missing some columns", category: "Technical", priority: "low", status: "resolved", date: "2026-03-31", assignee: "Lena M." },
  { id: "CMP-1036", title: "Two-factor authentication not working", category: "Security", priority: "critical", status: "escalated", date: "2026-03-30", assignee: "James R." },
  { id: "CMP-1035", title: "Profile picture upload fails on mobile", category: "Account", priority: "low", status: "resolved", date: "2026-03-30", assignee: "Tom W." },
  { id: "CMP-1034", title: "Subscription renewal charge failed", category: "Billing", priority: "high", status: "open", date: "2026-03-29", assignee: "Sarah K." },
  { id: "CMP-1033", title: "API rate limit exceeded unexpectedly", category: "Technical", priority: "medium", status: "in_progress", date: "2026-03-29", assignee: "Lena M." },
  { id: "CMP-1032", title: "Cannot delete old team members", category: "Account", priority: "low", status: "resolved", date: "2026-03-28", assignee: "Tom W." },
  { id: "CMP-1031", title: "Webhook events not firing on update", category: "Technical", priority: "high", status: "open", date: "2026-03-28", assignee: "James R." },
  { id: "CMP-1030", title: "Suspicious login from unknown location", category: "Security", priority: "critical", status: "escalated", date: "2026-03-27", assignee: "James R." },
  { id: "CMP-1029", title: "Report PDF export is blank", category: "Technical", priority: "medium", status: "resolved", date: "2026-03-27", assignee: "Lena M." },
  { id: "CMP-1028", title: "Duplicate charges on monthly plan", category: "Billing", priority: "high", status: "closed", date: "2026-03-26", assignee: "Sarah K." },
];

export const categories: Category[] = [
  { id: "cat-1", name: "Billing", description: "Payment, invoices, and subscription issues", color: "#3b82f6", count: 34, resolved: 22, avgResolutionDays: 2.1 },
  { id: "cat-2", name: "Technical", description: "Bugs, errors, and platform performance", color: "#8b5cf6", count: 28, resolved: 19, avgResolutionDays: 3.4 },
  { id: "cat-3", name: "Account", description: "Login, profile, and access management", color: "#06b6d4", count: 22, resolved: 18, avgResolutionDays: 1.8 },
  { id: "cat-4", name: "Security", description: "Unauthorized access and data concerns", color: "#ef4444", count: 15, resolved: 8, avgResolutionDays: 1.2 },
  { id: "cat-5", name: "Notifications", description: "Email, SMS, and push notification issues", color: "#f59e0b", count: 11, resolved: 9, avgResolutionDays: 2.7 },
  { id: "cat-6", name: "Other", description: "Miscellaneous and uncategorized issues", color: "#94a3b8", count: 8, resolved: 6, avgResolutionDays: 4.0 },
];

export const users: User[] = [
  { id: "usr-1", name: "Sarah Kim",    email: "sarah.kim@company.com", role: "supervisor", status: "active",   assignedComplaints: 18, resolvedComplaints: 14, joinedDate: "2024-01-15", avatarInitials: "SK", avatarColor: "bg-blue-500"    },
  { id: "usr-2", name: "James Rivera", email: "james.r@company.com",   role: "supervisor", status: "active",   assignedComplaints: 22, resolvedComplaints: 17, joinedDate: "2024-03-08", avatarInitials: "JR", avatarColor: "bg-violet-500"  },
  { id: "usr-3", name: "Lena Müller",  email: "lena.m@company.com",    role: "agent",      status: "active",   assignedComplaints: 15, resolvedComplaints: 13, joinedDate: "2024-05-20", avatarInitials: "LM", avatarColor: "bg-cyan-500"    },
  { id: "usr-4", name: "Tom Walsh",    email: "tom.walsh@company.com", role: "agent",      status: "active",   assignedComplaints: 11, resolvedComplaints: 10, joinedDate: "2024-07-01", avatarInitials: "TW", avatarColor: "bg-emerald-500" },
  { id: "usr-5", name: "Priya Nair",   email: "priya.n@company.com",   role: "citizen",    status: "active",   assignedComplaints: 0,  resolvedComplaints: 0,  joinedDate: "2025-01-10", avatarInitials: "PN", avatarColor: "bg-rose-500"    },
  { id: "usr-6", name: "Omar Hassan",  email: "omar.h@company.com",    role: "agent",      status: "inactive", assignedComplaints: 4,  resolvedComplaints: 4,  joinedDate: "2024-09-14", avatarInitials: "OH", avatarColor: "bg-amber-500"   },
  { id: "usr-7", name: "Chloe Dupont", email: "chloe.d@company.com",   role: "citizen",    status: "pending",  assignedComplaints: 0,  resolvedComplaints: 0,  joinedDate: "2026-03-28", avatarInitials: "CD", avatarColor: "bg-pink-500"    },
];

export const resolutionTrend = [
  { month: "Oct", rate: 83 },
  { month: "Nov", rate: 76 },
  { month: "Dec", rate: 85 },
  { month: "Jan", rate: 81 },
  { month: "Feb", rate: 82 },
  { month: "Mar", rate: 79 },
  { month: "Apr", rate: 63 },
];

export const avgResponseTime = [
  { month: "Oct", hours: 4.2 },
  { month: "Nov", hours: 5.1 },
  { month: "Dec", hours: 3.8 },
  { month: "Jan", hours: 4.5 },
  { month: "Feb", hours: 3.2 },
  { month: "Mar", hours: 2.9 },
  { month: "Apr", hours: 3.4 },
];
