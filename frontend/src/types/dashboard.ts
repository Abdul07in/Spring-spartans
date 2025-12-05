export interface DashboardStats {
    totalUsers: number;
    totalPendingRequests: number;
    totalModifiedRequests: number;
    totalApplications: number;
    totalCompletedApprovals?: number;
    totalReportingManagers?: number;
    totalBusinessOwners?: number;
    totalApplicationOwners?: number;
    totalAppOwners?: number;
}

export interface ReviewRequest {
    id: string;
    userName: string;
    userEmail: string;
    employeeId?: string;
    department?: string;
    role: string;
    applicationName: string;
    modules?: string[];
    requestedAction: 'retain' | 'revoke' | 'modify' | 'access_request';
    reportingManagerName?: string;
    applicationOwnerName?: string;
    submittedDate: string;
    status: 'pending' | 'approved' | 'rejected' | 'pending_app_owner' | 'pending_business_owner';
    initiatedBy?: string;
}

export interface ApplicationSummary {
    id: string;
    applicationName: string;
    userCount: number;
    applicationOwnerName: string;
    businessOwnerName: string;
    lastReviewDate?: string;
    pendingRequestsCount?: number;
    modules?: string[];
}

export interface UserAccess {
    id: string;
    userName: string;
    applicationName: string;
    modules: string[];
    role: string;
}
