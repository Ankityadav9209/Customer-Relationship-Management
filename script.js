// Check authentication
function checkAuth() {
    const session = localStorage.getItem('crm_session');
    if (!session) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize sample data
if (!localStorage.getItem('clients')) {
    const initialClients = [
        { 
            id: 1, 
            name: 'John Smith', 
            email: 'john@example.com', 
            phone: '123-456-7890', 
            company: 'Tech Corp', 
            status: 'Active', 
            birthday: '1990-05-15',
            createdAt: '2024-01-15'
        },
        { 
            id: 2, 
            name: 'Sarah Johnson', 
            email: 'sarah@example.com', 
            phone: '098-765-4321', 
            company: 'Design Co', 
            status: 'Active', 
            birthday: '1988-08-22',
            createdAt: '2024-02-01'
        }
    ];
    localStorage.setItem('clients', JSON.stringify(initialClients));
}

// Update the initial deals data structure
if (!localStorage.getItem('deals')) {
    const initialDeals = [
        { 
            id: 1, 
            title: 'Software License', 
            client: 'Tech Corp', 
            value: 15000, 
            status: 'In Progress', 
            probability: 75,
            createdAt: '2024-03-01',
            lastUpdated: '2024-03-01',
            notes: 'Annual license renewal'
        },
        { 
            id: 2, 
            title: 'Website Redesign', 
            client: 'Design Co', 
            value: 8000, 
            status: 'Won', 
            probability: 100,
            createdAt: '2024-02-15',
            lastUpdated: '2024-03-01',
            notes: 'Complete website overhaul'
        }
    ];
    localStorage.setItem('deals', JSON.stringify(initialDeals));
}

if (!localStorage.getItem('activities')) {
    localStorage.setItem('activities', JSON.stringify([
        { id: 1, type: 'Call', client: 'John Smith', notes: 'Discussed new requirements', date: '2024-03-15', status: 'Completed' },
        { id: 2, type: 'Meeting', client: 'Sarah Johnson', notes: 'Project kickoff', date: '2024-03-16', status: 'Scheduled' }
    ]));
}

if (!localStorage.getItem('targets')) {
    localStorage.setItem('targets', JSON.stringify({
        monthly: { target: 50000, achieved: 23000 },
        quarterly: { target: 150000, achieved: 98000 },
        yearly: { target: 600000, achieved: 320000 }
    }));
}

// Initialize data
let clients = JSON.parse(localStorage.getItem('clients')) || [];
let deals = JSON.parse(localStorage.getItem('deals')) || [];
let activities = JSON.parse(localStorage.getItem('activities')) || [];
let targets = JSON.parse(localStorage.getItem('targets')) || {};

// Load default content
window.onload = () => {
    if (!checkAuth()) return;
    
    // Update user info
    const session = JSON.parse(localStorage.getItem('crm_session'));
    document.querySelector('.user-info span').textContent = session.user.name;
    
    navigate('home');
    updateCounters();
};

// Logout function
function logout() {
    localStorage.removeItem('crm_session');
    if (!localStorage.getItem('crm_remember')) {
        localStorage.removeItem('crm_remember');
    }
    window.location.href = 'login.html';
}

// Add logout functionality to user icon
document.querySelector('.user-info').addEventListener('click', function(e) {
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <div class="user-menu-item">Profile</div>
        <div class="user-menu-item">Settings</div>
        <div class="user-menu-item logout">Logout</div>
    `;
    
    // Position the menu
    const rect = this.getBoundingClientRect();
    userMenu.style.position = 'absolute';
    userMenu.style.top = rect.bottom + 'px';
    userMenu.style.right = '20px';
    
    // Add menu to body
    document.body.appendChild(userMenu);
    
    // Handle menu item clicks
    userMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('logout')) {
            logout();
        }
        userMenu.remove();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!userMenu.contains(e.target) && !document.querySelector('.user-info').contains(e.target)) {
            userMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
});

// Add styles for user menu
const menuStyle = document.createElement('style');
menuStyle.textContent = `
    .user-menu {
        background: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow: hidden;
        z-index: 1000;
    }
    
    .user-menu-item {
        padding: 12px 20px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .user-menu-item:hover {
        background: var(--light-bg);
    }
    
    .user-menu-item.logout {
        color: #dc2626;
    }
`;
document.head.appendChild(menuStyle);

// Update dashboard counters
function updateCounters() {
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const totalDeals = deals.length;
    const wonDeals = deals.filter(d => d.status === 'Won').length;
    const pendingActivities = activities.filter(a => a.status === 'Scheduled').length;

    document.querySelectorAll('.count').forEach(counter => {
        if (counter.parentElement.textContent.includes('CUSTOMERS')) {
            counter.textContent = activeClients;
        } else if (counter.parentElement.textContent.includes('DEALS')) {
            counter.textContent = totalDeals;
        } else if (counter.parentElement.textContent.includes('WON')) {
            counter.textContent = wonDeals;
        } else if (counter.parentElement.textContent.includes('PENDING')) {
            counter.textContent = pendingActivities;
        }
    });
}

// Navigation function
function navigate(page) {
    const content = document.getElementById("main-content");
    let html = "";

    switch (page) {
        case 'home':
            html = `
                <h2>Welcome to ClientNest CRM</h2>
                <div class="dashboard-overview">
                    <div class="quick-stats">
                        <div class="stat-card">
                            <i class="fas fa-users"></i>
                            <div class="stat-info">
                                <h3>Total Clients</h3>
                                <p>${clients.length}</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-handshake"></i>
                            <div class="stat-info">
                                <h3>Active Deals</h3>
                                <p>${deals.filter(d => d.status === 'In Progress').length}</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-calendar"></i>
                            <div class="stat-info">
                                <h3>Today's Activities</h3>
                                <p>${activities.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</p>
                            </div>
                        </div>
                    </div>
                    <div class="recent-activities">
                        <h3>Recent Activities</h3>
                        <div class="activity-list">
                            ${generateRecentActivities()}
                        </div>
                    </div>
                    <div class="upcoming-events">
                        <h3>Upcoming Events</h3>
                        <div class="event-list">
                            ${generateUpcomingEvents()}
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'dashboard':
            const monthlyProgress = (targets.monthly.achieved / targets.monthly.target) * 100;
            const quarterlyProgress = (targets.quarterly.achieved / targets.quarterly.target) * 100;
            const yearlyProgress = (targets.yearly.achieved / targets.yearly.target) * 100;

            html = `
                <h2>Dashboard</h2>
                <div class="dashboard-metrics">
                    <div class="metric-cards">
                        <div class="metric-card">
                            <h3>Monthly Target</h3>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${monthlyProgress}%"></div>
                            </div>
                            <p>$${targets.monthly.achieved} / $${targets.monthly.target}</p>
                        </div>
                        <div class="metric-card">
                            <h3>Quarterly Target</h3>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${quarterlyProgress}%"></div>
                            </div>
                            <p>$${targets.quarterly.achieved} / $${targets.quarterly.target}</p>
                        </div>
                        <div class="metric-card">
                            <h3>Yearly Target</h3>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${yearlyProgress}%"></div>
                            </div>
                            <p>$${targets.yearly.achieved} / $${targets.yearly.target}</p>
                        </div>
                    </div>
                    <div class="deals-overview">
                        <h3>Deals Overview</h3>
                        <div class="deals-chart">
                            <div class="chart-bar won" style="height: ${(deals.filter(d => d.status === 'Won').length / deals.length) * 100}%">
                                <span>Won</span>
                            </div>
                            <div class="chart-bar progress" style="height: ${(deals.filter(d => d.status === 'In Progress').length / deals.length) * 100}%">
                                <span>In Progress</span>
                            </div>
                            <div class="chart-bar lost" style="height: ${(deals.filter(d => d.status === 'Lost').length / deals.length) * 100}%">
                                <span>Lost</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'activity':
            html = `
                <h2>Activity Management</h2>
                <div class="card-container">
                    <div class="card pink">
                        ALL ACTIVITIES 
                        <div class="count">${activities.length}</div>
                    </div>
                    <div class="card purple">
                        SCHEDULED 
                        <div class="count">${activities.filter(a => a.status === 'Scheduled').length}</div>
                    </div>
                    <div class="card blue">
                        COMPLETED 
                        <div class="count">${activities.filter(a => a.status === 'Completed').length}</div>
                    </div>
                    <div class="card orange">
                        TODAY'S ACTIVITIES 
                        <div class="count">${activities.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</div>
                    </div>
                </div>
                <div class="filter-section">
                    <div class="filters">
                        <label>
                            Type 
                            <select id="activityTypeFilter" onchange="filterActivities()">
                                <option value="">All Types</option>
                                <option>Call</option>
                                <option>Meeting</option>
                                <option>Email</option>
                                <option>Task</option>
                            </select>
                        </label>
                        <label>
                            Status 
                            <select id="activityStatusFilter" onchange="filterActivities()">
                                <option value="">All Status</option>
                                <option>Scheduled</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                            </select>
                        </label>
                        <label>
                            Date Range
                            <input type="date" id="activityStartDate" onchange="filterActivities()">
                        </label>
                        <label>
                            to
                            <input type="date" id="activityEndDate" onchange="filterActivities()">
                        </label>
                    </div>
                    <button onclick="openActivityModal()" class="create-btn">
                        <i class="fas fa-plus"></i> Add Activity
                    </button>
                </div>
                <div class="activities-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Client</th>
                                <th>Notes</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="activitiesTableBody">
                            ${generateActivityTable()}
                        </tbody>
                    </table>
                </div>
            `;

            // Remove existing activity modal if present
            const existingActivityModal = document.getElementById('activityModal');
            if (existingActivityModal) {
                existingActivityModal.remove();
            }

            // Add activity modal HTML
            const activityModalHtml = `
                <div id="activityModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeActivityModal()">&times;</span>
                        <h2 id="activityModalTitle">Create New Activity</h2>
                        <form id="activityForm" onsubmit="handleActivitySubmit(event)">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="activityType">Activity Type *</label>
                                    <select id="activityType" required>
                                        <option value="Call">Call</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Email">Email</option>
                                        <option value="Task">Task</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="activityClient">Client *</label>
                                    <select id="activityClient" required>
                                        <option value="">Select Client</option>
                                        ${clients.map(client => `
                                            <option value="${client.name}">${client.name}</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="activityDate">Date *</label>
                                    <input type="date" id="activityDate" required 
                                        value="${new Date().toISOString().split('T')[0]}">
                                </div>
                                <div class="form-group">
                                    <label for="activityStatus">Status</label>
                                    <select id="activityStatus">
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div class="form-group full-width">
                                    <label for="activityNotes">Notes</label>
                                    <textarea id="activityNotes" rows="4" 
                                        placeholder="Enter activity notes"></textarea>
                                </div>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-save"></i> Save Activity
                            </button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', activityModalHtml);
            break;

        case 'target':
            html = `
                <h2>Sales Targets</h2>
                <div class="targets-container">
                    <div class="target-section">
                        <h3>Monthly Target</h3>
                        <div class="target-card">
                            <div class="target-header">
                                <span>Target: $${targets.monthly?.target || 0}</span>
                                <span>Achieved: $${targets.monthly?.achieved || 0}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${calculateProgress(targets.monthly?.achieved || 0, targets.monthly?.target || 0)}%"></div>
                            </div>
                            <div class="target-footer">
                                <span>${calculateProgress(targets.monthly?.achieved || 0, targets.monthly?.target || 0)}% Completed</span>
                                <button onclick="openTargetModal('monthly')" class="edit-btn">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="target-section">
                        <h3>Quarterly Target</h3>
                        <div class="target-card">
                            <div class="target-header">
                                <span>Target: $${targets.quarterly?.target || 0}</span>
                                <span>Achieved: $${targets.quarterly?.achieved || 0}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${calculateProgress(targets.quarterly?.achieved || 0, targets.quarterly?.target || 0)}%"></div>
                            </div>
                            <div class="target-footer">
                                <span>${calculateProgress(targets.quarterly?.achieved || 0, targets.quarterly?.target || 0)}% Completed</span>
                                <button onclick="openTargetModal('quarterly')" class="edit-btn">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="target-section">
                        <h3>Yearly Target</h3>
                        <div class="target-card">
                            <div class="target-header">
                                <span>Target: $${targets.yearly?.target || 0}</span>
                                <span>Achieved: $${targets.yearly?.achieved || 0}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${calculateProgress(targets.yearly?.achieved || 0, targets.yearly?.target || 0)}%"></div>
                            </div>
                            <div class="target-footer">
                                <span>${calculateProgress(targets.yearly?.achieved || 0, targets.yearly?.target || 0)}% Completed</span>
                                <button onclick="openTargetModal('yearly')" class="edit-btn">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Remove existing target modal if present
            const existingTargetModal = document.getElementById('targetModal');
            if (existingTargetModal) {
                existingTargetModal.remove();
            }

            // Add target modal HTML
            const targetModalHtml = `
                <div id="targetModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeTargetModal()">&times;</span>
                        <h2 id="targetModalTitle">Edit Target</h2>
                        <form id="targetForm" onsubmit="handleTargetSubmit(event)">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="targetValue">Target Amount ($) *</label>
                                    <input type="number" id="targetValue" required min="0" step="1000"
                                        placeholder="Enter target amount">
                                </div>
                                <div class="form-group">
                                    <label for="achievedValue">Achieved Amount ($) *</label>
                                    <input type="number" id="achievedValue" required min="0" step="1000"
                                        placeholder="Enter achieved amount">
                                </div>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-save"></i> Save Target
                            </button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', targetModalHtml);
            break;

        case 'performance':
            html = `
                <h2>Sales Performance</h2>
                <div class="performance-metrics">
                    <div class="performance-card">
                        <h3>Deal Success Rate</h3>
                        <div class="metric-circle">
                            <span>${calculateDealSuccessRate()}%</span>
                        </div>
                        <p>Based on closed deals</p>
                    </div>
                    <div class="performance-card">
                        <h3>Average Deal Value</h3>
                        <div class="metric-value">
                            <span>$${calculateAverageDealValue()}</span>
                        </div>
                        <p>Across all won deals</p>
                    </div>
                    <div class="performance-card">
                        <h3>Active Deals</h3>
                        <div class="metric-value">
                            <span>${deals.filter(d => d.status === 'In Progress').length}</span>
                        </div>
                        <p>Currently in pipeline</p>
                    </div>
                </div>
                <div class="performance-chart">
                    <h3>Monthly Performance</h3>
                    <div class="chart-container">
                        ${generatePerformanceChart()}
                    </div>
                </div>
            `;
            break;

        case 'birthdays':
            html = `
                <h2>Client Birthdays</h2>
                <div class="card-container">
                    <div class="card pink">
                        TOTAL BIRTHDAYS 
                        <div class="count">${clients.length}</div>
                    </div>
                    <div class="card purple">
                        THIS MONTH 
                        <div class="count">${getClientsWithBirthdaysThisMonth().length}</div>
                    </div>
                    <div class="card blue">
                        NEXT MONTH 
                        <div class="count">${getClientsWithBirthdaysNextMonth().length}</div>
                    </div>
                    <div class="card orange">
                        THIS WEEK 
                        <div class="count">${getClientsWithBirthdaysThisWeek().length}</div>
                    </div>
                </div>
                <div class="filter-section">
                    <div class="filters">
                        <label>
                            Month
                            <select id="birthdayMonth" onchange="filterBirthdays()">
                                <option value="">All Months</option>
                                ${Array.from({length: 12}, (_, i) => 
                                    `<option value="${i + 1}">${new Date(0, i).toLocaleString('default', { month: 'long' })}</option>`
                                ).join('')}
                            </select>
                        </label>
                        <label>
                            Sort By
                            <select id="birthdaySort" onchange="filterBirthdays()">
                                <option value="upcoming">Upcoming</option>
                                <option value="name">Name</option>
                                <option value="age">Age</option>
                            </select>
                        </label>
                        <label>
                            <input type="checkbox" id="showUpcomingOnly" onchange="filterBirthdays()">
                            Show Upcoming Only
                        </label>
                    </div>
                    <button onclick="exportBirthdays()" class="export-btn">
                        <i class="fas fa-download"></i> Export List
                    </button>
                </div>
                <div class="birthdays-container" id="birthdaysContainer">
                    ${generateBirthdayList()}
                </div>
            `;
            break;

        case 'deals':
            html = `
                <h2>Deals Management</h2>
                <div class="card-container">
                    <div class="card pink">
                        TOTAL DEALS 
                        <div class="count">${deals.length}</div>
                    </div>
                    <div class="card purple">
                        WON DEALS 
                        <div class="count">${deals.filter(d => d.status === 'Won').length}</div>
                    </div>
                    <div class="card blue">
                        IN PROGRESS 
                        <div class="count">${deals.filter(d => d.status === 'In Progress').length}</div>
                    </div>
                    <div class="card orange">
                        TOTAL VALUE 
                        <div class="count">$${calculateTotalDealValue()}</div>
                    </div>
                </div>
                <div class="filter-section">
                    <div class="filters">
                        <label>
                            Status
                            <select id="dealStatusFilter" onchange="filterDeals()">
                                <option value="">All Status</option>
                                <option>In Progress</option>
                                <option>Won</option>
                                <option>Lost</option>
                            </select>
                        </label>
                        <label>
                            Client
                            <select id="dealClientFilter" onchange="filterDeals()">
                                <option value="">All Clients</option>
                                ${[...new Set(clients.map(c => c.company))].filter(Boolean).map(company => 
                                    `<option value="${company}">${company}</option>`
                                ).join('')}
                            </select>
                        </label>
                        <label>
                            Min Value
                            <input type="number" id="minValueFilter" onchange="filterDeals()" placeholder="Min Value">
                        </label>
                        <label>
                            Max Value
                            <input type="number" id="maxValueFilter" onchange="filterDeals()" placeholder="Max Value">
                        </label>
                    </div>
                    <button onclick="openDealModal()" class="create-btn">
                        <i class="fas fa-plus"></i> Create Deal
                    </button>
                </div>
                <div class="deals-table">
                    <table>
                        <thead>
                            <tr>
                                <th onclick="sortDeals('title')">Title <i class="fas fa-sort"></i></th>
                                <th onclick="sortDeals('client')">Client <i class="fas fa-sort"></i></th>
                                <th onclick="sortDeals('value')">Value <i class="fas fa-sort"></i></th>
                                <th onclick="sortDeals('status')">Status <i class="fas fa-sort"></i></th>
                                <th onclick="sortDeals('probability')">Probability <i class="fas fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="dealsTableBody">
                            ${generateDealsTable()}
                        </tbody>
                    </table>
                </div>
            `;

            // Remove existing deal modal if present
            const existingDealModal = document.getElementById('dealModal');
            if (existingDealModal) {
                existingDealModal.remove();
            }

            // Add deal modal
            const dealModalHtml = `
                <div id="dealModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeDealModal()">&times;</span>
                        <h2 id="dealModalTitle">Create New Deal</h2>
                        <form id="dealForm" onsubmit="handleDealSubmit(event)">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="dealTitle">Deal Title *</label>
                                    <input type="text" id="dealTitle" required placeholder="Enter deal title">
                                </div>
                                <div class="form-group">
                                    <label for="dealClient">Client *</label>
                                    <select id="dealClient" required>
                                        <option value="">Select Client</option>
                                        ${clients.filter(client => client.company).map(client => 
                                            `<option value="${client.company}">${client.company}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="dealValue">Value ($) *</label>
                                    <input type="number" id="dealValue" required min="0" step="100" placeholder="Enter deal value">
                                </div>
                                <div class="form-group">
                                    <label for="dealProbability">Probability (%) *</label>
                                    <input type="number" id="dealProbability" required min="0" max="100" value="50" placeholder="Enter probability">
                                </div>
                                <div class="form-group">
                                    <label for="dealStatus">Status *</label>
                                    <select id="dealStatus" required>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Won">Won</option>
                                        <option value="Lost">Lost</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="dealExpectedClose">Expected Close Date</label>
                                    <input type="date" id="dealExpectedClose">
                                </div>
                                <div class="form-group full-width">
                                    <label for="dealNotes">Notes</label>
                                    <textarea id="dealNotes" rows="4" placeholder="Enter deal notes"></textarea>
                                </div>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-save"></i> Save Deal
                            </button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', dealModalHtml);
            break;

        case 'clients':
            html = `
                <h2>Clients</h2>
                <div class="card-container">
                    <div class="card pink">
                        ALL CUSTOMERS 
                        <div class="count">${clients.length}</div>
                    </div>
                    <div class="card purple">
                        ACTIVE CLIENTS 
                        <div class="count">${clients.filter(c => c.status === 'Active').length}</div>
                    </div>
                    <div class="card blue">
                        NEW THIS MONTH 
                        <div class="count">${getNewClientsThisMonth()}</div>
                    </div>
                    <div class="card orange">
                        INACTIVE CLIENTS 
                        <div class="count">${clients.filter(c => c.status === 'Inactive').length}</div>
                    </div>
                </div>
                <div class="filter-section">
                    <div class="filters">
                        <label>
                            Start date 
                            <input type="date" id="startDate" onchange="filterClients()" />
                        </label>
                        <label>
                            End date 
                            <input type="date" id="endDate" onchange="filterClients()" />
                        </label>
                        <label>
                            Status 
                            <select id="statusFilter" onchange="filterClients()">
                                <option value="">All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Pending</option>
                            </select>
                        </label>
                    </div>
                    <button onclick="openClientModal()" class="create-btn">
                        <i class="fas fa-plus"></i> Create Client
                    </button>
                </div>
                <div class="clients-table">
                    <table>
                        <thead>
                            <tr>
                                <th onclick="sortClients('name')">Name <i class="fas fa-sort"></i></th>
                                <th onclick="sortClients('email')">Email <i class="fas fa-sort"></i></th>
                                <th onclick="sortClients('phone')">Phone <i class="fas fa-sort"></i></th>
                                <th onclick="sortClients('company')">Company <i class="fas fa-sort"></i></th>
                                <th onclick="sortClients('status')">Status <i class="fas fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="clientsTableBody">
                            ${generateClientsTable()}
                        </tbody>
                    </table>
                </div>
            `;

            // Remove existing modal if present
            const existingModal = document.getElementById('clientModal');
            if (existingModal) {
                existingModal.remove();
            }

            // Add client modal
            const modalHtml = `
                <div id="clientModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeClientModal()">&times;</span>
                        <h2 id="modalTitle">Create New Client</h2>
                        <form id="clientForm" onsubmit="handleClientSubmit(event)">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="clientName">Client Name *</label>
                                    <input type="text" id="clientName" required placeholder="Enter client name">
                                </div>
                                <div class="form-group">
                                    <label for="clientEmail">Email Address *</label>
                                    <input type="email" id="clientEmail" required placeholder="Enter email address">
                                </div>
                                <div class="form-group">
                                    <label for="clientPhone">Phone Number *</label>
                                    <input type="tel" id="clientPhone" required placeholder="Enter phone number">
                                </div>
                                <div class="form-group">
                                    <label for="clientCompany">Company Name</label>
                                    <input type="text" id="clientCompany" placeholder="Enter company name">
                                </div>
                                <div class="form-group">
                                    <label for="clientBirthday">Birthday</label>
                                    <input type="date" id="clientBirthday">
                                </div>
                                <div class="form-group">
                                    <label for="clientStatus">Status</label>
                                    <select id="clientStatus">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-save"></i> Save Client
                            </button>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            break;

        default:
            html = `<h2>${page.charAt(0).toUpperCase() + page.slice(1)}</h2><p>This section is under development.</p>`;
    }

    content.innerHTML = html;

    // Set active link
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    const allItems = document.querySelectorAll('.sidebar li');
    for (let item of allItems) {
        if (item.innerText.toLowerCase().includes(page)) {
            item.classList.add('active');
            break;
        }
    }

    // Initialize tooltips
    setTimeout(initTooltips, 100);
}

// Helper functions
function generateRecentActivities() {
    return activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type.toLowerCase()}">
                    <i class="fas fa-${activity.type === 'Call' ? 'phone' : activity.type === 'Meeting' ? 'users' : 'envelope'}"></i>
                </div>
                <div class="activity-details">
                    <h4>${activity.type} with ${activity.client}</h4>
                    <p>${activity.notes}</p>
                    <span class="activity-date">${formatDate(activity.date)}</span>
                </div>
            </div>
        `).join('');
}

function generateUpcomingEvents() {
    const today = new Date();
    const upcomingBirthdays = clients
        .filter(client => {
            const birthday = new Date(client.birthday);
            const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }
            return nextBirthday <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        })
        .map(client => ({
            type: 'birthday',
            client: client.name,
            date: client.birthday
        }));

    const upcomingActivities = activities
        .filter(activity => new Date(activity.date) > today)
        .map(activity => ({
            type: activity.type.toLowerCase(),
            client: activity.client,
            date: activity.date
        }));

    return [...upcomingBirthdays, ...upcomingActivities]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)
        .map(event => `
            <div class="event-item ${event.type}">
                <div class="event-icon">
                    <i class="fas fa-${event.type === 'birthday' ? 'birthday-cake' : event.type === 'call' ? 'phone' : 'calendar'}"></i>
                </div>
                <div class="event-details">
                    <h4>${event.type === 'birthday' ? `${event.client}'s Birthday` : `${event.type} with ${event.client}`}</h4>
                    <span class="event-date">${formatDate(event.date)}</span>
                </div>
            </div>
        `).join('');
}

function generateActivityTable(activitiesToShow = activities) {
    if (!Array.isArray(activitiesToShow) || activitiesToShow.length === 0) {
        return '<tr><td colspan="6" class="text-center">No activities found</td></tr>';
    }

    return activitiesToShow.map(activity => `
        <tr>
            <td>${formatDate(activity.date)}</td>
            <td>${activity.type}</td>
            <td>${activity.client}</td>
            <td>${activity.notes || '-'}</td>
            <td><span class="status ${activity.status.toLowerCase()}">${activity.status}</span></td>
            <td>
                <button onclick="editActivity(${activity.id})" class="action-btn edit" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteActivity(${activity.id})" class="action-btn delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function generateDealsTable(dealsToShow = deals) {
    if (!Array.isArray(dealsToShow) || dealsToShow.length === 0) {
        return '<tr><td colspan="6" class="text-center">No deals found</td></tr>';
    }

    return dealsToShow.map(deal => `
        <tr>
            <td>${deal.title || ''}</td>
            <td>${deal.client || ''}</td>
            <td>$${(deal.value || 0).toLocaleString()}</td>
            <td><span class="status ${(deal.status || '').toLowerCase().replace(' ', '-')}">${deal.status || 'N/A'}</span></td>
            <td>
                <div class="probability-bar">
                    <div class="probability-fill" style="width: ${deal.probability || 0}%"></div>
                    <span>${deal.probability || 0}%</span>
                </div>
            </td>
            <td>
                <button onclick="editDeal(${deal.id})" class="action-btn edit" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteDeal(${deal.id})" class="action-btn delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="viewDealDetails(${deal.id})" class="action-btn view" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function generateBirthdayList(filteredClients = null) {
    const clientsToShow = filteredClients || clients;
    
    if (!clientsToShow.length) {
        return '<div class="no-data">No birthdays found</div>';
    }

    const today = new Date();
    const sortedClients = clientsToShow
        .filter(client => client.birthday)
        .map(client => {
            const birthday = new Date(client.birthday);
            const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
            if (thisYearBirthday < today) {
                thisYearBirthday.setFullYear(today.getFullYear() + 1);
            }
            const daysUntil = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
            return { ...client, daysUntil, thisYearBirthday };
        })
        .sort((a, b) => a.daysUntil - b.daysUntil);

    return sortedClients.map(client => `
        <div class="birthday-card ${client.daysUntil <= 7 ? 'upcoming' : ''}">
            <div class="birthday-icon">
                <i class="fas fa-birthday-cake"></i>
            </div>
            <div class="birthday-details">
                <div class="birthday-header">
                    <h4>${client.name}</h4>
                    ${client.daysUntil <= 7 ? '<span class="soon-tag">Coming Soon!</span>' : ''}
                </div>
                <p class="birthday-date">
                    <i class="fas fa-calendar"></i> 
                    ${formatDate(client.birthday)} (Age: ${calculateAge(client.birthday)})
                </p>
                <p class="birthday-info">
                    <i class="fas fa-clock"></i>
                    ${client.daysUntil === 0 ? 'Today!' : 
                      client.daysUntil === 1 ? 'Tomorrow!' :
                      `${client.daysUntil} days remaining`}
                </p>
                <div class="birthday-contact">
                    <a href="mailto:${client.email}" class="contact-btn">
                        <i class="fas fa-envelope"></i> Send Email
                    </a>
                    <a href="tel:${client.phone}" class="contact-btn">
                        <i class="fas fa-phone"></i> Call
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function generatePerformanceChart() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = months.slice(currentMonth - 5, currentMonth + 1);
    
    return `
        <div class="performance-bars">
            ${lastSixMonths.map((month, index) => `
                <div class="performance-bar">
                    <div class="bar-fill" style="height: ${Math.random() * 100}%"></div>
                    <span class="month-label">${month}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function calculateDealSuccessRate() {
    const closedDeals = deals.filter(d => d.status === 'Won' || d.status === 'Lost').length;
    const wonDeals = deals.filter(d => d.status === 'Won').length;
    return closedDeals ? Math.round((wonDeals / closedDeals) * 100) : 0;
}

function calculateAverageDealValue() {
    const wonDeals = deals.filter(d => d.status === 'Won');
    const totalValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    return wonDeals.length ? Math.round(totalValue / wonDeals.length) : 0;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function calculateDaysUntilBirthday(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = Math.abs(nextBirthday - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Client management functions
function generateClientsTable(clientsToShow = clients) {
    return clientsToShow.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.company || '-'}</td>
            <td><span class="status ${client.status.toLowerCase()}">${client.status}</span></td>
            <td>
                <button onclick="editClient(${client.id})" class="action-btn edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteClient(${client.id})" class="action-btn delete">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="viewClientDetails(${client.id})" class="action-btn view">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getNewClientsThisMonth() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return clients.filter(client => new Date(client.createdAt) >= firstDayOfMonth).length;
}

let currentSort = { field: null, ascending: true };

function sortClients(field) {
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }

    const sortedClients = [...clients].sort((a, b) => {
        let comparison = 0;
        if (a[field] < b[field]) comparison = -1;
        if (a[field] > b[field]) comparison = 1;
        return currentSort.ascending ? comparison : -comparison;
    });

    document.getElementById('clientsTableBody').innerHTML = generateClientsTable(sortedClients);
}

function filterClients() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const status = document.getElementById('statusFilter').value;

    let filteredClients = [...clients];

    if (startDate) {
        filteredClients = filteredClients.filter(client => 
            client.createdAt >= startDate
        );
    }

    if (endDate) {
        filteredClients = filteredClients.filter(client => 
            client.createdAt <= endDate
        );
    }

    if (status) {
        filteredClients = filteredClients.filter(client => 
            client.status === status
        );
    }

    document.getElementById('clientsTableBody').innerHTML = generateClientsTable(filteredClients);
}

function editClient(clientId) {
    openClientModal(clientId);
}

function openClientModal(clientId = null) {
    const modal = document.getElementById('clientModal');
    const form = document.getElementById('clientForm');
    const modalTitle = document.getElementById('modalTitle');

    if (clientId) {
        const client = clients.find(c => c.id === clientId);
        if (!client) return;
        
        modalTitle.textContent = 'Edit Client';
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientEmail').value = client.email;
        document.getElementById('clientPhone').value = client.phone;
        document.getElementById('clientCompany').value = client.company || '';
        document.getElementById('clientBirthday').value = client.birthday || '';
        document.getElementById('clientStatus').value = client.status;
        form.dataset.clientId = clientId;
    } else {
        modalTitle.textContent = 'Create New Client';
        document.getElementById('clientName').value = '';
        document.getElementById('clientEmail').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('clientCompany').value = '';
        document.getElementById('clientBirthday').value = '';
        document.getElementById('clientStatus').value = 'Active';
        delete form.dataset.clientId;
    }

    modal.style.display = 'block';

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            closeClientModal();
        }
    }
}

function handleClientSubmit(event) {
    event.preventDefault();
    console.log('Form submitted'); // Debug log
    
    try {
        const clientData = {
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            phone: document.getElementById('clientPhone').value,
            company: document.getElementById('clientCompany').value,
            birthday: document.getElementById('clientBirthday').value,
            status: document.getElementById('clientStatus').value,
            createdAt: new Date().toISOString().split('T')[0]
        };

        console.log('Client data:', clientData); // Debug log

        const clientId = event.target.dataset.clientId;
        console.log('Client ID:', clientId); // Debug log

        if (clientId) {
            // Update existing client
            const index = clients.findIndex(c => c.id === parseInt(clientId));
            if (index !== -1) {
                clients[index] = { ...clients[index], ...clientData };
                console.log('Updated client at index:', index); // Debug log
            }
        } else {
            // Create new client
            clientData.id = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
            clients.push(clientData);
            console.log('Created new client with ID:', clientData.id); // Debug log
        }

        // Update localStorage
        localStorage.setItem('clients', JSON.stringify(clients));
        console.log('Updated localStorage'); // Debug log

        // Close modal and refresh view
        closeClientModal();
        navigate('clients');
        
        // Show success message
        showNotification('Client saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving client:', error);
        showNotification('Error saving client. Please try again.', 'error');
    }
}

function closeClientModal() {
    document.getElementById('clientModal').style.display = 'none';
}

function deleteClient(clientId) {
    if (confirm('Are you sure you want to delete this client?')) {
        clients = clients.filter(c => c.id !== clientId);
        localStorage.setItem('clients', JSON.stringify(clients));
        navigate('clients');
    }
}

function viewClientDetails(clientId) {
    const client = clients.find(c => c.id === clientId);
    const deals = JSON.parse(localStorage.getItem('deals') || '[]')
        .filter(d => d.client === client.company);
    const activities = JSON.parse(localStorage.getItem('activities') || '[]')
        .filter(a => a.client === client.name);

    const modalHtml = `
        <div id="clientDetailsModal" class="modal">
            <div class="modal-content wide">
                <span class="close" onclick="document.getElementById('clientDetailsModal').remove()">&times;</span>
                <h2>${client.name}</h2>
                <div class="client-details">
                    <div class="detail-section">
                        <h3>Contact Information</h3>
                        <p><i class="fas fa-envelope"></i> ${client.email}</p>
                        <p><i class="fas fa-phone"></i> ${client.phone}</p>
                        <p><i class="fas fa-building"></i> ${client.company || '-'}</p>
                        <p><i class="fas fa-birthday-cake"></i> ${client.birthday ? formatDate(client.birthday) : '-'}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Deals (${deals.length})</h3>
                        ${deals.map(deal => `
                            <div class="detail-item">
                                <span>${deal.title}</span>
                                <span>$${deal.value}</span>
                                <span class="status ${deal.status.toLowerCase()}">${deal.status}</span>
                            </div>
                        `).join('') || '<p>No deals found</p>'}
                    </div>
                    <div class="detail-section">
                        <h3>Recent Activities (${activities.length})</h3>
                        ${activities.map(activity => `
                            <div class="detail-item">
                                <span>${activity.type}</span>
                                <span>${activity.notes}</span>
                                <span>${formatDate(activity.date)}</span>
                            </div>
                        `).join('') || '<p>No activities found</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Add client-specific styles
const clientStyles = document.createElement('style');
clientStyles.textContent = `
    .modal.wide .modal-content {
        max-width: 800px;
    }

    .client-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .detail-section {
        background: var(--light-bg);
        padding: 20px;
        border-radius: 10px;
    }

    .detail-section h3 {
        margin-bottom: 15px;
        color: var(--text-dark);
    }

    .detail-section p {
        margin: 10px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .detail-item:last-child {
        border-bottom: none;
    }

    .action-btn.view {
        background: var(--primary-color);
    }

    .clients-table th {
        cursor: pointer;
    }

    .clients-table th:hover {
        background: #e5e5e5;
    }
`;
document.head.appendChild(clientStyles);

// Add necessary styles
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .dashboard-overview {
        display: grid;
        gap: 20px;
        margin-top: 20px;
    }

    .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }

    .stat-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .stat-card i {
        font-size: 24px;
        color: var(--primary-color);
    }

    .activity-list, .event-list {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-top: 10px;
    }

    .activity-item, .event-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }

    .activity-icon, .event-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--light-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
    }

    .performance-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }

    .performance-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
    }

    .metric-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 8px solid var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px auto;
        font-size: 24px;
        font-weight: bold;
    }

    .birthday-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .birthday-icon {
        width: 50px;
        height: 50px;
        background: var(--light-bg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        font-size: 20px;
    }

    .probability-bar {
        width: 100px;
        height: 20px;
        background: #eee;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
    }

    .probability-fill {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s;
    }

    .probability-bar span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
    }

    .performance-chart {
        background: white;
        padding: 20px;
        border-radius: 10px;
        margin-top: 20px;
    }

    .performance-bars {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 200px;
        margin-top: 20px;
    }

    .performance-bar {
        width: 40px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .bar-fill {
        width: 100%;
        background: var(--primary-color);
        border-radius: 5px 5px 0 0;
        transition: height 0.3s;
    }

    .month-label {
        margin-top: 10px;
        color: #666;
    }

    .target-section {
        background: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .progress-bar {
        width: 100%;
        height: 10px;
        background: #eee;
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0;
    }

    .progress {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s;
    }

    .target-header, .target-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
    }
`;

document.head.appendChild(additionalStyles);

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        overflow-y: auto;
    }

    .modal-content {
        background-color: #fefefe;
        margin: 20px auto;
        padding: 30px;
        border-radius: 10px;
        width: 90%;
        max-width: 600px;
        position: relative;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal h2 {
        margin-bottom: 25px;
        color: var(--text-dark);
        font-size: 24px;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--light-bg);
    }

    .close {
        position: absolute;
        right: 25px;
        top: 20px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #666;
        transition: color 0.3s;
    }

    .close:hover {
        color: #333;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 0;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-dark);
    }

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s, box-shadow 0.3s;
        background-color: #fff;
    }

    .form-group input:focus,
    .form-group select:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        outline: none;
    }

    .form-group input:hover,
    .form-group select:hover {
        border-color: #b3b3b3;
    }

    .submit-btn {
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        transition: background-color 0.3s;
        margin-top: 20px;
    }

    .submit-btn:hover {
        background: var(--primary-dark);
    }

    .submit-btn:active {
        transform: translateY(1px);
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }

        .modal-content {
            width: 95%;
            margin: 10px auto;
            padding: 20px;
        }
    }
`;

document.head.appendChild(modalStyles);

// Add notification system
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
        <div class="notification-progress"></div>
    `;
    
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    document.body.appendChild(notification);
    
    // Add progress bar animation
    notification.querySelector('.notification-progress').style.animation = `progress ${duration}ms linear`;
    
    // Remove notification after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    }

    .notification.success {
        background: var(--success-color);
    }

    .notification.error {
        background: var(--error-color);
    }

    .notification.warning {
        background: var(--warning-color);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification-content i {
        font-size: 20px;
    }

    .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        width: 100%;
        transform-origin: left;
    }

    @keyframes progress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
    }

    .notification.fade-out {
        animation: slideOut 0.3s ease forwards;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Add activity functions
function openActivityModal(activityId = null) {
    const modal = document.getElementById('activityModal');
    const form = document.getElementById('activityForm');
    const modalTitle = document.getElementById('activityModalTitle');

    if (activityId) {
        const activity = activities.find(a => a.id === activityId);
        if (!activity) return;
        
        modalTitle.textContent = 'Edit Activity';
        document.getElementById('activityType').value = activity.type;
        document.getElementById('activityClient').value = activity.client;
        document.getElementById('activityNotes').value = activity.notes || '';
        document.getElementById('activityDate').value = activity.date;
        document.getElementById('activityStatus').value = activity.status;
        form.dataset.activityId = activityId;
    } else {
        modalTitle.textContent = 'Create New Activity';
        document.getElementById('activityType').value = 'Call';
        document.getElementById('activityClient').value = '';
        document.getElementById('activityNotes').value = '';
        document.getElementById('activityDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('activityStatus').value = 'Scheduled';
        delete form.dataset.activityId;
    }

    // Populate client dropdown with existing clients
    const clientSelect = document.getElementById('activityClient');
    clientSelect.innerHTML = '<option value="">Select Client</option>' +
        clients.map(client => `<option value="${client.name}">${client.name}</option>`).join('');

    modal.style.display = 'block';
}

function closeActivityModal() {
    const modal = document.getElementById('activityModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleActivitySubmit(event) {
    event.preventDefault();
    console.log('Activity form submitted');

    try {
        const activityData = {
            type: document.getElementById('activityType').value,
            client: document.getElementById('activityClient').value,
            notes: document.getElementById('activityNotes').value || '',
            date: document.getElementById('activityDate').value,
            status: document.getElementById('activityStatus').value
        };

        console.log('Activity data:', activityData);

        if (!activityData.client) {
            showNotification('Please select a client', 'error');
            return;
        }

        const activityId = event.target.dataset.activityId;

        if (activityId) {
            // Update existing activity
            const index = activities.findIndex(a => a.id === parseInt(activityId));
            if (index !== -1) {
                activities[index] = { ...activities[index], ...activityData };
                console.log('Updated activity at index:', index);
            }
        } else {
            // Create new activity
            activityData.id = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
            activities.push(activityData);
            console.log('Created new activity with ID:', activityData.id);
        }

        localStorage.setItem('activities', JSON.stringify(activities));
        console.log('Updated localStorage');

        closeActivityModal();
        navigate('activity');
        showNotification('Activity saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving activity:', error);
        showNotification('Error saving activity. Please try again.', 'error');
    }
}

// Add activity styles
const activityStyles = document.createElement('style');
activityStyles.textContent = `
    .activities-table {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .activities-table table {
        width: 100%;
        border-collapse: collapse;
    }

    .activities-table th,
    .activities-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    .activities-table th {
        font-weight: 600;
        color: var(--text-dark);
        background: var(--light-bg);
    }

    .activities-table tr:hover {
        background: #f8f9fa;
    }

    #activityNotes {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        resize: vertical;
        min-height: 100px;
        font-family: inherit;
    }

    #activityNotes:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        outline: none;
    }

    .text-center {
        text-align: center;
    }

    .status.scheduled {
        background: #e3f2fd;
        color: #1976d2;
    }

    .status.completed {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .status.cancelled {
        background: #ffebee;
        color: #c62828;
    }
`;
document.head.appendChild(activityStyles);

// Add activity filter function
function filterActivities() {
    const typeFilter = document.getElementById('activityTypeFilter').value;
    const statusFilter = document.getElementById('activityStatusFilter').value;
    const startDate = document.getElementById('activityStartDate').value;
    const endDate = document.getElementById('activityEndDate').value;

    let filteredActivities = [...activities];

    if (typeFilter) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.type === typeFilter
        );
    }

    if (statusFilter) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.status === statusFilter
        );
    }

    if (startDate) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.date >= startDate
        );
    }

    if (endDate) {
        filteredActivities = filteredActivities.filter(activity => 
            activity.date <= endDate
        );
    }

    document.getElementById('activitiesTableBody').innerHTML = generateActivityTable(filteredActivities);
}

function editActivity(activityId) {
    openActivityModal(activityId);
}

function deleteActivity(activityId) {
    if (confirm('Are you sure you want to delete this activity?')) {
        activities = activities.filter(a => a.id !== activityId);
        localStorage.setItem('activities', JSON.stringify(activities));
        navigate('activity');
        showNotification('Activity deleted successfully!', 'success');
    }
}

// Add target functions
function calculateProgress(achieved, target) {
    if (!target || target === 0) return 0;
    return Math.round((achieved / target) * 100);
}

function openTargetModal(period) {
    const modal = document.getElementById('targetModal');
    const form = document.getElementById('targetForm');
    const modalTitle = document.getElementById('targetModalTitle');

    modalTitle.textContent = `Edit ${period.charAt(0).toUpperCase() + period.slice(1)} Target`;
    
    // Set current values
    const currentTarget = targets[period] || { target: 0, achieved: 0 };
    document.getElementById('targetValue').value = currentTarget.target || 0;
    document.getElementById('achievedValue').value = currentTarget.achieved || 0;
    
    // Store the period being edited
    form.dataset.period = period;

    modal.style.display = 'block';

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            closeTargetModal();
        }
    }
}

