/**
 * ApexFlow - Core Dashboard Application Logic
 * Implements SPA navigation, state management, drag-and-drop,
 * dynamic renderings, modals, custom SVG charts, calendar, and search.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // APPLICATION STATE
  // ==========================================================================
  let state = {
    projects: [],
    tasks: [],
    members: [],
    activities: []
  };

  let currentView = 'dashboard';
  let activeProjectFilter = 'all';
  let calendarDate = new Date(); // Tracks calendar month/year
  let currentOpenTaskId = null;

  // Embedded Fallback seed data in case projects.json fails to fetch or loads via file protocol
  const seedDataFallback = {
    "projects": [
      {
        "id": "proj-1",
        "name": "Acme Website Redesign",
        "description": "Revamp the corporate website with a modern design, improved SEO, and React-based interactive components.",
        "category": "Web Development",
        "status": "active",
        "progress": 65,
        "startDate": "2026-05-01",
        "endDate": "2026-07-15",
        "client": "Acme Corporation",
        "budget": 45000,
        "lead": "mem-1"
      },
      {
        "id": "proj-2",
        "name": "Mobile App Launch",
        "description": "Design, build, and deploy the new iOS & Android delivery tracking app to App Store and Google Play.",
        "category": "Mobile Apps",
        "status": "active",
        "progress": 40,
        "startDate": "2026-05-15",
        "endDate": "2026-08-30",
        "client": "Swift Logistics",
        "budget": 85000,
        "lead": "mem-2"
      },
      {
        "id": "proj-3",
        "name": "Marketing Automation Setup",
        "description": "Configure HubSpot integration, email templates, drip campaigns, and lead scoring pipelines.",
        "category": "Marketing",
        "status": "completed",
        "progress": 100,
        "startDate": "2026-04-10",
        "endDate": "2026-06-15",
        "client": "Vortex SaaS",
        "budget": 12000,
        "lead": "mem-3"
      },
      {
        "id": "proj-4",
        "name": "Security Audit & Compliance",
        "description": "Perform penetration testing and achieve SOC2 Type II compliance readiness.",
        "category": "Cybersecurity",
        "status": "on_hold",
        "progress": 15,
        "startDate": "2026-06-01",
        "endDate": "2026-10-15",
        "client": "Fintech Secure",
        "budget": 30000,
        "lead": "mem-4"
      }
    ],
    "tasks": [
      {
        "id": "task-1",
        "projectId": "proj-1",
        "title": "Create High-fidelity Wireframes",
        "description": "Design desktop and mobile mockups in Figma for main landing page, dashboard, and pricing pages.",
        "status": "done",
        "priority": "high",
        "dueDate": "2026-06-15",
        "assignees": ["mem-2", "mem-5"],
        "checklist": [
          { "id": "check-1-1", "text": "Landing page wireframe", "completed": true },
          { "id": "check-1-2", "text": "Dashboard view mockup", "completed": true },
          { "id": "check-1-3", "text": "Mobile layout responsiveness", "completed": true },
          { "id": "check-1-4", "text": "Design system & assets export", "completed": true }
        ]
      },
      {
        "id": "task-2",
        "projectId": "proj-1",
        "title": "Develop Landing Page Frontend",
        "description": "Code the responsive landing page using HTML5 semantic elements and interactive CSS animations.",
        "status": "in_progress",
        "priority": "medium",
        "dueDate": "2026-07-02",
        "assignees": ["mem-1"],
        "checklist": [
          { "id": "check-2-1", "text": "Setup project structure", "completed": true },
          { "id": "check-2-2", "text": "Implement CSS variables & layout", "completed": true },
          { "id": "check-2-3", "text": "Integrate animations", "completed": false },
          { "id": "check-2-4", "text": "Cross-browser testing", "completed": false }
        ]
      },
      {
        "id": "task-3",
        "projectId": "proj-1",
        "title": "Setup Headless CMS Integration",
        "description": "Integrate Contentful API to pull dynamic blog posts, press releases, and team biographies.",
        "status": "todo",
        "priority": "medium",
        "dueDate": "2026-07-10",
        "assignees": ["mem-3"],
        "checklist": [
          { "id": "check-3-1", "text": "Configure Contentful space", "completed": false },
          { "id": "check-3-2", "text": "Fetch articles in frontend", "completed": false }
        ]
      },
      {
        "id": "task-4",
        "projectId": "proj-2",
        "title": "Database Schema Design",
        "description": "Create PostgreSQL schemas for tracking deliveries, updating user locations, and billing.",
        "status": "done",
        "priority": "high",
        "dueDate": "2026-06-20",
        "assignees": ["mem-4"],
        "checklist": [
          { "id": "check-4-1", "text": "Entity Relationship Diagram (ERD)", "completed": true },
          { "id": "check-4-2", "text": "Setup migrations & seeders", "completed": true },
          { "id": "check-4-3", "text": "Optimize geolocation indexes", "completed": true }
        ]
      },
      {
        "id": "task-5",
        "projectId": "proj-2",
        "title": "Integrate MapBox SDK",
        "description": "Implement real-time driver tracking on the map view using websockets and Mapbox gl js.",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2026-07-05",
        "assignees": ["mem-2", "mem-4"],
        "checklist": [
          { "id": "check-5-1", "text": "Mapbox API token configuration", "completed": true },
          { "id": "check-5-2", "text": "Render custom vehicle markers", "completed": false },
          { "id": "check-5-3", "text": "Websocket tracking subscription", "completed": false }
        ]
      },
      {
        "id": "task-6",
        "projectId": "proj-2",
        "title": "Authentication & Authorization",
        "description": "Setup JWT-based secure user log in, registration, password recovery, and role management.",
        "status": "review",
        "priority": "high",
        "dueDate": "2026-06-29",
        "assignees": ["mem-1", "mem-5"],
        "checklist": [
          { "id": "check-6-1", "text": "Backend auth endpoints", "completed": true },
          { "id": "check-6-2", "text": "Frontend login form", "completed": true },
          { "id": "check-6-3", "text": "Refresh token mechanism", "completed": true },
          { "id": "check-6-4", "text": "Social OAuth integrations", "completed": false }
        ]
      },
      {
        "id": "task-7",
        "projectId": "proj-3",
        "title": "Connect Lead Scoring Rules",
        "description": "Define CRM rules that rank leads depending on product interactions, website views, and budget.",
        "status": "done",
        "priority": "medium",
        "dueDate": "2026-06-10",
        "assignees": ["mem-3"],
        "checklist": [
          { "id": "check-7-1", "text": "Define score values in Hubspot", "completed": true },
          { "id": "check-7-2", "text": "Test scoring triggers with test users", "completed": true }
        ]
      },
      {
        "id": "task-8",
        "projectId": "proj-3",
        "title": "Email Template Designs",
        "description": "Create responsive HTML templates for welcome emails, weekly digests, and abandoned cart alerts.",
        "status": "done",
        "priority": "low",
        "dueDate": "2026-06-05",
        "assignees": ["mem-5"],
        "checklist": [
          { "id": "check-8-1", "text": "Welcome email", "completed": true },
          { "id": "check-8-2", "text": "Weekly newsletter digest", "completed": true },
          { "id": "check-8-3", "text": "Cart recovery layout", "completed": true }
        ]
      },
      {
        "id": "task-9",
        "projectId": "proj-4",
        "title": "Vulnerability Scan & Fixes",
        "description": "Run dependency scans (OWASP dependency check, npm audit) and update vulnerable packages.",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2026-07-20",
        "assignees": ["mem-4"],
        "checklist": [
          { "id": "check-9-1", "text": "Run automated scanner", "completed": true },
          { "id": "check-9-2", "text": "Patch critical vulnerabilities", "completed": false },
          { "id": "check-9-3", "text": "Generate compliance report", "completed": false }
        ]
      },
      {
        "id": "task-10",
        "projectId": "proj-1",
        "title": "Define SEO Meta Tags",
        "description": "Formulate title schemas, page descriptions, alt tags, and JSON-LD structured data for indexability.",
        "status": "todo",
        "priority": "low",
        "dueDate": "2026-07-12",
        "assignees": ["mem-5"],
        "checklist": [
          { "id": "check-10-1", "text": "Write meta keywords list", "completed": false },
          { "id": "check-10-2", "text": "Setup Google Search Console config", "completed": false }
        ]
      }
    ],
    "members": [
      {
        "id": "mem-1",
        "name": "Sarah Connor",
        "role": "Lead Frontend Architect",
        "avatar": "SC",
        "color": "#6366f1",
        "email": "sarah@example.com"
      },
      {
        "id": "mem-2",
        "name": "James Smith",
        "role": "Product Designer",
        "avatar": "JS",
        "color": "#ec4899",
        "email": "james@example.com"
      },
      {
        "id": "mem-3",
        "name": "Elena Rostova",
        "role": "Marketing Specialist",
        "avatar": "ER",
        "color": "#f59e0b",
        "email": "elena@example.com"
      },
      {
        "id": "mem-4",
        "name": "Marcus Aurelius",
        "role": "Backend Engineer",
        "avatar": "MA",
        "color": "#10b981",
        "email": "marcus@example.com"
      },
      {
        "id": "mem-5",
        "name": "Chloe Vance",
        "role": "QA Analyst",
        "avatar": "CV",
        "color": "#06b6d4",
        "email": "chloe@example.com"
      }
    ],
    "activities": [
      {
        "id": "act-1",
        "type": "task_completed",
        "message": "completed task 'Create High-fidelity Wireframes'",
        "timestamp": "2026-06-27T10:15:00Z",
        "user": "James Smith"
      },
      {
        "id": "act-2",
        "type": "task_created",
        "message": "added a new task 'Define SEO Meta Tags' to project 'Acme Website Redesign'",
        "timestamp": "2026-06-27T08:30:00Z",
        "user": "Sarah Connor"
      },
      {
        "id": "act-3",
        "type": "comment_added",
        "message": "commented on 'Authentication & Authorization': 'Ready for review'",
        "timestamp": "2026-06-26T15:45:00Z",
        "user": "Chloe Vance"
      },
      {
        "id": "act-4",
        "type": "project_created",
        "message": "created a new project: 'Security Audit & Compliance'",
        "timestamp": "2026-06-25T11:00:00Z",
        "user": "Marcus Aurelius"
      }
    ]
  };

  // Initialize data
  async function initApp() {
    setupTheme();
    
    const localData = localStorage.getItem('apex_dashboard_data');
    if (localData) {
      state = JSON.parse(localData);
      renderAll();
    } else {
      try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        state = await response.json();
      } catch (err) {
        console.warn('Could not fetch projects.json, loading fallback seed data', err);
        state = seedDataFallback;
      }
      saveState();
      renderAll();
    }
    setupEventListeners();
  }

  function saveState() {
    localStorage.setItem('apex_dashboard_data', JSON.stringify(state));
  }

  // Helper: auto-recalculate progress of all projects based on their tasks
  function recalculateProjectProgress() {
    state.projects.forEach(project => {
      const projTasks = state.tasks.filter(t => t.projectId === project.id);
      if (projTasks.length === 0) {
        project.progress = project.status === 'completed' ? 100 : 0;
        return;
      }
      const completedTasks = projTasks.filter(t => t.status === 'done').length;
      project.progress = Math.round((completedTasks / projTasks.length) * 100);
      
      // Auto update status if progress reaches 100% (only if it wasn't on hold)
      if (project.progress === 100 && project.status !== 'completed') {
        project.status = 'completed';
        logActivity('project_created', `automatically marked project '${project.name}' as Completed`, 'System');
      } else if (project.progress < 100 && project.status === 'completed') {
        project.status = 'active';
      }
    });
  }

  function logActivity(type, message, user = 'Sarah Connor') {
    const newAct = {
      id: `act-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      user
    };
    state.activities.unshift(newAct);
    if (state.activities.length > 20) {
      state.activities.pop(); // Keep activity list small
    }
  }

  // ==========================================================================
  // VIEW SWITCHING (ROUTING)
  // ==========================================================================
  function showView(viewId) {
    currentView = viewId;
    
    // Update sidebar buttons
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle view elements
    document.querySelectorAll('.view-section').forEach(section => {
      if (section.id === `view-${viewId}`) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });

    // Render components specific to the active view
    renderActiveView();
  }

  function renderActiveView() {
    recalculateProjectProgress();
    switch (currentView) {
      case 'dashboard':
        renderDashboardView();
        break;
      case 'kanban':
        renderKanbanView();
        break;
      case 'projects':
        renderProjectsView();
        break;
      case 'calendar':
        renderCalendarView();
        break;
      case 'analytics':
        renderAnalyticsView();
        break;
    }
  }

  function renderAll() {
    // Re-render whatever view is active
    renderActiveView();
  }

  // ==========================================================================
  // THEME SETUP
  // ==========================================================================
  function setupTheme() {
    const savedTheme = localStorage.getItem('apex_theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('apex_theme', isDark ? 'dark' : 'light');
    showToast(`Switched to ${isDark ? 'Dark' : 'Light'} theme`, 'info');
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (type === 'info') {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>`;
    } else {
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);
    
    // Slide in is handled by CSS animation
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 3500);
  }

  // ==========================================================================
  // RENDER: DASHBOARD VIEW
  // ==========================================================================
  function renderDashboardView() {
    const activeProjects = state.projects.filter(p => p.status === 'active').length;
    const completedTasks = state.tasks.filter(t => t.status === 'done').length;
    const pendingTasks = state.tasks.filter(t => t.status === 'in_progress').length;
    
    // Average completion rate across active projects
    const totalProjects = state.projects.length;
    const avgProgress = totalProjects > 0 
      ? Math.round(state.projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects) 
      : 0;

    document.getElementById('stat-active-projects').textContent = activeProjects;
    document.getElementById('stat-completed-tasks').textContent = completedTasks;
    document.getElementById('stat-pending-tasks').textContent = pendingTasks;
    document.getElementById('stat-completion-rate').textContent = `${avgProgress}%`;

    // Render Project Progress list
    const progressList = document.getElementById('dashboardProgressList');
    progressList.innerHTML = '';
    
    // Show top 3 active projects
    const displayProjects = state.projects.slice(0, 3);
    
    displayProjects.forEach(proj => {
      const item = document.createElement('div');
      item.className = 'project-progress-item';
      item.innerHTML = `
        <div class="project-progress-meta">
          <span class="project-progress-name">${proj.name}</span>
          <span class="project-progress-percentage">${proj.progress}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${proj.progress}%"></div>
        </div>
      `;
      // Allow clicking to switch to the projects tab
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => showView('projects'));
      progressList.appendChild(item);
    });

    // Render Activity Feed
    const activityList = document.getElementById('dashboardActivityList');
    activityList.innerHTML = '';
    
    state.activities.slice(0, 4).forEach(act => {
      const date = new Date(act.timestamp);
      const timeStr = formatRelativeTime(date);
      
      const item = document.createElement('div');
      item.className = `activity-item ${act.type}`;
      
      let avatarHtml = '';
      if (act.user === 'System') {
        avatarHtml = `<div class="activity-dot" style="background:#64748b; color:#ffffff;">SYS</div>`;
      } else {
        const member = state.members.find(m => m.name === act.user);
        const color = member ? member.color : '#6366f1';
        const initials = member ? member.avatar : act.user.split(' ').map(n=>n[0]).join('');
        avatarHtml = `<div class="activity-dot" style="background:${color}30; color:${color};">${initials}</div>`;
      }

      item.innerHTML = `
        ${avatarHtml}
        <div class="activity-content">
          <span class="activity-text"><strong class="activity-user">${act.user}</strong> ${act.message}</span>
          <span class="activity-time">${timeStr}</span>
        </div>
      `;
      activityList.appendChild(item);
    });
  }

  function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  // ==========================================================================
  // RENDER: KANBAN BOARD VIEW
  // ==========================================================================
  function renderKanbanView() {
    // Populate project filter selector dropdown
    const filterSelect = document.getElementById('kanbanProjectFilter');
    // Save current selection
    const previousSelection = activeProjectFilter;
    
    filterSelect.innerHTML = '<option value="all">All Projects</option>';
    state.projects.forEach(proj => {
      const opt = document.createElement('option');
      opt.value = proj.id;
      opt.textContent = proj.name;
      if (proj.id === previousSelection) opt.selected = true;
      filterSelect.appendChild(opt);
    });

    const columns = {
      todo: document.getElementById('list-todo'),
      in_progress: document.getElementById('list-in_progress'),
      review: document.getElementById('list-review'),
      done: document.getElementById('list-done')
    };

    // Clear lists
    Object.values(columns).forEach(col => col.innerHTML = '');

    // Filter tasks
    const filteredTasks = activeProjectFilter === 'all'
      ? state.tasks
      : state.tasks.filter(t => t.projectId === activeProjectFilter);

    // Filter tasks based on Search bar
    const searchQuery = document.getElementById('globalSearch').value.toLowerCase();
    const searchedTasks = filteredTasks.filter(task => {
      return task.title.toLowerCase().includes(searchQuery) ||
             (task.description && task.description.toLowerCase().includes(searchQuery));
    });

    // Populate counts
    const colCounts = { todo: 0, in_progress: 0, review: 0, done: 0 };

    searchedTasks.forEach(task => {
      colCounts[task.status]++;
      
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-task-id', task.id);
      
      const project = state.projects.find(p => p.id === task.projectId);
      const projName = project ? project.name : 'Unknown Project';

      // Checklist completion summary
      let checklistSummary = '';
      if (task.checklist && task.checklist.length > 0) {
        const total = task.checklist.length;
        const completed = task.checklist.filter(c => c.completed).length;
        checklistSummary = `
          <div class="card-checklist-summary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Subtasks: ${completed}/${total}</span>
          </div>
        `;
      }

      // Assignee Avatars
      let avatarsHtml = '';
      if (task.assignees && task.assignees.length > 0) {
        avatarsHtml = '<div class="avatar-group">';
        task.assignees.slice(0, 3).forEach(assigneeId => {
          const member = state.members.find(m => m.id === assigneeId);
          if (member) {
            avatarsHtml += `<div class="avatar-stack-item" style="background: ${member.color}" title="${member.name}">${member.avatar}</div>`;
          }
        });
        if (task.assignees.length > 3) {
          avatarsHtml += `<div class="avatar-stack-item" style="background: #64748b">+${task.assignees.length - 3}</div>`;
        }
        avatarsHtml += '</div>';
      }

      card.innerHTML = `
        <div class="card-project-tag">${projName}</div>
        <div class="card-title">${task.title}</div>
        <p class="card-desc">${task.description || 'No description provided.'}</p>
        ${checklistSummary}
        <div class="card-meta">
          <span class="priority-tag ${task.priority}">${task.priority}</span>
          ${avatarsHtml}
        </div>
      `;

      // Event listeners
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
      
      // Click card to view details
      card.addEventListener('click', () => openTaskDetails(task.id));

      if (columns[task.status]) {
        columns[task.status].appendChild(card);
      }
    });

    // Render count badges
    document.getElementById('count-todo').textContent = colCounts.todo;
    document.getElementById('count-in_progress').textContent = colCounts.in_progress;
    document.getElementById('count-review').textContent = colCounts.review;
    document.getElementById('count-done').textContent = colCounts.done;

    setupDragAndDropContainers();
  }

  // Kanban Drag and Drop Logic
  let draggedCardId = null;

  function handleDragStart(e) {
    draggedCardId = this.getAttribute('data-task-id');
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedCardId);
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.cards-list').forEach(list => {
      list.classList.remove('dragover');
    });
  }

  function setupDragAndDropContainers() {
    document.querySelectorAll('.cards-list').forEach(list => {
      list.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
      });

      list.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
      });

      list.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const taskId = e.dataTransfer.getData('text/plain') || draggedCardId;
        const newStatus = this.getAttribute('data-status');
        
        if (taskId) {
          moveTask(taskId, newStatus);
        }
      });
    });
  }

  function moveTask(taskId, newStatus) {
    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const oldStatus = state.tasks[taskIndex].status;
      if (oldStatus === newStatus) return; // No change

      state.tasks[taskIndex].status = newStatus;
      
      const statusLabels = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Completed' };
      logActivity('task_completed', `moved task '${state.tasks[taskIndex].title}' to ${statusLabels[newStatus]}`);
      
      saveState();
      showToast(`Moved task to ${statusLabels[newStatus]}`, 'success');
      renderAll();
    }
  }

  // ==========================================================================
  // RENDER: PROJECTS EXPLORER VIEW
  // ==========================================================================
  function renderProjectsView() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    const searchQuery = document.getElementById('globalSearch').value.toLowerCase();
    const filteredProjects = state.projects.filter(proj => {
      return proj.name.toLowerCase().includes(searchQuery) ||
             proj.description.toLowerCase().includes(searchQuery) ||
             proj.category.toLowerCase().includes(searchQuery) ||
             proj.client.toLowerCase().includes(searchQuery);
    });

    if (filteredProjects.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h3>No projects found</h3>
          <p>Try refining your search terms or create a new project.</p>
        </div>
      `;
      return;
    }

    filteredProjects.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';
      
      // Get lead info
      const leadMember = state.members.find(m => m.id === proj.lead);
      const leadName = leadMember ? leadMember.name : 'Unassigned';
      const leadInitials = leadMember ? leadMember.avatar : '?';
      const leadColor = leadMember ? leadMember.color : '#64748b';

      const statusLabels = { active: 'Active', completed: 'Completed', on_hold: 'On Hold' };

      card.innerHTML = `
        <div class="project-card-header">
          <span class="project-category">${proj.category}</span>
          <span class="status-badge ${proj.status}">${statusLabels[proj.status]}</span>
        </div>
        <h3 class="project-name">${proj.name}</h3>
        <p class="project-desc">${proj.description}</p>
        
        <div class="project-dates">
          <div>
            <strong>Starts:</strong> ${proj.startDate}
          </div>
          <div>
            <strong>Ends:</strong> ${proj.endDate}
          </div>
        </div>

        <div class="project-progress-sec">
          <div class="project-progress-label">
            <span>Overall Progress</span>
            <span>${proj.progress}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${proj.progress}%"></div>
          </div>
        </div>

        <div class="project-card-footer">
          <div class="project-lead-avatar" title="Project Lead: ${leadName}">
            <div class="project-lead-circle" style="background: ${leadColor}">${leadInitials}</div>
            <span>${leadName}</span>
          </div>
          <div class="project-actions">
            <button class="project-action-btn edit-proj-btn" data-proj-id="${proj.id}" title="Edit Project">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
            </button>
            <button class="project-action-btn delete-proj-btn" data-proj-id="${proj.id}" title="Delete Project" style="color: var(--danger);">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>
          </div>
        </div>
      `;

      // Event listener for edit
      card.querySelector('.edit-proj-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectForm(proj.id);
      });

      // Event listener for delete
      card.querySelector('.delete-proj-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(proj.id);
      });

      grid.appendChild(card);
    });
  }

  function deleteProject(projId) {
    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;
    
    if (confirm(`Are you sure you want to delete project "${proj.name}"? This will delete all tasks associated with it.`)) {
      state.projects = state.projects.filter(p => p.id !== projId);
      state.tasks = state.tasks.filter(t => t.projectId !== projId);
      logActivity('project_created', `deleted project '${proj.name}'`, 'System');
      saveState();
      showToast(`Deleted project: ${proj.name}`, 'warning');
      renderAll();
    }
  }

  // ==========================================================================
  // RENDER: CALENDAR VIEW
  // ==========================================================================
  function renderCalendarView() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const month = calendarDate.getMonth();
    const year = calendarDate.getFullYear();

    document.getElementById('calendarMonthYear').textContent = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // First day of current month
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // Total days in previous month
    const prevTotalDays = new Date(year, month, 0).getDate();

    // Padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day other-month';
      
      const dayNum = prevTotalDays - i;
      dayDiv.innerHTML = `<span class="day-number">${dayNum}</span><div class="calendar-events"></div>`;
      grid.appendChild(dayDiv);
    }

    // Days in current month
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';
      
      if (today.getDate() === i && today.getMonth() === month && today.getFullYear() === year) {
        dayDiv.classList.add('today');
      }

      // Format current calendar day ISO-ish date for matching tasks (YYYY-MM-DD)
      const currentDayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

      // Find tasks due on this date
      const daysTasks = state.tasks.filter(t => t.dueDate === currentDayString);

      // Render day number
      let eventsHtml = '';
      if (daysTasks.length > 0) {
        eventsHtml = '<div class="calendar-events">';
        daysTasks.forEach(task => {
          const priorityColorMap = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' };
          const color = priorityColorMap[task.priority] || 'var(--primary)';
          eventsHtml += `
            <div class="calendar-event-badge" 
                 style="background: ${color};" 
                 data-task-id="${task.id}" 
                 title="${task.title}">
              ${task.title}
            </div>`;
        });
        eventsHtml += '</div>';
      }

      dayDiv.innerHTML = `
        <span class="day-number">${i}</span>
        ${eventsHtml}
      `;

      // Hook click events to calendar events
      dayDiv.querySelectorAll('.calendar-event-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          const tId = badge.getAttribute('data-task-id');
          openTaskDetails(tId);
        });
      });

      grid.appendChild(dayDiv);
    }

    // Padding days for next month to complete the row of 7s
    const totalRenderedCells = firstDayIndex + totalDays;
    const remainingCells = 42 - totalRenderedCells; // Show 6 full calendar rows (42 cells)
    for (let i = 1; i <= remainingCells; i++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day other-month';
      dayDiv.innerHTML = `<span class="day-number">${i}</span><div class="calendar-events"></div>`;
      grid.appendChild(dayDiv);
    }
  }

  // ==========================================================================
  // RENDER: ANALYTICS VIEW
  // ==========================================================================
  function renderAnalyticsView() {
    // 1. PROJECTS DONUT CHART
    const donutContainer = document.getElementById('donutChartContainer');
    donutContainer.innerHTML = '';

    const activeCount = state.projects.filter(p => p.status === 'active').length;
    const completedCount = state.projects.filter(p => p.status === 'completed').length;
    const onholdCount = state.projects.filter(p => p.status === 'on_hold').length;
    const totalProjectsCount = state.projects.length;

    // Fill counts
    document.getElementById('stats-active-count').textContent = activeCount;
    document.getElementById('stats-completed-count').textContent = completedCount;
    document.getElementById('stats-onhold-count').textContent = onholdCount;

    // Build SVG donut
    const activePercent = totalProjectsCount > 0 ? (activeCount / totalProjectsCount) * 100 : 0;
    const completedPercent = totalProjectsCount > 0 ? (completedCount / totalProjectsCount) * 100 : 0;
    const onholdPercent = totalProjectsCount > 0 ? (onholdCount / totalProjectsCount) * 100 : 0;

    // SVG parameters
    const size = 180;
    const radius = 60;
    const circumference = 2 * Math.PI * radius; // ~377

    let accumulatedPercentage = 0;
    let svgContent = `<svg class="chart-svg" viewBox="0 0 ${size} ${size}">`;
    
    // Background circle
    svgContent += `<circle class="chart-donut-background" cx="${size/2}" cy="${size/2}" r="${radius}" />`;

    // Active stroke (Indigo/Primary)
    if (activeCount > 0) {
      const strokeOffset = circumference - (activePercent / 100) * circumference;
      const rotation = (accumulatedPercentage / 100) * 360 - 90;
      svgContent += `<circle class="chart-donut-fill" cx="${size/2}" cy="${size/2}" r="${radius}" 
                       stroke="var(--primary)" 
                       stroke-dasharray="${circumference}" 
                       stroke-dashoffset="${strokeOffset}"
                       style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;" />`;
      accumulatedPercentage += activePercent;
    }

    // Completed stroke (Emerald/Success)
    if (completedCount > 0) {
      const strokeOffset = circumference - (completedPercent / 100) * circumference;
      const rotation = (accumulatedPercentage / 100) * 360 - 90;
      svgContent += `<circle class="chart-donut-fill" cx="${size/2}" cy="${size/2}" r="${radius}" 
                       stroke="var(--success)" 
                       stroke-dasharray="${circumference}" 
                       stroke-dashoffset="${strokeOffset}"
                       style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;" />`;
      accumulatedPercentage += completedPercent;
    }

    // On Hold stroke (Amber/Warning)
    if (onholdCount > 0) {
      const strokeOffset = circumference - (onholdPercent / 100) * circumference;
      const rotation = (accumulatedPercentage / 100) * 360 - 90;
      svgContent += `<circle class="chart-donut-fill" cx="${size/2}" cy="${size/2}" r="${radius}" 
                       stroke="var(--warning)" 
                       stroke-dasharray="${circumference}" 
                       stroke-dashoffset="${strokeOffset}"
                       style="transform: rotate(${rotation}deg); transform-origin: 50% 50%;" />`;
    }

    // Center text
    svgContent += `<text class="chart-donut-text" x="${size/2}" y="${size/2 + 8}">${totalProjectsCount}</text>`;
    svgContent += `</svg>`;

    donutContainer.innerHTML = svgContent;

    // Trigger offset animation
    setTimeout(() => {
      document.querySelectorAll('.chart-donut-fill').forEach(circle => {
        circle.style.strokeDashoffset = circle.getAttribute('stroke-dashoffset');
      });
    }, 50);


    // 2. WEEKLY TASK COMPLETION LINE CHART
    const lineContainer = document.getElementById('lineChartContainer');
    lineContainer.innerHTML = '';

    // Let's plot tasks completed per priority or due dates
    // For visual simulation, let's plot counts: High/Med/Low priority tasks completed
    const doneTasks = state.tasks.filter(t => t.status === 'done');
    const totalCreatedCount = state.tasks.length;
    const totalCompletedCount = doneTasks.length;
    const completionRatio = totalCreatedCount > 0 ? Math.round((totalCompletedCount / totalCreatedCount) * 100) : 0;

    document.getElementById('stats-total-created').textContent = totalCreatedCount;
    document.getElementById('stats-total-completed').textContent = totalCompletedCount;
    document.getElementById('stats-completion-ratio').textContent = `${completionRatio}%`;

    // Map priorities to coordinate points for lines: High, Medium, Low
    // Simulated completion history over 5 data points (Mon, Tue, Wed, Thu, Fri)
    const pointsData = [
      { day: 'Mon', completed: 1 },
      { day: 'Tue', completed: 3 },
      { day: 'Wed', completed: 2 },
      { day: 'Thu', completed: 4 },
      { day: 'Fri', completed: doneTasks.length || 5 }
    ];

    const chartW = 340;
    const chartH = 180;
    const margin = 20;

    // Normalize Y coordinates (max y val is 6)
    const maxY = 6;
    const points = pointsData.map((d, index) => {
      const x = margin + (index / (pointsData.length - 1)) * (chartW - 2 * margin);
      const y = chartH - margin - (d.completed / maxY) * (chartH - 2 * margin);
      return { x, y, day: d.day, val: d.completed };
    });

    let polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
    let gradientPoints = `${points[0].x},${chartH - margin} ` + 
                         points.map(p => `${p.x},${p.y}`).join(' ') + 
                         ` ${points[points.length - 1].x},${chartH - margin}`;

    let lineSvgContent = `
      <svg class="chart-svg" viewBox="0 0 ${chartW} ${chartH}">
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        
        <!-- Y Grid Lines -->
        <line class="chart-axis" x1="${margin}" y1="${chartH - margin}" x2="${chartW - margin}" y2="${chartH - margin}" />
        <line class="chart-axis" x1="${margin}" y1="${margin}" x2="${margin}" y2="${chartH - margin}" />
        
        <!-- Graph Area Fill -->
        <polygon class="chart-line-gradient" points="${gradientPoints}" />

        <!-- Line graph path -->
        <polyline class="chart-line" points="${polylinePoints}" />
        
        <!-- Data dots & text -->
    `;

    points.forEach(p => {
      lineSvgContent += `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--primary-light)" stroke="var(--primary)" stroke-width="2" style="cursor:pointer;" />
        <text class="chart-text" x="${p.x - 10}" y="${p.y - 10}">${p.val}</text>
        <text class="chart-text" x="${p.x - 10}" y="${chartH - 4}">${p.day}</text>
      `;
    });

    lineSvgContent += `</svg>`;
    lineContainer.innerHTML = lineSvgContent;
  }

  // ==========================================================================
  // DETAIL TASK MODAL & CHECKLIST ACTION
  // ==========================================================================
  function openTaskDetails(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    currentOpenTaskId = taskId;

    const project = state.projects.find(p => p.id === task.projectId);
    document.getElementById('detailProjectTag').textContent = project ? project.name : 'No Project';
    document.getElementById('detailTaskTitle').textContent = task.title;
    document.getElementById('detailPriority').className = `priority-tag ${task.priority}`;
    document.getElementById('detailPriority').textContent = task.priority;
    document.getElementById('detailDueDate').textContent = task.dueDate;
    document.getElementById('detailDesc').textContent = task.description || 'No description provided.';

    // Render Checklist
    renderTaskDetailsChecklist(task);

    // Render Assignees
    const assigneesGroup = document.getElementById('detailAssigneesGroup');
    assigneesGroup.innerHTML = '';
    
    if (task.assignees && task.assignees.length > 0) {
      task.assignees.forEach(assigneeId => {
        const member = state.members.find(m => m.id === assigneeId);
        if (member) {
          const div = document.createElement('div');
          div.className = 'project-lead-avatar';
          div.style.background = 'var(--border-color)';
          div.style.padding = '0.35rem 0.65rem';
          div.style.borderRadius = 'var(--radius-sm)';
          div.innerHTML = `
            <div class="project-lead-circle" style="background: ${member.color}; width:20px; height:20px; font-size:0.6rem;">${member.avatar}</div>
            <span style="font-size:0.8rem;">${member.name}</span>
          `;
          assigneesGroup.appendChild(div);
        }
      });
    } else {
      assigneesGroup.innerHTML = '<span style="font-size:0.85rem; color:var(--text-muted);">Unassigned</span>';
    }

    document.getElementById('taskDetailsModal').classList.add('active');
  }

  function renderTaskDetailsChecklist(task) {
    const checklistList = document.getElementById('detailChecklistList');
    checklistList.innerHTML = '';

    const total = task.checklist ? task.checklist.length : 0;
    const completed = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
    
    document.getElementById('detailChecklistRatio').textContent = `${completed}/${total}`;

    if (total === 0) {
      checklistList.innerHTML = '<span style="font-size:0.85rem; color:var(--text-muted);">No subtasks yet.</span>';
      return;
    }

    task.checklist.forEach(item => {
      const div = document.createElement('div');
      div.className = 'task-checklist-item';
      
      const isChecked = item.completed ? 'checked' : '';
      
      div.innerHTML = `
        <div class="task-checklist-checkbox ${isChecked}" data-item-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        </div>
        <span class="task-checklist-text">${item.text}</span>
      `;

      // Click to toggle checkbox
      div.querySelector('.task-checklist-checkbox').addEventListener('click', function() {
        const itemId = this.getAttribute('data-item-id');
        toggleChecklistItem(task.id, itemId);
      });

      checklistList.appendChild(div);
    });
  }

  function toggleChecklistItem(taskId, itemId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const checklistItem = task.checklist.find(c => c.id === itemId);
    if (checklistItem) {
      checklistItem.completed = !checklistItem.completed;
      
      // Auto move task to "done" if checklist is completed, or move out of done if unchecked
      const total = task.checklist.length;
      const completed = task.checklist.filter(c => c.completed).length;
      if (completed === total && task.status !== 'done') {
        task.status = 'done';
        logActivity('task_completed', `completed all subtasks on '${task.title}'`);
        showToast('All subtasks completed! Task moved to Done.', 'success');
      } else if (completed < total && task.status === 'done') {
        task.status = 'in_progress';
      }

      saveState();
      renderTaskDetailsChecklist(task);
      renderAll();
    }
  }

  function addSubtask(taskId, text) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.checklist) task.checklist = [];
    
    task.checklist.push({
      id: `check-${Date.now()}`,
      text: text,
      completed: false
    });

    // If task was complete, demote it because a new uncompleted subtask was added
    if (task.status === 'done') {
      task.status = 'in_progress';
    }

    saveState();
    renderTaskDetailsChecklist(task);
    renderAll();
    showToast('Added subtask', 'success');
  }

  function deleteTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      state.tasks = state.tasks.filter(t => t.id !== taskId);
      logActivity('task_completed', `deleted task '${task.title}'`, 'System');
      saveState();
      showToast('Deleted task', 'warning');
      document.getElementById('taskDetailsModal').classList.remove('active');
      renderAll();
    }
  }

  // ==========================================================================
  // FORMS: CREATION & EDITS
  // ==========================================================================
  
  // Projects Form
  function openProjectForm(projId = null) {
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('projectModalTitle');
    const form = document.getElementById('projectForm');
    
    // Clear form
    form.reset();

    // Populate team leads drop-down selector
    const leadSelect = document.getElementById('projLead');
    leadSelect.innerHTML = '';
    state.members.forEach(member => {
      const opt = document.createElement('option');
      opt.value = member.id;
      opt.textContent = `${member.name} (${member.role})`;
      leadSelect.appendChild(opt);
    });

    if (projId) {
      // Edit mode
      const proj = state.projects.find(p => p.id === projId);
      if (!proj) return;

      title.textContent = 'Edit Project';
      document.getElementById('projectIdInput').value = proj.id;
      document.getElementById('projName').value = proj.name;
      document.getElementById('projDesc').value = proj.description;
      document.getElementById('projCategory').value = proj.category;
      document.getElementById('projStatus').value = proj.status;
      document.getElementById('projStartDate').value = proj.startDate;
      document.getElementById('projEndDate').value = proj.endDate;
      document.getElementById('projClient').value = proj.client;
      document.getElementById('projBudget').value = proj.budget;
      document.getElementById('projLead').value = proj.lead;
    } else {
      // Create mode
      title.textContent = 'Create New Project';
      document.getElementById('projectIdInput').value = '';
      
      // Auto-set start date to today
      const todayStr = new Date().toISOString().split('T')[0];
      document.getElementById('projStartDate').value = todayStr;
    }

    modal.classList.add('active');
  }

  function handleProjectSubmit(e) {
    e.preventDefault();
    
    const projId = document.getElementById('projectIdInput').value;
    const projData = {
      name: document.getElementById('projName').value,
      description: document.getElementById('projDesc').value,
      category: document.getElementById('projCategory').value,
      status: document.getElementById('projStatus').value,
      startDate: document.getElementById('projStartDate').value,
      endDate: document.getElementById('projEndDate').value,
      client: document.getElementById('projClient').value,
      budget: parseFloat(document.getElementById('projBudget').value) || 0,
      lead: document.getElementById('projLead').value
    };

    if (projId) {
      // Update
      const index = state.projects.findIndex(p => p.id === projId);
      if (index !== -1) {
        // Keep progress and ID
        projData.id = projId;
        projData.progress = state.projects[index].progress;
        
        state.projects[index] = projData;
        logActivity('project_created', `updated project details for '${projData.name}'`);
        showToast('Updated project details', 'success');
      }
    } else {
      // Create
      projData.id = `proj-${Date.now()}`;
      projData.progress = 0;
      state.projects.push(projData);
      
      logActivity('project_created', `created a new project: '${projData.name}'`);
      showToast('Created new project successfully!', 'success');
    }

    saveState();
    document.getElementById('projectModal').classList.remove('active');
    renderAll();
  }

  // Tasks Form
  function openTaskForm(taskId = null, defaultStatus = 'todo') {
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('taskModalTitle');
    const form = document.getElementById('taskForm');
    
    form.reset();

    // Populate projects select list
    const projSelect = document.getElementById('taskProject');
    projSelect.innerHTML = '';
    state.projects.forEach(proj => {
      const opt = document.createElement('option');
      opt.value = proj.id;
      opt.textContent = proj.name;
      projSelect.appendChild(opt);
    });

    if (state.projects.length === 0) {
      alert('Please create at least one project before adding tasks.');
      return;
    }

    // Populate assignees picker checkboxes
    const assigneesContainer = document.getElementById('taskAssigneesList');
    assigneesContainer.innerHTML = '';
    
    state.members.forEach(member => {
      const label = document.createElement('label');
      label.className = 'assignee-option';
      label.innerHTML = `
        <input type="checkbox" name="taskAssignees" value="${member.id}">
        <span>${member.name} (${member.role})</span>
      `;
      assigneesContainer.appendChild(label);
    });

    if (taskId) {
      // Edit mode
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;

      title.textContent = 'Edit Task';
      document.getElementById('taskIdInput').value = task.id;
      document.getElementById('taskStatusInput').value = task.status;
      document.getElementById('taskProject').value = task.projectId;
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDesc').value = task.description || '';
      document.getElementById('taskPriority').value = task.priority;
      document.getElementById('taskDueDate').value = task.dueDate;

      // Select checkboxes
      if (task.assignees) {
        document.querySelectorAll('input[name="taskAssignees"]').forEach(chk => {
          if (task.assignees.includes(chk.value)) {
            chk.checked = true;
          }
        });
      }
    } else {
      // Create mode
      title.textContent = 'Create New Task';
      document.getElementById('taskIdInput').value = '';
      document.getElementById('taskStatusInput').value = defaultStatus;
      
      // Auto due date tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
      
      // Pre-select project if filter is set to specific project
      if (activeProjectFilter !== 'all') {
        projSelect.value = activeProjectFilter;
      }
    }

    modal.classList.add('active');
  }

  function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('taskIdInput').value;
    const taskStatus = document.getElementById('taskStatusInput').value || 'todo';
    
    // Get checked assignees
    const assignees = [];
    document.querySelectorAll('input[name="taskAssignees"]:checked').forEach(chk => {
      assignees.push(chk.value);
    });

    const taskData = {
      projectId: document.getElementById('taskProject').value,
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDesc').value,
      priority: document.getElementById('taskPriority').value,
      dueDate: document.getElementById('taskDueDate').value,
      assignees: assignees
    };

    if (taskId) {
      // Update
      const index = state.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        // Keep status, checklist and ID
        taskData.id = taskId;
        taskData.status = taskStatus;
        taskData.checklist = state.tasks[index].checklist || [];

        state.tasks[index] = taskData;
        logActivity('task_created', `updated details for task '${taskData.title}'`);
        showToast('Updated task details', 'success');
      }
    } else {
      // Create
      taskData.id = `task-${Date.now()}`;
      taskData.status = taskStatus;
      taskData.checklist = [];
      state.tasks.push(taskData);

      const proj = state.projects.find(p => p.id === taskData.projectId);
      const projName = proj ? proj.name : '';
      logActivity('task_created', `added a new task '${taskData.title}' to project '${projName}'`);
      showToast('Created new task successfully!', 'success');
    }

    saveState();
    document.getElementById('taskModal').classList.remove('active');
    renderAll();
    
    // If details modal was open, refresh it
    if (currentOpenTaskId === taskId && taskId) {
      openTaskDetails(taskId);
    }
  }

  // ==========================================================================
  // EVENT LISTENERS & SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Collapsible sidebar
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });

    // SPA View Router navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = link.getAttribute('data-view');
        showView(viewId);
      });
    });

    // Dashboard View target redirects
    document.querySelectorAll('[data-view-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = link.getAttribute('data-view-target');
        showView(viewId);
      });
    });

    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Global Search filter listener
    document.getElementById('globalSearch').addEventListener('input', renderActiveView);

    // Kanban board Project Filter selector
    document.getElementById('kanbanProjectFilter').addEventListener('change', function() {
      activeProjectFilter = this.value;
      renderActiveView();
    });

    // Calendar navigation
    document.getElementById('calendarPrevBtn').addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendarView();
    });
    document.getElementById('calendarNextBtn').addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendarView();
    });
    document.getElementById('calendarTodayBtn').addEventListener('click', () => {
      calendarDate = new Date();
      renderCalendarView();
    });

    // Create New global selector dropdown modal
    const createSelectorModal = document.getElementById('createSelectorModal');
    document.getElementById('createNewBtn').addEventListener('click', () => {
      createSelectorModal.classList.add('active');
    });
    document.getElementById('closeSelectorModal').addEventListener('click', () => {
      createSelectorModal.classList.remove('active');
    });
    document.getElementById('selectorProjectBtn').addEventListener('click', () => {
      createSelectorModal.classList.remove('active');
      openProjectForm();
    });
    document.getElementById('selectorTaskBtn').addEventListener('click', () => {
      createSelectorModal.classList.remove('active');
      openTaskForm();
    });

    // Project Form Modals listeners
    document.getElementById('newProjectBtn').addEventListener('click', () => openProjectForm());
    document.getElementById('closeProjectModal').addEventListener('click', () => {
      document.getElementById('projectModal').classList.remove('active');
    });
    document.getElementById('cancelProjectBtn').addEventListener('click', () => {
      document.getElementById('projectModal').classList.remove('active');
    });
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);

    // Kanban board Column "+" add card buttons
    document.querySelectorAll('.add-card-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const colStatus = this.getAttribute('data-status');
        openTaskForm(null, colStatus);
      });
    });

    // Task Form Modal listeners
    document.getElementById('closeTaskModal').addEventListener('click', () => {
      document.getElementById('taskModal').classList.remove('active');
    });
    document.getElementById('cancelTaskBtn').addEventListener('click', () => {
      document.getElementById('taskModal').classList.remove('active');
    });
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);

    // Task Details Modal actions listeners
    document.getElementById('closeDetailsModal').addEventListener('click', () => {
      document.getElementById('taskDetailsModal').classList.remove('active');
      currentOpenTaskId = null;
    });
    document.getElementById('saveDetailsBtn').addEventListener('click', () => {
      document.getElementById('taskDetailsModal').classList.remove('active');
      currentOpenTaskId = null;
    });
    document.getElementById('deleteTaskBtn').addEventListener('click', () => {
      if (currentOpenTaskId) {
        deleteTask(currentOpenTaskId);
      }
    });
    document.getElementById('editTaskDetailsBtn').addEventListener('click', () => {
      if (currentOpenTaskId) {
        const taskIdToEdit = currentOpenTaskId;
        document.getElementById('taskDetailsModal').classList.remove('active');
        currentOpenTaskId = null;
        openTaskForm(taskIdToEdit);
      }
    });

    // Subtask checklist creation inside detail view
    const subtaskAdd = () => {
      const text = document.getElementById('newSubtaskInput').value.trim();
      if (text && currentOpenTaskId) {
        addSubtask(currentOpenTaskId, text);
        document.getElementById('newSubtaskInput').value = '';
      }
    };
    document.getElementById('addSubtaskBtn').addEventListener('click', subtaskAdd);
    document.getElementById('newSubtaskInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        subtaskAdd();
      }
    });

    // Close Modals on overlay backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('active');
          if (this.id === 'taskDetailsModal') currentOpenTaskId = null;
        }
      });
    });
  }

  // Run initializations
  initApp();
});
