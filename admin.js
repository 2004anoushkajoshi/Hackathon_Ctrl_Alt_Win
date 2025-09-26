// Admin dashboard functionality

function loadAdminDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    dashboard.innerHTML = `
        <div class="dashboard-nav">
            <div class="container">
                <ul class="dashboard-nav-links">
                    <li><a href="#admin-dashboard" class="dashboard-nav-link active">Dashboard</a></li>
                    <li><a href="#admin-users" class="dashboard-nav-link">Manage Users</a></li>
                    <li><a href="#admin-requests" class="dashboard-nav-link">Organizer Requests</a></li>
                    <li><a href="#admin-events" class="dashboard-nav-link">All Events</a></li>
                    <li><a href="#admin-profile" class="dashboard-nav-link">Profile</a></li>
                    <li><a href="#" id="logout-btn">Logout</a></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <!-- Admin Dashboard -->
            <div class="dashboard-section active" id="admin-dashboard">
                <h2 class="section-title">Admin Dashboard</h2>
                <p>Welcome back, Administrator! Here's an overview of the platform.</p>
                
                <div class="admin-stats">
                    <div class="stat-card">
                        <i class="fas fa-users"></i>
                        <h3 id="total-users">${window.eventManager.users.length}</h3>
                        <p>Total Users</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-calendar-plus"></i>
                        <h3 id="total-events">${window.eventManager.events.length}</h3>
                        <p>Total Events</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-clock"></i>
                        <h3 id="pending-requests">${window.eventManager.organizerRequests.filter(function(req) { return req.status === 'pending'; }).length}</h3>
                        <p>Pending Requests</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-user-check"></i>
                        <h3 id="approved-organizers">${window.eventManager.users.filter(function(user) { return user.isOrganizer; }).length}</h3>
                        <p>Approved Organizers</p>
                    </div>
                </div>

                <div class="admin-sections">
                    <div class="admin-section">
                        <h3>Recent Organizer Requests</h3>
                        <div class="request-list" id="recent-requests">
                            ${populateRecentRequestsHTML()}
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Platform Statistics</h3>
                        <div class="stats-overview">
                            <div class="stat-item">
                                <span>Active Events This Month:</span>
                                <strong id="active-events">${window.eventManager.events.filter(function(event) { return new Date(event.date) >= new Date(); }).length}</strong>
                            </div>
                            <div class="stat-item">
                                <span>System Status:</span>
                                <strong style="color: var(--orange)">Operational</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manage Users -->
            <div class="dashboard-section" id="admin-users">
                <h2 class="section-title">Manage Users</h2>
                
                <div class="filter-section">
                    <div class="filter-group">
                        <input type="text" id="user-search" placeholder="Search users..." class="filter-select">
                        <select id="user-role-filter" class="filter-select">
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                <div class="user-list" id="users-list">
                    ${populateUsersListHTML()}
                </div>
            </div>

            <!-- Organizer Requests -->
            <div class="dashboard-section" id="admin-requests">
                <h2 class="section-title">Organizer Requests</h2>
                
                <div class="filter-section">
                    <div class="filter-group">
                        <select id="request-status-filter" class="filter-select">
                            <option value="all">All Requests</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div class="request-list" id="organizer-requests-list">
                    ${populateOrganizerRequestsHTML()}
                </div>
            </div>

            <!-- All Events -->
            <div class="dashboard-section" id="admin-events">
                <h2 class="section-title">All Events</h2>
                
                <div class="events-grid" id="admin-events-grid">
                    ${populateAdminEventsHTML()}
                </div>
            </div>

            <!-- Admin Profile -->
            <div class="dashboard-section" id="admin-profile">
                <h2 class="section-title">Admin Profile</h2>
                <div class="profile-form">
                    <form id="admin-profile-form">
                        <div class="form-group">
                            <label for="admin-profile-name">Full Name</label>
                            <input type="text" id="admin-profile-name" value="${window.eventManager.currentUser.fullname}">
                        </div>
                        <div class="form-group">
                            <label for="admin-profile-email">Email Address</label>
                            <input type="email" id="admin-profile-email" value="${window.eventManager.currentUser.email}" readonly>
                        </div>
                        <button type="submit" class="btn btn-primary">Update Profile</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    setupAdminEventListeners();
}

function setupAdminEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.dashboard-nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            navLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            link.classList.add('active');
            
            const sections = document.querySelectorAll('.dashboard-section');
            sections.forEach(function(section) {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.eventManager && window.eventManager.logout) {
                window.eventManager.logout();
            }
        });
    }

    // Profile form
    const profileForm = document.getElementById('admin-profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateAdminProfile();
        });
    }

    // User search
    const userSearch = document.getElementById('user-search');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            populateUsersList();
        });
    }

    // Filters
    const userRoleFilter = document.getElementById('user-role-filter');
    const requestStatusFilter = document.getElementById('request-status-filter');
    
    if (userRoleFilter) {
        userRoleFilter.addEventListener('change', function() {
            populateUsersList();
        });
    }
    
    if (requestStatusFilter) {
        requestStatusFilter.addEventListener('change', function() {
            populateOrganizerRequests();
        });
    }
}

function populateRecentRequestsHTML() {
    const recentRequests = window.eventManager.organizerRequests
        .filter(function(req) { return req.status === 'pending'; })
        .slice(0, 5);
    
    if (recentRequests.length === 0) {
        return '<p>No pending organizer requests.</p>';
    }
    
    return recentRequests.map(function(request) {
        return `
            <div class="request-card">
                <div class="request-info">
                    <h4>${request.userName}</h4>
                    <p>${request.userEmail}</p>
                    <small>Requested: ${new Date(request.requestedAt).toLocaleDateString()}</small>
                </div>
                <div class="admin-actions">
                    <button class="btn btn-primary btn-sm" onclick="approveRequest(${request.id})">Approve</button>
                    <button class="btn btn-secondary btn-sm" onclick="rejectRequest(${request.id})">Reject</button>
                </div>
            </div>
        `;
    }).join('');
}

function populateUsersListHTML() {
    const users = window.eventManager.users;
    
    if (users.length === 0) {
        return '<p>No users found.</p>';
    }
    
    return users.map(function(user) {
        return `
            <div class="user-card">
                <div class="user-info">
                    <h4>${user.fullname} ${user.isOrganizer ? '<span style="color: var(--orange);">(Organizer)</span>' : ''}</h4>
                    <p>${user.email} • ${user.department} • ${user.role}</p>
                    <small>Joined: ${new Date(user.createdAt).toLocaleDateString()}</small>
                </div>
                <div class="admin-actions">
                    ${user.role !== 'admin' ? `
                        <button class="btn btn-secondary btn-sm" onclick="toggleOrganizerStatus(${user.id}, ${!user.isOrganizer})">
                            ${user.isOrganizer ? 'Revoke Organizer' : 'Make Organizer'}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function populateOrganizerRequestsHTML() {
    const requests = window.eventManager.organizerRequests;
    
    if (requests.length === 0) {
        return '<p>No organizer requests found.</p>';
    }
    
    return requests.map(function(request) {
        const user = window.eventManager.users.find(function(u) { return u.id === request.userId; });
        return `
            <div class="request-card">
                <div class="request-info">
                    <h4>${request.userName}</h4>
                    <p>${request.userEmail}</p>
                    <small>
                        Requested: ${new Date(request.requestedAt).toLocaleDateString()}
                        • Status: <span class="status-${request.status}">${request.status}</span>
                    </small>
                    ${user ? `<p>Department: ${user.department} • Contact: ${user.contact}</p>` : ''}
                </div>
                <div class="admin-actions">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="approveRequest(${request.id})">Approve</button>
                        <button class="btn btn-secondary btn-sm" onclick="rejectRequest(${request.id})">Reject</button>
                    ` : `
                        <span>Processed</span>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function populateAdminEventsHTML() {
    return window.eventManager.events.map(function(event) {
        return `
            <div class="event-card">
                <div class="event-image" style="background: ${window.eventManager.getGradientForCategory(event.category)};">
                    <i class="fas fa-${event.category === 'Cultural' ? 'music' : event.category === 'Sports' ? 'running' : 'paint-brush'}"></i>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-date">
                        <i class="far fa-calendar-alt"></i>
                        ${new Date(event.date).toLocaleDateString()}
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-actions">
                        <span class="event-category">${event.category}</span>
                        <span class="event-category">${event.registered ? 'Registered: Yes' : 'Registered: No'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateUsersList() {
    const container = document.getElementById('users-list');
    if (!container) return;
    
    container.innerHTML = populateUsersListHTML();
}

function populateOrganizerRequests() {
    const container = document.getElementById('organizer-requests-list');
    if (!container) return;
    
    const statusFilter = document.getElementById('request-status-filter');
    let filteredRequests = window.eventManager.organizerRequests;
    
    if (statusFilter && statusFilter.value !== 'all') {
        filteredRequests = filteredRequests.filter(function(req) {
            return req.status === statusFilter.value;
        });
    }
    
    if (filteredRequests.length === 0) {
        container.innerHTML = '<p>No requests found matching your criteria.</p>';
        return;
    }
    
    container.innerHTML = filteredRequests.map(function(request) {
        const user = window.eventManager.users.find(function(u) { return u.id === request.userId; });
        return `
            <div class="request-card">
                <div class="request-info">
                    <h4>${request.userName}</h4>
                    <p>${request.userEmail}</p>
                    <small>
                        Requested: ${new Date(request.requestedAt).toLocaleDateString()}
                        • Status: <span class="status-${request.status}">${request.status}</span>
                    </small>
                    ${user ? `<p>Department: ${user.department} • Contact: ${user.contact}</p>` : ''}
                </div>
                <div class="admin-actions">
                    ${request.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="approveRequest(${request.id})">Approve</button>
                        <button class="btn btn-secondary btn-sm" onclick="rejectRequest(${request.id})">Reject</button>
                    ` : `
                        <span>Processed</span>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

// Admin functions
function approveRequest(requestId) {
    const request = window.eventManager.organizerRequests.find(function(req) { return req.id === requestId; });
    if (request) {
        request.status = 'approved';
        request.processedAt = new Date().toISOString();
        
        // Update user's organizer status
        const user = window.eventManager.users.find(function(u) { return u.id === request.userId; });
        if (user) {
            user.isOrganizer = true;
        }
        
        localStorage.setItem('organizerRequests', JSON.stringify(window.eventManager.organizerRequests));
        localStorage.setItem('users', JSON.stringify(window.eventManager.users));
        
        alert('Request approved! User is now an event organizer.');
        populateOrganizerRequests();
    }
}

function rejectRequest(requestId) {
    const request = window.eventManager.organizerRequests.find(function(req) { return req.id === requestId; });
    if (request) {
        request.status = 'rejected';
        request.processedAt = new Date().toISOString();
        
        localStorage.setItem('organizerRequests', JSON.stringify(window.eventManager.organizerRequests));
        
        alert('Request rejected.');
        populateOrganizerRequests();
    }
}

function toggleOrganizerStatus(userId, makeOrganizer) {
    const user = window.eventManager.users.find(function(u) { return u.id === userId; });
    if (user) {
        user.isOrganizer = makeOrganizer;
        localStorage.setItem('users', JSON.stringify(window.eventManager.users));
        
        alert(`${user.fullname} ${makeOrganizer ? 'is now an organizer' : 'is no longer an organizer'}`);
        populateUsersList();
    }
}

function updateAdminProfile() {
    const name = document.getElementById('admin-profile-name').value;
    
    const userIndex = window.eventManager.users.findIndex(function(u) { 
        return u.id === window.eventManager.currentUser.id; 
    });
    
    if (userIndex !== -1) {
        window.eventManager.users[userIndex].fullname = name;
        localStorage.setItem('users', JSON.stringify(window.eventManager.users));
        window.eventManager.currentUser = window.eventManager.users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(window.eventManager.currentUser));
        
        alert('Profile updated successfully!');
    }
}

// Make functions available globally
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.toggleOrganizerStatus = toggleOrganizerStatus;
window.loadAdminDashboard = loadAdminDashboard;