/**
 * OPSIS SUITE - ADDITIONAL ADVANCED FEATURES
 * Timeline, Tareas, Gráficas, Documentos, Widgets, Temas, Roles, Backups
 */

// ============================================================================
// 3. TIMELINE/CHAT POR CLIENTE
// ============================================================================

class CustomerTimeline {
  constructor(customerId) {
    this.customerId = customerId;
    this.timeline = [];
    this.init();
  }

  init() {
    this.loadTimeline();
  }

  addComment(text, isInternal = false, attachments = []) {
    const comment = {
      id: Date.now(),
      type: 'comment',
      text,
      author: this.getCurrentUser(),
      timestamp: new Date().toISOString(),
      isInternal,
      attachments,
      mentions: this.extractMentions(text)
    };

    this.timeline.unshift(comment);
    this.saveTimeline();
    
    // Notificar a usuarios mencionados
    this.notifyMentions(comment.mentions, comment);
    
    return comment;
  }

  addNote(title, text) {
    const note = {
      id: Date.now(),
      type: 'note',
      title,
      text,
      author: this.getCurrentUser(),
      timestamp: new Date().toISOString()
    };

    this.timeline.unshift(note);
    this.saveTimeline();
    
    return note;
  }

  addActivity(activityType, description, metadata = {}) {
    const activity = {
      id: Date.now(),
      type: 'activity',
      activityType, // 'call', 'email', 'meeting', 'project_created', etc.
      description,
      metadata,
      author: this.getCurrentUser(),
      timestamp: new Date().toISOString()
    };

    this.timeline.unshift(activity);
    this.saveTimeline();
    
    return activity;
  }

  extractMentions(text) {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    
    return mentions;
  }

  notifyMentions(mentions, comment) {
    mentions.forEach(username => {
      if (window.notificationCenter) {
        window.notificationCenter.addNotification(
          `${comment.author.name} te mencionó`,
          comment.text.substring(0, 100) + '...',
          'info'
        );
      }
    });
  }

  getCurrentUser() {
    // TODO: Integrar con sistema de autenticación real
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    return {
      id: user.id || 1,
      name: user.name || 'Usuario Actual',
      avatar: user.avatar || null
    };
  }

  getTimeline(filter = 'all') {
    if (filter === 'all') {
      return this.timeline;
    }
    return this.timeline.filter(item => item.type === filter);
  }

  deleteItem(itemId) {
    this.timeline = this.timeline.filter(item => item.id !== itemId);
    this.saveTimeline();
  }

