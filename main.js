// Sample event data
const events = [
    {
        id: 1,
        title: "Raas Garba Night",
        date: "2024-03-15",
        description: "Traditional Gujarati folk dance event with live music, colorful costumes, and energetic dancing.",
        category: "Cultural",
        image: "raas-garba",
        registered: false,
        location: "Main Auditorium",
        time: "6:00 PM - 11:00 PM",
        organizer: "Cultural Committee"
    },
    {
        id: 2,
        title: "Freshers Welcome",
        date: "2024-03-20",
        description: "Official welcome ceremony for new students with performances, games, and interactions.",
        category: "Cultural",
        image: "freshers",
        registered: true,
        location: "College Ground",
        time: "4:00 PM - 8:00 PM",
        organizer: "Student Council"
    },
    {
        id: 3,
        title: "Sportsmania Tournament",
        date: "2024-04-10",
        description: "Annual inter-college sports competition featuring cricket, football, basketball.",
        category: "Sports",
        image: "sportsmania",
        registered: false,
        location: "Sports Complex",
        time: "8:00 AM - 6:00 PM",
        organizer: "Sports Committee"
    }
];

// User management
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let organizerRequests = JSON.parse(localStorage.getItem('organizerRequests')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Application initialized');
    initializeApp();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('📱 User already logged in:', currentUser.email);
        showDashboard();
    }
});

function initializeApp() {
    console.log('🔧 Setting up application...');
    setupEventListeners();
    populateEventsCarousel();
    setupCategoryFilters();
    
    // Initialize global object
    window.eventManager = {
        events: events,
        get currentUser() { return currentUser; },
        set currentUser(user) { currentUser = user; },
        users: users,
        organizerRequests: organizerRequests,
        createEventCard: createEventCard,
        getGradientForCategory: getGradientForCategory,
        toggleEventRegistration: toggleEventRegistration,
        logout: logout,
        showDashboard: showDashboard
    };
}

function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Navigation
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const heroLogin = document.getElementById('hero-login');
    const aboutLogin = document.getElementById('about-login');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const authForm = document.getElementById('auth-form');

    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔑 Login link clicked');
            showLoginForm();
            if (authModal) authModal.style.display = 'flex';
        });
    }

    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📝 Signup link clicked');
            showSignupForm();
            if (authModal) authModal.style.display = 'flex';
        });
    }

    if (heroLogin) {
        heroLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Hero login clicked');
            showLoginForm();
            if (authModal) authModal.style.display = 'flex';
        });
    }

    if (aboutLogin) {
        aboutLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('ℹ️ About login clicked');
            showLoginForm();
            if (authModal) authModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            console.log('❌ Close modal clicked');
            if (authModal) authModal.style.display = 'none';
        });
    }

    // Form submission
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📨 Auth form submitted');
            handleAuthSubmit(e);
        });
    }

    // Mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            console.log('📱 Mobile menu clicked');
            navLinks.classList.toggle('active');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            console.log('🌐 Clicked outside modal');
            authModal.style.display = 'none';
        }
    });

    // Role selection functionality
    setupRoleSelection();
}

function setupRoleSelection() {
    console.log('🎯 Setting up role selection...');
    
    const roleOptions = document.querySelectorAll('.role-option');
    if (roleOptions.length > 0) {
        roleOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                console.log('👤 Role option clicked:', this.getAttribute('data-role'));
                
                // Remove active class from all options
                roleOptions.forEach(function(opt) {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                this.classList.add('active');
            });
        });
        
        // Set default active role
        const defaultRole = document.querySelector('.role-option[data-role="student"]');
        if (defaultRole) {
            defaultRole.classList.add('active');
        }
    }
}

function showLoginForm() {
    console.log('👤 Showing login form');
    
    const authForm = document.getElementById('auth-form');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const signupFields = document.getElementById('signup-fields');
    const toggleForm = document.getElementById('toggle-form');
    const roleSelection = document.querySelector('.role-selection');
    
    if (!authForm || !modalTitle || !submitBtn || !signupFields || !toggleForm) {
        console.error('❌ Form elements not found');
        return;
    }
    
    authForm.classList.remove('signup-mode');
    modalTitle.textContent = 'Login to Your Account';
    submitBtn.textContent = 'Login';
    signupFields.style.display = 'none';
    
    // Hide role selection for login
    if (roleSelection) {
        roleSelection.style.display = 'none';
    }
    
    toggleForm.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Sign Up</a>';
    
    // Re-attach event listener
    const newToggleLink = document.getElementById('toggle-link');
    if (newToggleLink) {
        newToggleLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSignupForm();
        });
    }
}

