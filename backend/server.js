const express = require('express');
const cors = require('cors');
const { projects, requests, userAccess } = require('./data');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Helper to calculate stats
const calculateStats = (role) => {
    if (role === 'manager') {
        return {
            totalUsers: 124, // Mock static for now
            totalPendingRequests: requests.filter(r => r.type === 'manager' && r.status === 'pending').length,
            totalModifiedRequests: 12,
            totalApplications: projects.filter(p => !p.id.includes('OWN') && !p.id.includes('BUS')).length
        };
    } else if (role === 'app_owner') {
        return {
            totalApplications: projects.filter(p => p.id.includes('OWN')).length,
            totalPendingRequests: requests.filter(r => r.type === 'app_owner' && r.status === 'pending').length,
            totalCompletedApprovals: 145,
            totalReportingManagers: 8
        };
    } else if (role === 'business_owner') {
        return {
            totalApplications: projects.filter(p => p.id.includes('BUS')).length,
            totalAppOwners: 12,
            totalPendingRequests: requests.filter(r => r.type === 'business_owner' && r.status === 'pending').length
        };
    } else if (role === 'admin') {
        return {
            totalApplications: projects.length,
            totalBusinessOwners: 34,
            totalApplicationOwners: 89,
            totalReportingManagers: 245
        };
    }
    return {};
};

// --- Endpoints ---

// Login (Mock)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Mock Credentials (password is always 'password123' for simplicity)
    if (password !== 'password123') {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (username === 'manager') {
        return res.json({ success: true, role: 'manager', redirect: '/dashboard', token: 'mock-jwt-manager' });
    }
    if (username === 'app_owner') {
        return res.json({ success: true, role: 'app_owner', redirect: '/app-owner', token: 'mock-jwt-app-owner' });
    }
    if (username === 'business') {
        return res.json({ success: true, role: 'business_owner', redirect: '/business-owner', token: 'mock-jwt-business' });
    }
    if (username === 'admin') {
        return res.json({ success: true, role: 'admin', redirect: '/admin', token: 'mock-jwt-admin' });
    }

    return res.status(401).json({ success: false, message: 'User not found' });
});


// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
    const { role } = req.query;
    const stats = calculateStats(role);
    res.json(stats);
});

// Requests List
app.get('/api/requests', (req, res) => {
    const { role } = req.query;
    let filteredRequests = requests;

    if (role === 'manager') {
        // Manager sees their own requests (simulated by 'manager' type or just all for now)
        // AND pending approvals assigned to them
        filteredRequests = requests.filter(r => r.type === 'manager' || r.initiatedBy === 'manager');
    } else if (role === 'app_owner') {
        // App owner sees requests pending THEIR approval
        filteredRequests = requests.filter(r => r.status === 'pending_app_owner');
    } else if (role === 'business_owner') {
        // Business owner sees requests pending THEIR approval
        filteredRequests = requests.filter(r => r.status === 'pending_business_owner');
    }

    res.json(filteredRequests);
});

// Create New Request (Manager raises request)
app.post('/api/requests', (req, res) => {
    const { userName, userEmail, employeeId, department, applicationName, modules } = req.body;

    const newRequest = {
        id: `REQ-${Date.now()}`,
        userName,
        userEmail,
        employeeId,
        department,
        role: 'User', // Default
        applicationName,
        modules,
        requestedAction: 'access_request',
        submittedDate: new Date().toISOString(),
        status: 'pending_app_owner', // First step
        type: 'access_request', // Differentiate from review requests
        initiatedBy: 'manager'
    };

    requests.push(newRequest);
    res.json({ success: true, message: 'Request submitted successfully', request: newRequest });
});

// Approve Request / Action
app.post('/api/requests/:id/approve', (req, res) => {
    const { id } = req.params;
    const reqIndex = requests.findIndex(r => r.id === id);

    if (reqIndex > -1) {
        const request = requests[reqIndex];

        if (request.status === 'pending_app_owner') {
            // Move to Business Owner
            request.status = 'pending_business_owner';
            res.json({ success: true, message: 'Approved by Application Owner. Pending Business Owner approval.' });
        } else if (request.status === 'pending_business_owner') {
            // Final Approval
            request.status = 'approved';

            // Grant Access (Simulate)
            userAccess.push({
                id: `USR-${Date.now()}`,
                userName: request.userName,
                applicationName: request.applicationName,
                modules: request.modules || [],
                role: 'User'
            });

            res.json({ success: true, message: 'Approved by Business Owner. Access granted.' });
        } else {
            // Default behavior for other types
            request.status = 'approved';
            res.json({ success: true, message: 'Request approved' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Request not found' });
    }
});

// Reject Request
app.post('/api/requests/:id/reject', (req, res) => {
    const { id } = req.params;
    const reqIndex = requests.findIndex(r => r.id === id);
    if (reqIndex > -1) {
        requests[reqIndex].status = 'rejected';
        res.json({ success: true, message: 'Request rejected' });
    } else {
        res.status(404).json({ success: false, message: 'Request not found' });
    }
});

// Applications List
app.get('/api/applications', (req, res) => {
    const { role } = req.query;
    let filteredProjects = projects;

    if (role === 'manager') {
        filteredProjects = projects.filter(p => !p.id.includes('OWN') && !p.id.includes('BUS'));
    } else if (role === 'app_owner') {
        filteredProjects = projects.filter(p => p.id.includes('OWN'));
    } else if (role === 'business_owner') {
        filteredProjects = projects.filter(p => p.id.includes('BUS'));
    }

    const mappedProjects = filteredProjects.map(p => ({
        id: p.id,
        applicationName: p.applicationName,
        userCount: p.userCount,
        applicationOwnerName: p.owner,
        businessOwnerName: p.businessOwner,
        pendingRequestsCount: p.pending,
        lastReviewDate: p.lastReview,
        modules: p.modules || [] // Include modules
    }));

    res.json(mappedProjects);
});

// User Access List (for Manager)
app.get('/api/users', (req, res) => {
    res.json(userAccess);
});

// Delete User Access
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const idx = userAccess.findIndex(u => u.id === id);
    if (idx > -1) {
        userAccess.splice(idx, 1);
        res.json({ success: true, message: 'User access removed' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
