// Authentication and dashboard functionality

function loadStudentDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    console.log('Loading student dashboard for:', window.eventManager.currentUser.fullname);
    
    dashboard.innerHTML = `
        <div class="dashboard-nav">
            <div class="container">
                <ul class="dashboard-nav-links">
                    <li><a href="#dashboard-home" class="dashboard-nav-link active">Home</a></li>
                    <li><a href="#dashboard-events" class="dashboard-nav-link">Events</a></li>
                    <li><a href="#dashboard-my-events" class="dashboard-nav-link">My Events</a></li>
                    <li><a href="#dashboard-profile" class="dashboard-nav-link">Profile</a></li>
                    <li><a href="#" id="logout-btn">Logout</a></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="dashboard-section active" id="dashboard-home">
                <h2 class="section-title">Welcome, ${window.eventManager.currentUser.fullname}!</h2>
                <p>Welcome to your UniVerse dashboard! Student dashboard loaded successfully.</p>
                
                <div class="events-grid" id="dashboard-events-grid">
                    ${window.eventManager.events.map(function(event) {
                        return window.eventManager.createEventCard(event, true).outerHTML;
                    }).join('')}
                </div>
            </div>
            
            <div class="dashboard-section" id="dashboard-profile">
                <h2 class="section-title">My Profile</h2>
                <div class="profile-info">
                    <p><strong>Name:</strong> ${window.eventManager.currentUser.fullname}</p>
                    <p><strong>Email:</strong> ${window.eventManager.currentUser.email}</p>
                    <p><strong>Role:</strong> ${window.eventManager.currentUser.role}</p>
                </div>
            </div>
        </div>
    `;
    
    setupDashboardNavigation();
}

function loadAdminDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    
    console.log('Loading admin dashboard for:', window.eventManager.currentUser.fullname);
    
    dashboard.innerHTML = `
        <div class="dashboard-nav">
            <div class="container">
                <ul class="dashboard-nav-links">
                    <li><a href="#admin-dashboard" class="dashboard-nav-link active">Dashboard</a></li>
                    <li><a href="#admin-users" class="dashboard-nav-link">Manage Users</a></li>
                    <li><a href="#admin-profile" class="dashboard-nav-link">Profile</a></li>
                    <li><a href="#" id="logout-btn">Logout</a></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="dashboard-section active" id="admin-dashboard">
                <h2 class="section-title">Admin Dashboard</h2>
                <p>Welcome back, Administrator ${window.eventManager.currentUser.fullname}!</p>
                <p>Admin dashboard loaded successfully.</p>
            </div>
            
            <div class="dashboard-section" id="admin-profile">
                <h2 class="section-title">Admin Profile</h2>
                <div class="profile-info">
                    <p><strong>Name:</strong> ${window.eventManager.currentUser.fullname}</p>
                    <p><strong>Email:</strong> ${window.eventManager.currentUser.email}</p>
                    <p><strong>Role:</strong> Administrator</p>
                </div>
            </div>
        </div>
    `;
    
    setupDashboardNavigation();
}

function setupDashboardNavigation() {
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
}

// Make functions available globally
window.loadStudentDashboard = loadStudentDashboard;
window.loadAdminDashboard = loadAdminDashboard;