function showSignupForm() {
    console.log('👥 Showing signup form');
    
    const authForm = document.getElementById('auth-form');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const signupFields = document.getElementById('signup-fields');
    const toggleForm = document.getElementById('toggle-form');
    const roleSelection = document.querySelector('.role-selection');
    
    if (!authForm || !modalTitle || !submitBtn || !signupFields || !toggleForm) {
        console.error('❌ Form elements not found');
        return;
    }
    
    authForm.classList.add('signup-mode');
    modalTitle.textContent = 'Create an Account';
    submitBtn.textContent = 'Sign Up';
    signupFields.style.display = 'block';
    
    // Show role selection for signup
    if (roleSelection) {
        roleSelection.style.display = 'flex';
    }
    
    toggleForm.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
    
    // Re-attach event listener
    const newToggleLink = document.getElementById('toggle-link');
    if (newToggleLink) {
        newToggleLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }
    
    // Reset role selection to default
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(opt => opt.classList.remove('active'));
    const defaultRole = document.querySelector('.role-option[data-role="student"]');
    if (defaultRole) {
        defaultRole.classList.add('active');
    }
}

function handleAuthSubmit(e) {
    console.log('🔐 Handling auth submission');
    
    const authModal = document.getElementById('auth-modal');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const authForm = document.getElementById('auth-form');
    
    if (!authModal) {
        console.error('❌ Auth modal not found');
        return;
    }
    
    const isSignup = authForm.classList.contains('signup-mode');
    
    if (isSignup) {
        // Get the selected role
        const activeRole = document.querySelector('.role-option.active');
        if (!activeRole) {
            alert('Please select a role (Student or Admin)');
            return;
        }
        
        const selectedRole = activeRole.getAttribute('data-role');
        const fullname = document.getElementById('fullname').value;
        const department = document.getElementById('department').value;
        const contact = document.getElementById('contact').value;
        
        // Validation
        if (!email || !password || !fullname) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            email: email,
            password: password,
            fullname: fullname,
            department: department,
            contact: contact,
            role: selectedRole,
            isOrganizer: selectedRole === 'admin', // Admins are automatically organizers
            createdAt: new Date().toISOString()
        };
        
        // Check if user already exists
        if (users.find(function(user) { return user.email === email; })) {
            alert('User with this email already exists!');
            return;
        }
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        console.log('✅ User created:', newUser);
        alert(`Account created successfully! Welcome ${selectedRole} ${fullname}`);
    } else {
        // Login logic
        const user = users.find(function(u) { return u.email === email && u.password === password; });
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('✅ User logged in:', user);
        } else {
            alert('Invalid email or password!');
            return;
        }
    }
    
    authModal.style.display = 'none';
    showDashboard();
}

function showDashboard() {
    console.log('📊 Showing dashboard for user:', currentUser);
    
    if (!currentUser) {
        console.error('❌ No current user found');
        return;
    }
    
    // Hide main content sections
    const sectionsToHide = [
        'header', '.hero', '#events', '.categories-section', '.highlights-section', 'footer'
    ];
    
    sectionsToHide.forEach(function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
            console.log('🙈 Hiding:', selector);
        }
    });
    
    // Show dashboard
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.display = 'block';
        console.log('📈 Dashboard displayed');
        
        // Load appropriate dashboard
        loadDashboardContent();
    } else {
        console.error('❌ Dashboard element not found');
    }
    
    window.scrollTo(0, 0);
}

function loadDashboardContent() {
    console.log('🎯 Loading dashboard content for:', currentUser.role);
    
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    if (currentUser.role === 'admin') {
        dashboard.innerHTML = createAdminDashboard();
        console.log('🛡️ Admin dashboard loaded');
    } else {
        dashboard.innerHTML = createStudentDashboard();
        console.log('🎓 Student dashboard loaded');
    }
    
    setupDashboardListeners();
}

