// Calendar and schedule functionality

let currentCalendarDate = new Date();

function initializeCalendar() {
    renderCalendar(currentCalendarDate);
    setupCalendarEventListeners();
}

function renderCalendar(date) {
    const calendarGrid = document.getElementById('calendar');
    const monthYearDisplay = document.getElementById('current-month');
    
    if (!calendarGrid || !monthYearDisplay) return;
    
    // Update month-year display
    monthYearDisplay.textContent = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Get first day of month and total days
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date other-month';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add days of the month
    const userEvents = window.eventManager.events.filter(event => event.registered);
    
    for (let day = 1; day <= totalDays; day++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date current-month';
        dateCell.textContent = day;
        
        // Check if this date has events
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        const hasEvent = userEvents.some(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === currentDate.toDateString();
        });
        
        if (hasEvent) {
            dateCell.classList.add('has-event');
            const indicator = document.createElement('div');
            indicator.className = 'event-indicator';
            dateCell.appendChild(indicator);
            
            // Add click event to show events for this date
            dateCell.addEventListener('click', () => showDateEvents(currentDate));
        }
        
        // Highlight today
        const today = new Date();
        if (currentDate.toDateString() === today.toDateString()) {
            dateCell.style.background = 'rgba(254, 105, 30, 0.2)';
            dateCell.style.borderColor = 'var(--orange)';
        }
        
        calendarGrid.appendChild(dateCell);
    }
}

function setupCalendarEventListeners() {
    // These are set up in auth.js already
}

function showPreviousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar(currentCalendarDate);
    populateScheduleEvents();
}

function showNextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar(currentCalendarDate);
    populateScheduleEvents();
}

function showDateEvents(date) {
    const userEvents = window.eventManager.events.filter(event => {
        const eventDate = new Date(event.date);
        return event.registered && eventDate.toDateString() === date.toDateString();
    });
    
    if (userEvents.length > 0) {
        let eventList = `Events on ${date.toLocaleDateString()}:\n`;
        userEvents.forEach(event => {
            eventList += `• ${event.title} (${event.time})\n`;
        });
        alert(eventList);
    }
}

function populateScheduleEvents() {
    const scheduleList = document.getElementById('schedule-events-list');
    if (!scheduleList) return;
    
    const userEvents = window.eventManager.events
        .filter(event => event.registered && new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    if (userEvents.length === 0) {
        scheduleList.innerHTML = '<p>No upcoming events in your schedule.</p>';
        return;
    }
    
    scheduleList.innerHTML = userEvents.map(event => `
        <div class="schedule-event-item" style="
            background: white; 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 8px; 
            border-left: 4px solid var(--orange);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        ">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: var(--navy-blue);">${event.title}</h4>
                    <p style="margin: 0; color: var(--dark-gray); font-size: 14px;">
                        <i class="fas fa-calendar"></i> ${new Date(event.date).toLocaleDateString()} 
                        • <i class="fas fa-clock"></i> ${event.time}
                    </p>
                    <p style="margin: 5px 0 0 0; color: var(--dark-gray); font-size: 12px;">
                        <i class="fas fa-map-marker-alt"></i> ${event.location}
                    </p>
                </div>
                <span class="event-category" style="
                    background: var(--light-gray); 
                    padding: 3px 8px; 
                    border-radius: 12px; 
                    font-size: 11px; 
                    font-weight: 600;
                ">${event.category}</span>
            </div>
        </div>
    `).join('');
}

// Add these styles dynamically for calendar
const calendarStyles = `
    .calendar-container {
        background: var(--white);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
    }
    
    .calendar-day {
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        font-weight: 600;
        background: var(--gradient-blue);
        color: var(--white);
    }
    
    .calendar-date {
        padding: 15px;
        text-align: center;
        border-radius: 5px;
        border: 1px solid #ddd;
        min-height: 80px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .calendar-date:hover {
        background: var(--light-gray);
    }
    
    .calendar-date.has-event {
        background: rgba(254, 105, 30, 0.1);
        border-color: var(--orange);
    }
    
    .calendar-date.current-month {
        background: var(--white);
    }
    
    .calendar-date.other-month {
        background: #f8f9fa;
        color: #6c757d;
    }
    
    .event-indicator {
        width: 8px;
        height: 8px;
        background: var(--orange);
        border-radius: 50%;
        margin: 5px auto 0;
    }
    
    .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    
    .stat-card {
        background: var(--white);
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border-left: 4px solid var(--orange);
    }
    
    .stat-card i {
        font-size: 40px;
        color: var(--navy-blue);
        margin-bottom: 15px;
    }
    
    .stat-card h3 {
        font-size: 36px;
        margin: 10px 0;
        color: var(--orange);
    }
    
    .disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = calendarStyles;
document.head.appendChild(styleSheet);