function closeTargetModal() {
    const modal = document.getElementById('targetModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleTargetSubmit(event) {
    event.preventDefault();
    console.log('Target form submitted');

    try {
        const period = event.target.dataset.period;
        const targetData = {
            target: parseFloat(document.getElementById('targetValue').value) || 0,
            achieved: parseFloat(document.getElementById('achievedValue').value) || 0
        };

        console.log('Target data:', targetData);

        // Initialize targets object if needed
        if (!targets[period]) {
            targets[period] = {};
        }

        // Update target data
        targets[period] = targetData;

        // Save to localStorage
        localStorage.setItem('targets', JSON.stringify(targets));
        console.log('Updated localStorage');

        closeTargetModal();
        navigate('target');
        showNotification('Target updated successfully!', 'success');
    } catch (error) {
        console.error('Error saving target:', error);
        showNotification('Error saving target. Please try again.', 'error');
    }
}

// Add target styles
const targetStyles = document.createElement('style');
targetStyles.textContent = `
    .targets-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .target-section {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .target-section h3 {
        margin-bottom: 15px;
        color: var(--text-dark);
        font-size: 18px;
    }

    .target-card {
        background: var(--light-bg);
        border-radius: 8px;
        padding: 15px;
    }

    .target-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-weight: 500;
    }

    .target-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
    }

    .progress {
        height: 100%;
        background: var(--primary-color);
        border-radius: 4px;
        transition: width 0.3s ease;
    }

    .edit-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: background-color 0.3s;
    }

    .edit-btn:hover {
        background: var(--primary-dark);
    }

    .edit-btn i {
        font-size: 12px;
    }

    #targetForm .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }

    @media (max-width: 768px) {
        #targetForm .form-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(targetStyles);

// Add birthday helper functions
function getClientsWithBirthdaysThisMonth() {
    const today = new Date();
    return clients.filter(client => {
        const birthday = new Date(client.birthday);
        return birthday.getMonth() === today.getMonth();
    });
}

function getClientsWithBirthdaysNextMonth() {
    const today = new Date();
    const nextMonth = today.getMonth() + 1;
    return clients.filter(client => {
        const birthday = new Date(client.birthday);
        return birthday.getMonth() === nextMonth % 12;
    });
}

function getClientsWithBirthdaysThisWeek() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return clients.filter(client => {
        if (!client.birthday) return false;
        const birthday = new Date(client.birthday);
        const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
        return thisYearBirthday >= today && thisYearBirthday <= nextWeek;
    });
}

function filterBirthdays() {
    const monthFilter = document.getElementById('birthdayMonth').value;
    const sortBy = document.getElementById('birthdaySort').value;
    const showUpcomingOnly = document.getElementById('showUpcomingOnly').checked;
    
    let filteredClients = [...clients].filter(client => client.birthday);

    if (monthFilter) {
        filteredClients = filteredClients.filter(client => {
            const birthday = new Date(client.birthday);
            return birthday.getMonth() + 1 === parseInt(monthFilter);
        });
    }

    if (showUpcomingOnly) {
        const today = new Date();
        filteredClients = filteredClients.filter(client => {
            const birthday = new Date(client.birthday);
            const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
            if (thisYearBirthday < today) {
                thisYearBirthday.setFullYear(today.getFullYear() + 1);
            }
            const daysUntil = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
            return daysUntil <= 30;
        });
    }

    // Sort clients based on selected criteria
    filteredClients.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'age':
                return calculateAge(b.birthday) - calculateAge(a.birthday);
            default: // 'upcoming'
                const today = new Date();
                const birthdayA = new Date(a.birthday);
                const birthdayB = new Date(b.birthday);
                const thisYearA = new Date(today.getFullYear(), birthdayA.getMonth(), birthdayA.getDate());
                const thisYearB = new Date(today.getFullYear(), birthdayB.getMonth(), birthdayB.getDate());
                if (thisYearA < today) thisYearA.setFullYear(today.getFullYear() + 1);
                if (thisYearB < today) thisYearB.setFullYear(today.getFullYear() + 1);
                return thisYearA - thisYearB;
        }
    });

    document.getElementById('birthdaysContainer').innerHTML = generateBirthdayList(filteredClients);
}

function exportBirthdays() {
    const birthdays = clients
        .filter(client => client.birthday)
        .map(client => ({
            Name: client.name,
            Birthday: formatDate(client.birthday),
            Age: calculateAge(client.birthday),
            Email: client.email,
            Phone: client.phone
        }));

    const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Birthday,Age,Email,Phone\n" +
        birthdays.map(row => 
            Object.values(row).join(",")
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "birthday_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Birthday list exported successfully!', 'success');
}

// Add birthday styles
const birthdayStyles = document.createElement('style');
birthdayStyles.textContent = `
    .birthdays-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .birthday-card {
        background: white;
        border-radius: 10px;
        padding: 20px;
        display: flex;
        gap: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .birthday-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .birthday-card.upcoming {
        border: 2px solid var(--primary-color);
        background: linear-gradient(to right, white, #f8f9ff);
    }

    .birthday-icon {
        width: 50px;
        height: 50px;
        background: var(--light-bg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        font-size: 20px;
    }

    .birthday-details {
        flex: 1;
    }

    .birthday-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .birthday-header h4 {
        margin: 0;
        color: var(--text-dark);
        font-size: 16px;
    }

    .soon-tag {
        background: var(--primary-color);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    }

    .birthday-date, .birthday-info {
        margin: 5px 0;
        color: #666;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .birthday-contact {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }

    .contact-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 13px;
        text-decoration: none;
        color: var(--primary-color);
        background: var(--light-bg);
        transition: background-color 0.3s;
    }

    .contact-btn:hover {
        background: #e8e8e8;
    }

    .export-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        transition: background-color 0.3s;
    }

    .export-btn:hover {
        background: var(--primary-dark);
    }

    .no-data {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        background: white;
        border-radius: 10px;
        color: #666;
    }

    @media (max-width: 768px) {
        .birthdays-container {
            grid-template-columns: 1fr;
        }

        .birthday-contact {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(birthdayStyles);

// Add deal management functions
function calculateTotalDealValue() {
    return deals.reduce((total, deal) => total + deal.value, 0).toLocaleString();
}

let dealSortConfig = { field: null, ascending: true };

function sortDeals(field) {
    if (dealSortConfig.field === field) {
        dealSortConfig.ascending = !dealSortConfig.ascending;
    } else {
        dealSortConfig.field = field;
        dealSortConfig.ascending = true;
    }

    const sortedDeals = [...deals].sort((a, b) => {
        let comparison = 0;
        if (a[field] < b[field]) comparison = -1;
        if (a[field] > b[field]) comparison = 1;
        return dealSortConfig.ascending ? comparison : -comparison;
    });

    document.getElementById('dealsTableBody').innerHTML = generateDealsTable(sortedDeals);
}

function filterDeals() {
    const statusFilter = document.getElementById('dealStatusFilter').value;
    const clientFilter = document.getElementById('dealClientFilter').value;
    const minValue = document.getElementById('minValueFilter').value;
    const maxValue = document.getElementById('maxValueFilter').value;

    let filteredDeals = [...deals];

    if (statusFilter) {
        filteredDeals = filteredDeals.filter(deal => deal.status === statusFilter);
    }

    if (clientFilter) {
        filteredDeals = filteredDeals.filter(deal => deal.client === clientFilter);
    }

    if (minValue) {
        filteredDeals = filteredDeals.filter(deal => deal.value >= parseFloat(minValue));
    }

    if (maxValue) {
        filteredDeals = filteredDeals.filter(deal => deal.value <= parseFloat(maxValue));
    }

    document.getElementById('dealsTableBody').innerHTML = generateDealsTable(filteredDeals);
}

function openDealModal(dealId = null) {
    const modal = document.getElementById('dealModal');
    const form = document.getElementById('dealForm');
    const modalTitle = document.getElementById('dealModalTitle');

    if (dealId) {
        const deal = deals.find(d => d.id === dealId);
        if (!deal) return;

        modalTitle.textContent = 'Edit Deal';
        document.getElementById('dealTitle').value = deal.title || '';
        document.getElementById('dealClient').value = deal.client || '';
        document.getElementById('dealValue').value = deal.value || '';
        document.getElementById('dealProbability').value = deal.probability || 50;
        document.getElementById('dealStatus').value = deal.status || 'In Progress';
        document.getElementById('dealExpectedClose').value = deal.expectedClose || '';
        document.getElementById('dealNotes').value = deal.notes || '';
        form.dataset.dealId = dealId;
    } else {
        modalTitle.textContent = 'Create New Deal';
        form.reset();
        document.getElementById('dealProbability').value = 50; // Set default probability
        document.getElementById('dealStatus').value = 'In Progress'; // Set default status
        delete form.dataset.dealId;
    }

    // Populate client dropdown
    const clientSelect = document.getElementById('dealClient');
    const uniqueCompanies = [...new Set(clients.map(c => c.company).filter(Boolean))];
    clientSelect.innerHTML = `
        <option value="">Select Client</option>
        ${uniqueCompanies.map(company => 
            `<option value="${company}">${company}</option>`
        ).join('')}
    `;

    modal.style.display = 'block';
}

function closeDealModal() {
    document.getElementById('dealModal').style.display = 'none';
}

function handleDealSubmit(event) {
    event.preventDefault();
    showLoading();

    setTimeout(() => {
        try {
            const dealData = {
                title: document.getElementById('dealTitle').value.trim(),
                client: document.getElementById('dealClient').value,
                value: parseFloat(document.getElementById('dealValue').value) || 0,
                probability: parseInt(document.getElementById('dealProbability').value) || 50,
                status: document.getElementById('dealStatus').value,
                expectedClose: document.getElementById('dealExpectedClose').value,
                notes: document.getElementById('dealNotes').value.trim(),
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            console.log('Form data collected:', dealData); // Debug log

            // Validate required fields
            if (!dealData.title || !dealData.client || dealData.value <= 0) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            const dealId = event.target.dataset.dealId;
            console.log('Deal ID:', dealId); // Debug log

            // Make sure deals array is up to date
            deals = JSON.parse(localStorage.getItem('deals')) || [];

            if (dealId) {
                // Update existing deal
                const index = deals.findIndex(d => d.id === parseInt(dealId));
                if (index !== -1) {
                    deals[index] = { 
                        ...deals[index], 
                        ...dealData,
                        lastUpdated: new Date().toISOString().split('T')[0]
                    };
                    console.log('Updated deal at index:', index); // Debug log
                }
            } else {
                // Create new deal
                const newDeal = {
                    ...dealData,
                    id: deals.length > 0 ? Math.max(...deals.map(d => d.id)) + 1 : 1,
                    createdAt: new Date().toISOString().split('T')[0],
                    lastUpdated: new Date().toISOString().split('T')[0]
                };
                deals.push(newDeal);
                console.log('Created new deal:', newDeal); // Debug log
            }

            // Update localStorage and UI
            localStorage.setItem('deals', JSON.stringify(deals));
            console.log('Updated localStorage'); // Debug log

            closeDealModal();
            navigate('deals');
            showNotification('Deal saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving deal:', error);
            showNotification('Error saving deal. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }, 500);
}

function deleteDeal(dealId) {
    showConfirmDialog('Are you sure you want to delete this deal? This action cannot be undone.', () => {
        showLoading();
        setTimeout(() => {
            try {
                deals = deals.filter(d => d.id !== dealId);
                localStorage.setItem('deals', JSON.stringify(deals));
                navigate('deals');
                showNotification('Deal deleted successfully!', 'success');
            } catch (error) {
                showNotification('Error deleting deal', 'error');
            } finally {
                hideLoading();
            }
        }, 500);
    });
}

function viewDealDetails(dealId) {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const modalHtml = `
        <div id="dealDetailsModal" class="modal">
            <div class="modal-content wide">
                <span class="close" onclick="document.getElementById('dealDetailsModal').remove()">&times;</span>
                <h2>${deal.title}</h2>
                <div class="deal-details">
                    <div class="detail-section">
                        <h3>Deal Information</h3>
                        <p><strong>Client:</strong> ${deal.client}</p>
                        <p><strong>Value:</strong> $${deal.value.toLocaleString()}</p>
                        <p><strong>Status:</strong> <span class="status ${deal.status.toLowerCase().replace(' ', '-')}">${deal.status}</span></p>
                        <p><strong>Probability:</strong> ${deal.probability}%</p>
                        <p><strong>Expected Close:</strong> ${deal.expectedClose ? formatDate(deal.expectedClose) : 'Not set'}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Notes</h3>
                        <p>${deal.notes || 'No notes available'}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Timeline</h3>
                        <p><strong>Created:</strong> ${formatDate(deal.createdAt)}</p>
                        <p><strong>Last Updated:</strong> ${formatDate(deal.lastUpdated)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Add deal-specific styles
const dealStyles = document.createElement('style');
dealStyles.textContent = `
    .deals-table {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .deals-table table {
        width: 100%;
        border-collapse: collapse;
    }

    .deals-table th {
        cursor: pointer;
        padding: 12px;
        text-align: left;
        background: var(--light-bg);
        color: var(--text-dark);
        font-weight: 600;
    }

    .deals-table td {
        padding: 12px;
        border-bottom: 1px solid #eee;
    }

    .deals-table tr:hover {
        background: #f8f9fa;
    }

    .probability-bar {
        width: 100px;
        height: 20px;
        background: #eee;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
    }

    .probability-fill {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s;
    }

    .probability-bar span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
    }

    .status.in-progress {
        background: #e3f2fd;
        color: #1976d2;
    }

    .status.won {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .status.lost {
        background: #ffebee;
        color: #c62828;
    }

    .deal-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .detail-section {
        background: var(--light-bg);
        padding: 20px;
        border-radius: 10px;
    }

    .detail-section h3 {
        margin-bottom: 15px;
        color: var(--text-dark);
    }

    .detail-section p {
        margin: 10px 0;
        line-height: 1.5;
    }

    #dealNotes {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        resize: vertical;
        min-height: 100px;
        font-family: inherit;
    }

    #dealNotes:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        outline: none;
    }

    @media (max-width: 768px) {
        .deals-table {
            overflow-x: auto;
        }

        .probability-bar {
            width: 80px;
        }
    }
`;
document.head.appendChild(dealStyles);

// Add loading state management
let isLoading = false;

function showLoading() {
    isLoading = true;
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    isLoading = false;
    const loader = document.querySelector('.loader-overlay');
    if (loader) {
        loader.remove();
    }
}

// Add tooltip system
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', e => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tooltip);

            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = rect.bottom + 5 + 'px';
            tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Add confirmation dialog
function showConfirmDialog(message, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <div class="confirm-content">
            <h3>Confirm Action</h3>
            <p>${message}</p>
            <div class="confirm-buttons">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
        dialog.remove();
    });

    dialog.querySelector('.confirm-btn').addEventListener('click', () => {
        onConfirm();
        dialog.remove();
    });

    dialog.addEventListener('click', e => {
        if (e.target === dialog) {
            dialog.remove();
        }
    });
}
