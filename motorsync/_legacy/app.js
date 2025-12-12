// This file is for interactivity and data fetching for the ProjectSync module.

document.addEventListener('DOMContentLoaded', () => {
    // Initial data loading
    loadAssignments();
    loadRecentActivity();
});

function showModule(moduleId) {
    // Hide all modules
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
    });
    // Show the selected module
    const targetModule = document.getElementById(moduleId);
    if (targetModule) {
        targetModule.classList.add('active');
    }

    // Update header title
    const headerTitle = document.querySelector('header h2');
    const button = document.querySelector(`.nav-item[onclick="showModule('${moduleId}')"]`);
    if (headerTitle && button) {
        const buttonText = button.querySelector('span').textContent;
        headerTitle.textContent = buttonText;
    }

    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (button) {
        button.classList.add('active');
    }
}

function loadAssignments() {
    const assignmentsContainer = document.getElementById('my-assignments');
    if (!assignmentsContainer) return;

    const assignments = [
        { project: 'Opsis-Suite UI/UX', task: 'Redesign dashboard components', due: 'Today' },
        { project: 'MotorSync Integration', task: 'API endpoint for work orders', due: 'Tomorrow' },
        { project: 'TimeSync Mobile App', task: 'Fix login bug on Android', due: '2 days' },
        { project: 'Client Onboarding', task: 'Prepare demo for HVAC company', due: '3 days' },
    ];

    let html = '<div class="space-y-4">';
    assignments.forEach(item => {
        html += `
            <div class="p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:bg-gray-50">
                <div>
                    <p class="font-semibold">${item.task}</p>
                    <p class="text-sm text-gray-500">${item.project}</p>
                </div>
                <div class="text-right">
                    <span class="text-sm font-medium text-red-600">${item.due}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    assignmentsContainer.innerHTML = html;
}

function loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;

    const activities = [
        { user: 'Alex', action: 'commented on', task: 'API endpoint for work orders', time: '15m ago' },
        { user: 'Maria', action: 'completed', task: 'Update user profile page', time: '1h ago' },
        { user: 'Cande', action: 'added a new file to', project: 'TimeSync Mobile App', time: '3h ago' },
        { user: 'John', action: 'created a new project', project: 'Q4 Marketing Campaign', time: '5h ago' },
    ];

    let html = '<ul class="space-y-4">';
    activities.forEach(act => {
        html += `
            <li class="flex items-start">
                <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                        ${act.user.substring(0,1)}
                    </div>
                </div>
                <div class="ml-3">
                    <p class="text-sm">
                        <span class="font-semibold">${act.user}</span>
                        ${act.action}
                        <span class="font-semibold">${act.task || act.project}</span>
                    </p>
                    <p class="text-xs text-gray-400">${act.time}</p>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    activityContainer.innerHTML = html;
}

function toggleNotifications() {
    // Placeholder for notification panel logic
    console.log('Toggle notifications');
}
