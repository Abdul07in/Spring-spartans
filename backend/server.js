const express = require('express');
const cors = require('cors');
const { projects, requests, userAccess } = require('./data');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

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

    // Valid credentials now just return requirement for OTP
    return res.json({ success: true, requireOtp: true, message: 'Credentials valid. Please enter OTP.', username });
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { username, otp } = req.body;

    if (!username || !otp) {
        return res.status(400).json({ success: false, message: 'Username and OTP required' });
    }

    // Hardcoded global OTP for simplicity as per requirement
    if (otp !== '123456') {
        return res.status(401).json({ success: false, message: 'Invalid OTP' });
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
        filteredRequests = requests.filter(r => r.type === 'manager' || r.initiatedBy === 'manager');
    } else if (role === 'app_owner') {
        filteredRequests = requests.filter(r => r.status === 'pending_app_owner');
    } else if (role === 'business_owner') {
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
            request.status = 'pending_business_owner';
            res.json({ success: true, message: 'Approved by Application Owner. Pending Business Owner approval.' });
        } else if (request.status === 'pending_business_owner') {
            request.status = 'approved';
            userAccess.push({
                id: `USR-${Date.now()}`,
                userName: request.userName,
                applicationName: request.applicationName,
                modules: request.modules || [],
                role: 'User'
            });
            res.json({ success: true, message: 'Approved by Business Owner. Access granted.' });
        } else {
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

// Create New Application (Admin)
app.post('/api/applications', (req, res) => {
    const { applicationName, owner, businessOwner, modules } = req.body;

    if (!applicationName || !owner || !businessOwner) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newApp = {
        id: `APP-${Date.now()}`,
        applicationName,
        userCount: 0,
        owner,
        businessOwner,
        pending: 0,
        lastReview: new Date().toISOString().split('T')[0],
        modules: modules || []
    };

    projects.push(newApp);
    res.json({ success: true, message: 'Application created successfully', application: newApp });
});

// User Access List (for Manager)
app.get('/api/users', (req, res) => {
    res.json(userAccess);
});

// Update User Access (Modules)
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { modules } = req.body;
    console.log(`[PUT] Update User ${id}, modules:`, modules);
    const idx = userAccess.findIndex(u => u.id === id);

    if (idx > -1) {
        if (modules) {
            userAccess[idx].modules = modules;
        }
        console.log(`[PUT] Success. New modules for ${userAccess[idx].userName}:`, userAccess[idx].modules);
        res.json({ success: true, message: 'User access updated', user: userAccess[idx] });
    } else {
        console.log(`[PUT] User ${id} not found`);
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Delete User Access (Single ID - Application Removal)
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`[DELETE] Request received for user ID: ${id}`);
    const idx = userAccess.findIndex(u => u.id === id);
    console.log(`[DELETE] Found index: ${idx} for ID: ${id}`);
    if (idx > -1) {
        const removed = userAccess.splice(idx, 1);
        console.log(`[DELETE] User removed: ${removed[0].userName}. New count: ${userAccess.length}`);
        res.json({ success: true, message: 'User access removed' });
    } else {
        console.log(`[DELETE] User not found.`);
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Revoke All Access for User
app.delete('/api/users', (req, res) => {
    const { userName } = req.query;
    console.log(`[DELETE ALL] Request for user: ${userName}`);
    if (!userName) {
        return res.status(400).json({ success: false, message: 'UserName required' });
    }

    const initialLength = userAccess.length;
    // Filter out entries for this user
    const toRemove = userAccess.filter(u => u.userName === userName);
    console.log(`[DELETE ALL] Found ${toRemove.length} records to remove for ${userName}`);

    // Remove from main array
    let removedCount = 0;
    for (let i = userAccess.length - 1; i >= 0; i--) {
        if (userAccess[i].userName === userName) {
            userAccess.splice(i, 1);
            removedCount++;
        }
    }

    console.log(`[DELETE ALL] Removed ${removedCount} records. Remaining total: ${userAccess.length}`);

    res.json({
        success: true,
        message: `Revoked ${removedCount} access records for ${userName}`,
        removedCount: removedCount
    });
});

// Get Owners List (for Admin dropdowns) - RESTORED
app.get('/api/owners', (req, res) => {
    const appOwners = [...new Set(projects.map(p => p.owner))].filter(Boolean);
    const busOwners = [...new Set(projects.map(p => p.businessOwner))].filter(Boolean);
    res.json({
        applicationOwners: appOwners,
        businessOwners: busOwners
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
