// Events-specific functionality

// Extended event data
const extendedEvents = [
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
        organizer: "Cultural Committee",
        capacity: 500,
        registeredCount: 347,
        price: "Free",
        tags: ["Dance", "Traditional", "Music", "Festive"]
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
        organizer: "Student Council",
        capacity: 1000,
        registeredCount: 856,
        price: "Free",
        tags: ["Welcome", "Networking", "Entertainment"]
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
        organizer: "Sports Committee",
        capacity: 300,
        registeredCount: 245,
        price: "Free",
        tags: ["Sports", "Tournament", "Competition"]
    }
];

// Event management functions
const EventManager = {
    getAllEvents: function() {
        return extendedEvents;
    },

    getEventsByCategory: function(category) {
        return extendedEvents.filter(function(event) {
            return event.category === category;
        });
    },

    getEventById: function(id) {
        return extendedEvents.find(function(event) {
            return event.id === id;
        });
    }
};

// Enhanced event card creation
function createDetailedEventCard(event, showDetails) {
    if (showDetails === undefined) showDetails = false;
    
    const card = document.createElement('div');
    card.className = 'event-card detailed';
    card.setAttribute('data-event-id', event.id);
    
    const progress = (event.registeredCount / event.capacity) * 100;
    const isFull = event.registeredCount >= event.capacity;
    
    card.innerHTML = `
        <div class="event-image" style="background: ${getGradientForCategory(event.category)};">
            <i class="${getCategoryIcon(event.category)}"></i>
            ${isFull ? '<div class="event-full-badge">Full</div>' : ''}
        </div>
        <div class="event-content">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-meta">
                <div class="event-date">
                    <i class="far fa-calendar-alt"></i>
                    ${new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </div>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.location}
                </div>
            </div>
            
            <div class="event-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${event.registeredCount}/${event.capacity} registered</span>
            </div>
            
            <p class="event-description">${event.description.substring(0, 120)}...</p>
            
            <div class="event-tags">
                ${event.tags.map(function(tag) {
                    return `<span class="event-tag">${tag}</span>`;
                }).join('')}
            </div>
            
            <div class="event-actions">
                <span class="event-category">${event.category}</span>
                <button class="btn ${event.registered ? 'btn-secondary' : 'btn-primary'} register-btn" 
                        data-event-id="${event.id}"
                        ${isFull && !event.registered ? 'disabled' : ''}>
                    ${event.registered ? 'Registered' : isFull ? 'Full' : 'Register'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listener
    const registerBtn = card.querySelector('.register-btn');
    if (registerBtn && (!isFull || event.registered)) {
        registerBtn.addEventListener('click', function() {
            handleEventRegistration(event.id);
        });
    }
    
    return card;
}

function getCategoryIcon(category) {
    const icons = {
        'Cultural': 'fas fa-music',
        'Creatives': 'fas fa-paint-brush',
        'Sports': 'fas fa-running',
        'Technology': 'fas fa-laptop-code'
    };
    return icons[category] || 'fas fa-calendar-alt';
}

function getGradientForCategory(category) {
    const gradients = {
        'Cultural': 'linear-gradient(135deg, #FE691E 0%, #FF8C42 100%)',
        'Creatives': 'linear-gradient(135deg, #9C27B0 0%, #8E24AA 100%)',
        'Sports': 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        'Technology': 'linear-gradient(135deg, #000080 0%, #2a2aa0 100%)'
    };
    return gradients[category] || 'var(--gradient-blue)';
}

function handleEventRegistration(eventId) {
    const event = EventManager.getEventById(eventId);
    if (!event) return;
    
    if (event.registered) {
        // Unregister logic
        if (confirm(`Are you sure you want to unregister from "${event.title}"?`)) {
            event.registered = false;
            event.registeredCount = Math.max(0, event.registeredCount - 1);
            updateEventUI(eventId);
            showNotification(`Unregistered from ${event.title}`, 'success');
        }
    } else {
        // Register logic
        if (event.registeredCount >= event.capacity) {
            showNotification('This event is already full!', 'error');
            return;
        }
        
        event.registered = true;
        event.registeredCount++;
        updateEventUI(eventId);
        showNotification(`Successfully registered for ${event.title}`, 'success');
    }
}

function updateEventUI(eventId) {
    const eventCards = document.querySelectorAll('[data-event-id="' + eventId + '"]');
    eventCards.forEach(function(card) {
        const registerBtn = card.querySelector('.register-btn');
        const event = EventManager.getEventById(eventId);
        
        if (registerBtn) {
            registerBtn.textContent = event.registered ? 'Registered' : 'Register';
            registerBtn.className = event.registered ? 'btn btn-secondary register-btn' : 'btn btn-primary register-btn';
            registerBtn.setAttribute('data-event-id', eventId);
        }
        
        // Update progress bar
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        if (progressFill && progressText) {
            const progress = (event.registeredCount / event.capacity) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = event.registeredCount + '/' + event.capacity + ' registered';
        }
    });
}

function showNotification(message, type) {
    if (type === undefined) type = 'info';
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(function(notification) {
        notification.remove();
    });
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }
            .notification-success { background: #4CAF50; }
            .notification-error { background: #f44336; }
            .notification-info { background: #2196F3; }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Replace main events array with extended one
    if (window.eventManager) {
        window.eventManager.events = extendedEvents;
    }
});

// Make functions available globally
window.EventManager = EventManager;
window.createDetailedEventCard = createDetailedEventCard;
window.handleEventRegistration = handleEventRegistration;