function createStudentDashboard() {
    const userRequests = organizerRequests.filter(req => req.userId === currentUser.id);
    const pendingRequest = userRequests.find(req => req.status === 'pending');
    const approvedRequest = userRequests.find(req => req.status === 'approved');
    const rejectedRequest = userRequests.find(req => req.status === 'rejected');
    
    const registeredEventsCount = events.filter(e => e.registered).length;
    const upcomingEventsCount = events.filter(e => new Date(e.date) > new Date()).length;
    
    return `
        <div class="dashboard-nav">
            <div class="container">
                <ul class="dashboard-nav-links">
                    <li><a href="#dashboard-home" class="dashboard-nav-link active">Home</a></li>
                    <li><a href="#dashboard-events" class="dashboard-nav-link">Events</a></li>
                    <li><a href="#dashboard-my-events" class="dashboard-nav-link">My Events</a></li>
                    <li><a href="#dashboard-profile" class="dashboard-nav-link">Profile</a></li>
                    <li><a href="#" id="logout-btn" class="logout-btn">Logout</a></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="dashboard-section active" id="dashboard-home">
                <h2 class="section-title">Welcome, ${currentUser.fullname}! 👋</h2>
                <p>🎉 Welcome to your UniVerse dashboard! Explore events and manage your campus activities.</p>
                
                <div class="quick-stats">
                    <div class="stat-card">
                        <i class="fas fa-calendar-check"></i>
                        <h3>${registeredEventsCount}</h3>
                        <p>Events Registered</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-hourglass-half"></i>
                        <h3>${upcomingEventsCount}</h3>
                        <p>Upcoming Events</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-user-tie"></i>
                        <h3>${currentUser.isOrganizer ? 'Yes' : 'No'}</h3>
                        <p>Organizer Status</p>
                    </div>
                </div>

                <div class="dashboard-alerts">
                    ${currentUser.isOrganizer ? `
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i>
                            <strong>Organizer Access Granted!</strong> You can now create and manage events.
                        </div>
                    ` : pendingRequest ? `
                        <div class="alert alert-warning">
                            <i class="fas fa-clock"></i>
                            <strong>Organizer Request Pending</strong> Your request is under review by administrators.
                        </div>
                    ` : rejectedRequest ? `
                        <div class="alert alert-danger">
                            <i class="fas fa-times-circle"></i>
                            <strong>Organizer Request Rejected</strong> Your request was not approved. You can apply again after 30 days.
                        </div>
                    ` : `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i>
                            <strong>Become an Organizer!</strong> Request permissions to create and manage events.
                        </div>
                    `}
                </div>

                <h3 style="margin-top: 40px;">Featured Events</h3>
                <div class="events-grid" id="dashboard-events-grid">
                    ${events.slice(0, 3).map(event => createEventCard(event, true).outerHTML).join('')}
                </div>
            </div>

            <div class="dashboard-section" id="dashboard-events">
                <h2 class="section-title">All Events 📅</h2>
                <div class="events-grid" id="all-events-grid">
                    ${events.map(event => createEventCard(event, true).outerHTML).join('')}
                </div>
            </div>

            <div class="dashboard-section" id="dashboard-my-events">
                <h2 class="section-title">My Registered Events 🎯</h2>
                <div class="events-grid" id="my-events-grid">
                    ${events.filter(e => e.registered).length > 0 ? 
                        events.filter(e => e.registered).map(event => createEventCard(event, true).outerHTML).join('') :
                        '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>You haven\'t registered for any events yet.</p></div>'
                    }
                </div>
            </div>

            <div class="dashboard-section" id="dashboard-profile">
                <h2 class="section-title">My Profile 👤</h2>
                <div class="profile-card">
                    <div class="profile-header">
                        <i class="fas fa-user-circle"></i>
                        <div>
                            <h3>${currentUser.fullname}</h3>
                            <p class="user-role">${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
                        </div>
                    </div>
                    <div class="profile-details">
                        <div class="detail-item">
                            <i class="fas fa-envelope"></i>
                            <span>${currentUser.email}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span>${currentUser.department || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-phone"></i>
                            <span>${currentUser.contact || 'Not provided'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-user-tie"></i>
                            <span><strong>Organizer:</strong> ${currentUser.isOrganizer ? 'Yes ✅' : 'No ❌'}</span>
                        </div>
                    </div>
                    
                    ${!currentUser.isOrganizer && !pendingRequest ? `
                        <div class="organizer-section">
                            <h4>Become an Event Organizer</h4>
                            <p>Request permissions to create and manage campus events.</p>
                            <button class="btn btn-primary btn-large" onclick="requestOrganizer()">
                                <i class="fas fa-user-plus"></i> Request Organizer Access
                            </button>
                        </div>
                    ` : currentUser.isOrganizer ? `
                        <div class="organizer-section">
                            <div class="badge-success">
                                <i class="fas fa-check-circle"></i> Organizer Access Active
                            </div>
                            <button class="btn btn-secondary" onclick="createEvent()">
                                <i class="fas fa-plus"></i> Create New Event
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function createAdminDashboard() {
    const pendingRequests = organizerRequests.filter(req => req.status === 'pending');
    const approvedOrganizers = users.filter(user => user.isOrganizer && user.role !== 'admin');
    
    return `
        <div class="dashboard-nav">
            <div class="container">
                <ul class="dashboard-nav-links">
                    <li><a href="#admin-dashboard" class="dashboard-nav-link active">Dashboard</a></li>
                    <li><a href="#admin-users" class="dashboard-nav-link">Manage Users</a></li>
                    <li><a href="#admin-requests" class="dashboard-nav-link">Organizer Requests ${pendingRequests.length > 0 ? `<span class="notification-badge">${pendingRequests.length}</span>` : ''}</a></li>
                    <li><a href="#admin-events" class="dashboard-nav-link">Events</a></li>
                    <li><a href="#admin-profile" class="dashboard-nav-link">Profile</a></li>
                    <li><a href="#" id="logout-btn" class="logout-btn">Logout</a></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="dashboard-section active" id="admin-dashboard">
                <h2 class="section-title">Admin Dashboard 🛡️</h2>
                <p>Welcome back, Administrator <strong>${currentUser.fullname}</strong>! Here's your platform overview.</p>
                
                <div class="admin-stats">
                    <div class="stat-card">
                        <i class="fas fa-users"></i>
                        <h3>${users.length}</h3>
                        <p>Total Users</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-calendar"></i>
                        <h3>${events.length}</h3>
                        <p>Total Events</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-clock"></i>
                        <h3>${pendingRequests.length}</h3>
                        <p>Pending Requests</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-user-check"></i>
                        <h3>${approvedOrganizers.length}</h3>
                        <p>Approved Organizers</p>
                    </div>
                </div>

                ${pendingRequests.length > 0 ? `
                    <div class="admin-alert">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>${pendingRequests.length} organizer request(s) pending review</strong>
                            <a href="#admin-requests" class="alert-link">Review now</a>
                        </div>
                    </div>
                ` : ''}

                <div class="admin-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="showSection('admin-users')">
                            <i class="fas fa-users"></i> View All Users
                        </button>
                        <button class="btn btn-warning" onclick="showSection('admin-requests')">
                            <i class="fas fa-clipboard-list"></i> Review Requests
                        </button>
                        <button class="btn btn-success" onclick="createNewEvent()">
                            <i class="fas fa-plus"></i> Create Event
                        </button>
                    </div>
                </div>
            </div>

            <div class="dashboard-section" id="admin-users">
                <h2 class="section-title">Manage Users 👥</h2>
                <div class="users-list">
                    ${users.map(user => `
                        <div class="user-card ${user.role === 'admin' ? 'admin-user' : ''}">
                            <div class="user-info">
                                <div class="user-avatar">
                                    <i class="fas fa-user${user.role === 'admin' ? '-shield' : ''}"></i>
                                </div>
                                <div class="user-details">
                                    <h4>${user.fullname} ${user.role === 'admin' ? '<span class="admin-badge">Admin</span>' : ''}</h4>
                                    <p class="user-email">${user.email}</p>
                                    <p class="user-meta">${user.department || 'No department'} • ${user.role}</p>
                                    <small>Joined: ${new Date(user.createdAt).toLocaleDateString()}</small>
                                </div>
                            </div>
                            <div class="user-actions">
                                ${user.role !== 'admin' ? `
                                    <button class="btn btn-sm ${user.isOrganizer ? 'btn-danger' : 'btn-success'}" 
                                            onclick="toggleOrganizerStatus('${user.id}', ${!user.isOrganizer})">
                                        <i class="fas fa-user${user.isOrganizer ? '-minus' : '-plus'}"></i>
                                        ${user.isOrganizer ? 'Revoke Organizer' : 'Make Organizer'}
                                    </button>
                                ` : '<span class="admin-tag">System Admin</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="dashboard-section" id="admin-requests">
                <h2 class="section-title">Organizer Requests 📋</h2>
                
                ${pendingRequests.length > 0 ? `
                    <div class="requests-header">
                        <h3>Pending Requests (${pendingRequests.length})</h3>
                        <p>Review and approve organizer access requests</p>
                    </div>
                    <div class="requests-list">
                        ${pendingRequests.map(request => {
                            const user = users.find(u => u.id === request.userId);
                            return `
                                <div class="request-card pending">
                                    <div class="request-info">
                                        <div class="requester-avatar">
                                            <i class="fas fa-user-graduate"></i>
                                        </div>
                                        <div class="requester-details">
                                            <h4>${request.userName}</h4>
                                            <p class="requester-email">${request.userEmail}</p>
                                            ${user ? `
                                                <p class="requester-meta">
                                                    <i class="fas fa-graduation-cap"></i> ${user.department || 'No department'}
                                                    <i class="fas fa-phone"></i> ${user.contact || 'No contact'}
                                                </p>
                                            ` : ''}
                                            <small>Requested: ${new Date(request.requestedAt).toLocaleString()}</small>
                                        </div>
                                    </div>
                                    <div class="request-actions">
                                        <button class="btn btn-success btn-sm" onclick="approveRequest('${request.id}')">
                                            <i class="fas fa-check"></i> Approve
                                        </button>
                                        <button class="btn btn-danger btn-sm" onclick="rejectRequest('${request.id}')">
                                            <i class="fas fa-times"></i> Reject
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : '<div class="empty-state"><i class="fas fa-clipboard-check"></i><p>No pending organizer requests. Great job! 🎉</p></div>'}
                
                ${organizerRequests.filter(req => req.status !== 'pending').length > 0 ? `
                    <div class="requests-history">
                        <h3>Request History</h3>
                        <div class="requests-list">
                            ${organizerRequests.filter(req => req.status !== 'pending').map(request => `
                                <div class="request-card ${request.status}">
                                    <div class="request-info">
                                        <h4>${request.userName}</h4>
                                        <p>${request.userEmail}</p>
                                        <span class="status-badge ${request.status}">
                                            ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                        <small>Processed: ${new Date(request.processedAt || request.requestedAt).toLocaleString()}</small>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="dashboard-section" id="admin-events">
                <h2 class="section-title">All Events 📅</h2>
                <div class="events-grid">
                    ${events.map(event => createEventCard(event, false).outerHTML).join('')}
                </div>
            </div>

            <div class="dashboard-section" id="admin-profile">
                <h2 class="section-title">Admin Profile 👑</h2>
                <div class="profile-card admin-profile">
                    <div class="profile-header">
                        <i class="fas fa-user-shield"></i>
                        <div>
                            <h3>${currentUser.fullname}</h3>
                            <p class="user-role">Administrator</p>
                        </div>
                    </div>
                    <div class="profile-details">
                        <div class="detail-item">
                            <i class="fas fa-envelope"></i>
                            <span>${currentUser.email}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-key"></i>
                            <span><strong>Permissions:</strong> Full System Access</span>
                        </div>
                    </div>
                    <div class="admin-tools">
                        <h4>Administrative Tools</h4>
                        <div class="tool-buttons">
                            <button class="btn btn-outline" onclick="exportData()">
                                <i class="fas fa-download"></i> Export Data
                            </button>
                            <button class="btn btn-outline" onclick="systemSettings()">
                                <i class="fas fa-cog"></i> System Settings
                            </button>
                            <button class="btn btn-outline" onclick="backupSystem()">
                                <i class="fas fa-database"></i> Backup System
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupDashboardListeners() {
    console.log('🔗 Setting up dashboard listeners');
    
    // Navigation
    const navLinks = document.querySelectorAll('.dashboard-nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const sections = document.querySelectorAll('.dashboard-section');
            sections.forEach(section => {
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
            console.log('🚪 Logout clicked');
            logout();
        });
    }
}

function logout() {
    console.log('👋 Logging out user');
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Show main content
    const sectionsToShow = [
        'header', '.hero', '#events', '.categories-section', '.highlights-section', 'footer'
    ];
    
    sectionsToShow.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'block';
    });
    
    // Hide dashboard
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    showLoginForm();
}

function populateEventsCarousel() {
    const eventsCarousel = document.querySelector('.events-carousel');
    if (!eventsCarousel) return;
    
    eventsCarousel.innerHTML = '';
    events.slice(0, 4).forEach(event => {
        eventsCarousel.appendChild(createEventCard(event, false));
    });
}

function createEventCard(event, showRegisterBtn = true) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const iconMap = {
        'Cultural': 'fas fa-music',
        'Creatives': 'fas fa-paint-brush',
        'Sports': 'fas fa-running'
    };
    
    card.innerHTML = `
        <div class="event-image" style="background: ${getGradientForCategory(event.category)};">
            <i class="${iconMap[event.category] || 'fas fa-calendar-alt'}"></i>
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
                ${showRegisterBtn ? 
                    `<button class="btn ${event.registered ? 'btn-secondary' : 'btn-primary'}" 
                            onclick="toggleEventRegistration(${event.id})">
                        ${event.registered ? 'Registered' : 'Register'}
                    </button>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function getGradientForCategory(category) {
    const gradients = {
        'Cultural': 'linear-gradient(135deg, #FE691E 0%, #FF8C42 100%)',
        'Creatives': 'linear-gradient(135deg, #9C27B0 0%, #8E24AA 100%)',
        'Sports': 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
    };
    return gradients[category] || 'var(--gradient-blue)';
}

function toggleEventRegistration(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        event.registered = !event.registered;
        alert(event.registered ? `Registered for ${event.title}!` : `Unregistered from ${event.title}`);
        
        // Refresh the dashboard if we're on it
        if (document.getElementById('dashboard').style.display === 'block') {
            loadDashboardContent();
        }
    }
}

// Enhanced Organizer Request System
function requestOrganizer() {
    if (currentUser.isOrganizer) {
        alert('You are already an organizer!');
        return;
    }
    
    const existingRequest = organizerRequests.find(req => req.userId === currentUser.id && req.status === 'pending');
    if (existingRequest) {
        alert('You already have a pending organizer request.');
        return;
    }
    
    const request = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.fullname,
        userEmail: currentUser.email,
        status: 'pending',
        requestedAt: new Date().toISOString()
    };
    
    organizerRequests.push(request);
    localStorage.setItem('organizerRequests', JSON.stringify(organizerRequests));
    
    alert('Organizer request submitted successfully! It will be reviewed by administrators.');
    loadDashboardContent();
}