  loadTimeline() {
    try {
      const key = `opsis_timeline_${this.customerId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        this.timeline = JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error loading timeline:', err);
    }
  }

  saveTimeline() {
    try {
      const key = `opsis_timeline_${this.customerId}`;
      localStorage.setItem(key, JSON.stringify(this.timeline));
    } catch (err) {
      console.error('Error saving timeline:', err);
    }
  }

  renderTimeline(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.timeline.length === 0) {
      container.innerHTML = `
        <div class="timeline-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>No hay actividad registrada</p>
          <p style="font-size: 13px; opacity: 0.7;">Agrega un comentario o nota para empezar</p>
        </div>
      `;
      return;
    }

    let html = '<div class="timeline-list">';
    
    this.timeline.forEach(item => {
      html += this.renderTimelineItem(item);
    });

    html += '</div>';
    container.innerHTML = html;
  }

  renderTimelineItem(item) {
    const timeAgo = this.getTimeAgo(item.timestamp);
    
    switch (item.type) {
      case 'comment':
        return `
          <div class="timeline-item timeline-item-comment ${item.isInternal ? 'internal' : ''}">
            <div class="timeline-avatar">
              ${item.author.avatar ? `<img src="${item.author.avatar}" alt="${item.author.name}">` : 
                `<div class="avatar-placeholder">${item.author.name.charAt(0)}</div>`}
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-author">${item.author.name}</span>
                ${item.isInternal ? '<span class="internal-badge">Interno</span>' : ''}
                <span class="timeline-time">${timeAgo}</span>
              </div>
              <div class="timeline-text">${this.formatMentions(item.text)}</div>
              ${item.attachments.length > 0 ? this.renderAttachments(item.attachments) : ''}
            </div>
          </div>
        `;

      case 'note':
        return `
          <div class="timeline-item timeline-item-note">
            <div class="timeline-icon">📝</div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-author">${item.author.name}</span>
                <span class="timeline-time">${timeAgo}</span>
              </div>
              <div class="timeline-note-title">${item.title}</div>
              <div class="timeline-text">${item.text}</div>
            </div>
          </div>
        `;

      case 'activity':
        return `
          <div class="timeline-item timeline-item-activity">
            <div class="timeline-icon">${this.getActivityIcon(item.activityType)}</div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-text">${item.description}</span>
                <span class="timeline-time">${timeAgo}</span>
              </div>
            </div>
          </div>
        `;

      default:
        return '';
    }
  }

  formatMentions(text) {
    return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
  }

  renderAttachments(attachments) {
    let html = '<div class="timeline-attachments">';
    attachments.forEach(att => {
      html += `<div class="attachment-item">${att.name}</div>`;
    });
    html += '</div>';
    return html;
  }

  getActivityIcon(type) {
    const icons = {
      'call': '📞',
      'email': '📧',
      'meeting': '🤝',
      'project_created': '📊',
      'quote_sent': '💰',
      'payment_received': '✅'
    };
    return icons[type] || '📌';
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return then.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// ============================================================================
// 4. SISTEMA DE TAREAS
// ============================================================================

class TaskManager {
  constructor() {
    this.tasks = [];
    this.init();
  }

  init() {
    this.loadTasks();
  }

  createTask(data) {
    const task = {
      id: Date.now(),
      title: data.title,
      description: data.description || '',
      assignedTo: data.assignedTo || null,
      dueDate: data.dueDate || null,
      priority: data.priority || 'medium', // low, medium, high, urgent
      status: 'pending', // pending, in_progress, completed, cancelled
      relatedTo: data.relatedTo || null, // { type: 'customer', id: 123 }
      tags: data.tags || [],
      createdBy: this.getCurrentUser(),
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    this.tasks.unshift(task);
    this.saveTasks();
    
    // Notificar al asignado
    if (task.assignedTo && window.notificationCenter) {
      window.notificationCenter.addNotification(
        'Nueva tarea asignada',
        task.title,
        'info'
      );
    }

    // Programar recordatorio si tiene fecha
    if (task.dueDate) {
      this.scheduleReminder(task);
    }

    return task;
  }

  updateTask(taskId, updates) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;

    Object.assign(task, updates);
    
    if (updates.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date().toISOString();
      
      if (window.notificationCenter) {
        window.notificationCenter.addNotification(
          'Tarea completada',
          task.title,
          'success'
        );
      }
    }

    this.saveTasks();
    return task;
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
  }

  getTasks(filter = {}) {
    let filtered = [...this.tasks];

    if (filter.status) {
      filtered = filtered.filter(t => t.status === filter.status);
    }

    if (filter.assignedTo) {
      filtered = filtered.filter(t => t.assignedTo === filter.assignedTo);
    }

    if (filter.priority) {
      filtered = filtered.filter(t => t.priority === filter.priority);
    }

    if (filter.overdue) {
      const now = new Date();
      filtered = filtered.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
      );
    }

    return filtered;
  }

  getMyTasks() {
    const currentUser = this.getCurrentUser();
    return this.tasks.filter(t => t.assignedTo === currentUser.id);
  }

  scheduleReminder(task) {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const oneDayBefore = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);

    if (now < oneDayBefore && window.notificationCenter) {
      // En producción, esto usaría un sistema de scheduling real
      // Por ahora, solo guardamos el recordatorio
      const reminders = JSON.parse(localStorage.getItem('opsis_task_reminders') || '[]');
      reminders.push({
        taskId: task.id,
        reminderDate: oneDayBefore.toISOString()
      });
      localStorage.setItem('opsis_task_reminders', JSON.stringify(reminders));
    }
  }

  checkReminders() {
    // Verificar recordatorios pendientes
    const reminders = JSON.parse(localStorage.getItem('opsis_task_reminders') || '[]');
    const now = new Date();

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.reminderDate);
      if (reminderDate <= now) {
        const task = this.tasks.find(t => t.id === reminder.taskId);
        if (task && task.status !== 'completed' && window.notificationCenter) {
          window.notificationCenter.addNotification(
            'Recordatorio de tarea',
            `${task.title} vence mañana`,
            'warning'
          );
        }
      }
    });
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    return {
      id: user.id || 1,
      name: user.name || 'Usuario Actual'
    };
  }

  loadTasks() {
    try {
      const stored = localStorage.getItem('opsis_tasks');
      if (stored) {
        this.tasks = JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('opsis_tasks', JSON.stringify(this.tasks));
    } catch (err) {
      console.error('Error saving tasks:', err);
    }
  }
}

// ============================================================================
// 5. DASHBOARD CON GRÁFICAS
// ============================================================================

class DashboardCharts {
  constructor() {
    this.charts = {};
    this.init();
  }

  init() {
    // Se inicializará cuando se monte el dashboard
  }

  createRevenueChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const data = this.getRevenueData();
    
    this.charts.revenue = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Ingresos',
          data: data.values,
          borderColor: '#02735E',
          backgroundColor: 'rgba(2, 115, 94, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `$${context.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${value/1000}k`
            }
          }
        }
      }
    });
  }

  createProjectsChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const data = this.getProjectsData();
    
    this.charts.projects = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: [
            '#02735E',
            '#035951',
            '#034040',
            '#f59e0b'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createTeamPerformanceChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const data = this.getTeamPerformanceData();
    
    this.charts.team = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Proyectos Completados',
          data: data.values,
          backgroundColor: '#02735E'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createNewCustomersChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const data = this.getNewCustomersData();
    
    this.charts.customers = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Nuevos Clientes',
          data: data.values,
          borderColor: '#035951',
          backgroundColor: 'rgba(3, 89, 81, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  // Mock data methods
  getRevenueData() {
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      values: [125000, 189500, 230000, 175000, 295000, 340000]
    };
  }

  getProjectsData() {
    return {
      labels: ['Completados', 'En Proceso', 'Planeación', 'En Pausa'],
      values: [15, 8, 5, 2]
    };
  }

  getTeamPerformanceData() {
    return {
      labels: ['Pedro S.', 'Laura G.', 'Miguel H.', 'Sofia D.', 'Jorge C.'],
      values: [12, 8, 15, 6, 10]
    };
  }

  getNewCustomersData() {
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      values: [3, 5, 4, 7, 6, 8]
    };
  }

  destroyAll() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }
}

// ============================================================================
// INICIALIZACIÓN DE FEATURES ADICIONALES
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gestor de tareas
  window.taskManager = new TaskManager();
  console.log('✅ Task Manager inicializado');

  // Inicializar sistema de gráficas
  window.dashboardCharts = new DashboardCharts();
  console.log('✅ Dashboard Charts inicializado');

  // Verificar recordatorios cada 5 minutos
  setInterval(() => {
    if (window.taskManager) {
      window.taskManager.checkReminders();
    }
  }, 5 * 60 * 1000);

  // Agregar tareas de ejemplo (solo para demo)
  setTimeout(() => {
    if (window.taskManager && window.taskManager.tasks.length === 0) {
      window.taskManager.createTask({
        title: 'Seguimiento a cotización Proyecto Norte',
        description: 'Llamar a cliente para revisar propuesta',
        priority: 'high',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        relatedTo: { type: 'customer', id: 1 }
      });

      window.taskManager.createTask({
        title: 'Revisar presupuesto Q4',
        description: 'Análisis de costos e ingresos del último trimestre',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      console.log('📝 Tareas de ejemplo creadas');
    }
  }, 2000);
});

// Exportar clases globalmente
window.CustomerTimeline = CustomerTimeline;
window.TaskManager = TaskManager;
window.DashboardCharts = DashboardCharts;
