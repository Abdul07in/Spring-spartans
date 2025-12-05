
// Applications Data
const projects = [
    // Reporting Manager's team apps (from ReportingManagerDashboard mock)
    { id: 'APP-6000', applicationName: 'Jira', userCount: 45, owner: 'Sarah Connor', businessOwner: 'Robert California', pending: 3, lastReview: '2023-10-01', modules: ['Issue Tracking', 'Scrum Board', 'Kanban', 'Reporting'] },
    { id: 'APP-6001', applicationName: 'Confluence', userCount: 30, owner: 'John Doe', businessOwner: 'David Wallace', pending: 2, lastReview: '2023-09-15', modules: ['Documentation', 'Team Collaboration', 'Whiteboards'] },
    { id: 'APP-6002', applicationName: 'AWS Console', userCount: 12, owner: 'Sarah Connor', businessOwner: 'Robert California', pending: 5, lastReview: '2023-11-20', modules: ['EC2', 'S3', 'RDS', 'Lambda', 'IAM'] },
    // App Owner's apps (from ApplicationOwnerDashboard mock)
    { id: 'APP-OWN-2000', applicationName: 'Payment Gateway', userCount: 120, owner: 'John Doe', businessOwner: 'Michael Scott', pending: 8, lastReview: '2023-10-25', modules: ['Transactions', 'Refunds', 'Settlements'] },
    { id: 'APP-OWN-2001', applicationName: 'Customer Portal', userCount: 250, owner: 'John Doe', businessOwner: 'David Wallace', pending: 15, lastReview: '2023-11-01', modules: ['Profile', 'Orders', 'Support'] },
    // Business Owner's apps
    { id: 'APP-BUS-3000', applicationName: 'Salesforce', userCount: 300, owner: 'David Wallace', businessOwner: 'Michael Scott', pending: 20, lastReview: '2023-08-10', modules: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud'] },
];

// Requests Data
const requests = [
    // RM Requests
    { id: 'REQ-1000', userName: 'Alice Smith', userEmail: 'alice@example.com', role: 'Admin', applicationName: 'Jira', requestedAction: 'retain', submittedDate: '2023-11-25T10:00:00Z', status: 'pending', type: 'manager' },
    { id: 'REQ-1001', userName: 'Bob Johnson', userEmail: 'bob@company.com', role: 'Editor', applicationName: 'Confluence', requestedAction: 'revoke', submittedDate: '2023-11-26T14:30:00Z', status: 'pending', type: 'manager' },
    // App Owner Requests
    { id: 'APP-REQ-2000', userName: 'John Doe', userEmail: 'john@example.com', role: 'Developer', applicationName: 'Payment Gateway', requestedAction: 'modify', reportingManagerName: 'Manager Mike', submittedDate: '2023-11-28T09:15:00Z', status: 'pending', type: 'app_owner' },
    // Business Owner Requests
    { id: 'BUS-REQ-3000', userName: 'Michael Scott', userEmail: 'michael@dunder.com', role: 'Branch Manager', applicationName: 'Salesforce', requestedAction: 'retain', applicationOwnerName: 'David Wallace', submittedDate: '2023-11-29T11:45:00Z', status: 'pending', type: 'business_owner' }
];

// Users Access Data (for Reporting Manager "Manage Access" page)
const userAccess = [
    { id: 'USR-1000', userName: 'Alice Smith', applicationName: 'Jira', modules: ['Issue Tracking', 'Scrum Board'], role: 'Admin' },
    { id: 'USR-1001', userName: 'Bob Johnson', applicationName: 'Confluence', modules: ['Pages'], role: 'Editor' },
];

module.exports = {
    projects,
    requests,
    userAccess
};