// Admin Functions
function toggleOrganizerStatus(userId, makeOrganizer) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.isOrganizer = makeOrganizer;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update any pending requests for this user
        const userRequests = organizerRequests.filter(req => req.userId === userId && req.status === 'pending');
        userRequests.forEach(req => {
            req.status = makeOrganizer ? 'approved' : 'rejected';
            req.processedAt = new Date().toISOString();
        });
        localStorage.setItem('organizerRequests', JSON.stringify(organizerRequests));
        
        alert(`${user.fullname} ${makeOrganizer ? 'is now an organizer' : 'is no longer an organizer'}`);
        loadDashboardContent();
    }
}

function approveRequest(requestId) {
    const request = organizerRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'approved';
        request.processedAt = new Date().toISOString();
        
        const user = users.find(u => u.id === request.userId);
        if (user) {
            user.isOrganizer = true;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        localStorage.setItem('organizerRequests', JSON.stringify(organizerRequests));
        alert(`Request approved! ${request.userName} is now an organizer.`);
        loadDashboardContent();
    }
}

function rejectRequest(requestId) {
    const request = organizerRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'rejected';
        request.processedAt = new Date().toISOString();
        localStorage.setItem('organizerRequests', JSON.stringify(organizerRequests));
        alert(`Request rejected for ${request.userName}.`);
        loadDashboardContent();
    }
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    const navLink = document.querySelector(`a[href="#${sectionId}"]`);
    
    if (section && navLink) {
        // Update navigation
        document.querySelectorAll('.dashboard-nav-link').forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
        
        // Update sections
        document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
        section.classList.add('active');
    }
}

function viewAllUsers() {
    showSection('admin-users');
}

function createNewEvent() {
    alert('Create new event feature coming soon!');
}

function manageMyEvents() {
    alert('Manage events feature coming soon!');
}

// Make functions globally available
window.toggleEventRegistration = toggleEventRegistration;
window.requestOrganizer = requestOrganizer;
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.toggleOrganizerStatus = toggleOrganizerStatus;
window.showSection = showSection;
window.viewAllUsers = viewAllUsers;
window.createNewEvent = createNewEvent;
window.manageMyEvents = manageMyEvents;