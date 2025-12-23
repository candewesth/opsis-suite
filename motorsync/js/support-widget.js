/**
 * Support Widget - Chat flotante para enviar tickets
 * Opsis Suite - MotorSync
 */
(function() {
    'use strict';

    const WIDGET_STYLES = `
        /* Botón flotante */
        .support-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #02735E 0%, #10b981 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(2, 115, 94, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .support-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 28px rgba(2, 115, 94, 0.5);
        }
        .support-fab svg {
            width: 28px;
            height: 28px;
            color: white;
            transition: transform 0.3s;
        }
        .support-fab.open svg {
            transform: rotate(45deg);
        }
        .support-fab .fab-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 22px;
            height: 22px;
            background: #ef4444;
            border-radius: 50%;
            color: white;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
        }

        /* Panel de chat */
        .support-panel {
            position: fixed;
            bottom: 100px;
            right: 24px;
            width: 380px;
            max-height: 520px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .support-panel.open {
            transform: scale(1) translateY(0);
            opacity: 1;
            visibility: visible;
        }

        /* Header del panel */
        .support-panel-header {
            background: linear-gradient(135deg, #022326 0%, #02735E 100%);
            color: white;
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .support-panel-header .header-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .support-panel-header .header-avatar svg {
            width: 24px;
            height: 24px;
            color: white;
            stroke: white;
        }
        .support-panel-header .header-info {
            flex: 1;
        }
        .support-panel-header .header-info h3 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.125rem 0;
            color: white;
        }
        .support-panel-header .header-info p {
            font-size: 0.75rem;
            opacity: 0.85;
            margin: 0;
            color: white;
        }
        .support-panel-header .header-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .support-panel-header .header-close:hover {
            background: rgba(255,255,255,0.15);
        }
        .support-panel-header .header-close svg {
            color: white;
            stroke: white;
        }

        /* Cuerpo del panel */
        .support-panel-body {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: #f8fafc;
        }

        /* Opciones iniciales */
        .support-options {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .support-option {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .support-option:hover {
            border-color: #02735E;
            background: linear-gradient(135deg, #f0fdf4, white);
            transform: translateX(4px);
        }
        .support-option .option-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, #022326, #035951);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .support-option .option-icon svg {
            width: 20px;
            height: 20px;
        }
        .support-option .option-content h4 {
            font-size: 0.9rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 0.125rem 0;
        }
        .support-option .option-content p {
            font-size: 0.75rem;
            color: #64748b;
            margin: 0;
        }

        /* Formulario de ticket */
        .support-form {
            display: none;
            flex-direction: column;
            gap: 1rem;
        }
        .support-form.active {
            display: flex;
        }
        .support-form .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #64748b;
            font-size: 0.8rem;
            cursor: pointer;
            margin-bottom: 0.5rem;
            transition: color 0.2s;
        }
        .support-form .back-btn:hover {
            color: #02735E;
        }
        .support-form label {
            font-size: 0.8rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.25rem;
            display: block;
        }
        .support-form input,
        .support-form select,
        .support-form textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            font-size: 0.875rem;
            font-family: inherit;
            transition: all 0.2s;
            background: white;
        }
        .support-form input:focus,
        .support-form select:focus,
        .support-form textarea:focus {
            outline: none;
            border-color: #02735E;
            box-shadow: 0 0 0 3px rgba(2, 115, 94, 0.1);
        }
        .support-form textarea {
            min-height: 100px;
            resize: vertical;
        }
        .support-form .form-group {
            display: flex;
            flex-direction: column;
        }
        .support-form .submit-btn {
            background: linear-gradient(135deg, #02735E, #10b981);
            color: white;
            border: none;
            padding: 0.875rem;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .support-form .submit-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(2, 115, 94, 0.3);
        }

        /* Tickets activos */
        .support-tickets {
            display: none;
        }
        .support-tickets.active {
            display: block;
        }
        .ticket-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .ticket-item:hover {
            border-color: #02735E;
        }
        .ticket-item .ticket-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
        }
        .ticket-item .ticket-id {
            font-size: 0.7rem;
            color: #64748b;
            font-weight: 500;
        }
        .ticket-item .ticket-status {
            font-size: 0.65rem;
            padding: 0.25rem 0.5rem;
            border-radius: 20px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .ticket-item .ticket-status.new { background: #dbeafe; color: #1d4ed8; }
        .ticket-item .ticket-status.open { background: #fef3c7; color: #d97706; }
        .ticket-item .ticket-status.resolved { background: #d1fae5; color: #059669; }
        .ticket-item .ticket-subject {
            font-size: 0.9rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.25rem;
        }
        .ticket-item .ticket-preview {
            font-size: 0.75rem;
            color: #64748b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* Mensaje de éxito */
        .support-success {
            display: none;
            text-align: center;
            padding: 2rem 1rem;
        }
        .support-success.active {
            display: block;
        }
        .support-success .success-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #02735E, #10b981);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
        }
        .support-success .success-icon svg {
            width: 32px;
            height: 32px;
        }
        .support-success h3 {
            font-size: 1.1rem;
            color: #1e293b;
            margin: 0 0 0.5rem 0;
        }
        .support-success p {
            font-size: 0.85rem;
            color: #64748b;
            margin: 0 0 1rem 0;
        }
        .support-success .ticket-number {
            background: #f1f5f9;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            display: inline-block;
            font-size: 0.9rem;
            font-weight: 600;
            color: #02735E;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .support-panel {
                width: calc(100% - 32px);
                right: 16px;
                bottom: 90px;
                max-height: 70vh;
            }
            .support-fab {
                right: 16px;
                bottom: 16px;
            }
        }
    `;

    const ICONS = {
        chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
        ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5v2"></path><path d="M15 11v2"></path><path d="M15 17v2"></path><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"></path></svg>',
        list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
        faq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"></polyline></svg>',
        send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };

    // Datos de ejemplo de tickets
    let userTickets = JSON.parse(localStorage.getItem('opsis_user_tickets') || '[]');

    function generateTicketId() {
        const num = Math.floor(1000 + Math.random() * 9000);
        return `TKT-${num}`;
    }

    function createWidget() {
        // Inyectar estilos
        const styleEl = document.createElement('style');
        styleEl.textContent = WIDGET_STYLES;
        document.head.appendChild(styleEl);

        // Crear botón flotante
        const fab = document.createElement('button');
        fab.className = 'support-fab';
        fab.innerHTML = ICONS.headset;
        fab.setAttribute('aria-label', 'Abrir soporte');

        // Badge de notificaciones (tickets sin leer)
        const unreadCount = userTickets.filter(t => t.hasNewResponse).length;
        if (unreadCount > 0) {
            fab.innerHTML += `<span class="fab-badge">${unreadCount}</span>`;
        }

        // Crear panel
        const panel = document.createElement('div');
        panel.className = 'support-panel';
        panel.innerHTML = `
            <div class="support-panel-header">
                <div class="header-avatar">${ICONS.headset}</div>
                <div class="header-info">
                    <h3>Soporte Opsis</h3>
                    <p>Estamos aquí para ayudarte</p>
                </div>
                <button class="header-close">${ICONS.close}</button>
            </div>
            <div class="support-panel-body">
                <!-- Opciones iniciales -->
                <div class="support-options" id="supportOptions">
                    <div class="support-option" data-action="new-ticket">
                        <div class="option-icon">${ICONS.ticket}</div>
                        <div class="option-content">
                            <h4>Nuevo Ticket</h4>
                            <p>Envía una solicitud de soporte</p>
                        </div>
                    </div>
                    <div class="support-option" data-action="my-tickets">
                        <div class="option-icon">${ICONS.list}</div>
                        <div class="option-content">
                            <h4>Mis Tickets</h4>
                            <p>Ver estado de mis solicitudes</p>
                        </div>
                    </div>
                </div>

                <!-- Formulario nuevo ticket -->
                <div class="support-form" id="ticketForm">
                    <div class="back-btn" data-action="back">${ICONS.back} Volver</div>
                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="ticketCategory">
                            <option value="">Selecciona una categoría</option>
                            <option value="technical">Problema técnico</option>
                            <option value="billing">Facturación</option>
                            <option value="account">Mi cuenta</option>
                            <option value="feature">Sugerencia</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Asunto</label>
                        <input type="text" id="ticketSubject" placeholder="Describe brevemente tu problema">
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="ticketDescription" placeholder="Proporciona todos los detalles posibles..."></textarea>
                    </div>
                    <button class="submit-btn" id="submitTicket">
                        ${ICONS.send} Enviar Ticket
                    </button>
                </div>

                <!-- Lista de tickets -->
                <div class="support-tickets" id="ticketsList">
                    <div class="back-btn" data-action="back">${ICONS.back} Volver</div>
                    <div id="ticketsContainer"></div>
                </div>

                <!-- Mensaje de éxito -->
                <div class="support-success" id="successMessage">
                    <div class="success-icon">${ICONS.check}</div>
                    <h3>¡Ticket Enviado!</h3>
                    <p>Nuestro equipo lo revisará pronto y te responderemos.</p>
                    <div class="ticket-number" id="newTicketId"></div>
                </div>
            </div>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        // Event listeners
        fab.addEventListener('click', () => togglePanel(fab, panel));
        panel.querySelector('.header-close').addEventListener('click', () => closePanel(fab, panel));

        // Opciones
        panel.querySelectorAll('.support-option').forEach(opt => {
            opt.addEventListener('click', () => handleOption(opt.dataset.action));
        });

        // Back buttons
        panel.querySelectorAll('[data-action="back"]').forEach(btn => {
            btn.addEventListener('click', showOptions);
        });

        // Submit ticket
        panel.querySelector('#submitTicket').addEventListener('click', submitTicket);
    }

    function togglePanel(fab, panel) {
        const isOpen = panel.classList.contains('open');
        if (isOpen) {
            closePanel(fab, panel);
        } else {
            panel.classList.add('open');
            fab.classList.add('open');
            fab.innerHTML = ICONS.close;
        }
    }

    function closePanel(fab, panel) {
        panel.classList.remove('open');
        fab.classList.remove('open');
        fab.innerHTML = ICONS.headset;
        // Reset to options
        setTimeout(showOptions, 300);
    }

    function showOptions() {
        document.getElementById('supportOptions').style.display = 'flex';
        document.getElementById('ticketForm').classList.remove('active');
        document.getElementById('ticketsList').classList.remove('active');
        document.getElementById('successMessage').classList.remove('active');
    }

    function handleOption(action) {
        document.getElementById('supportOptions').style.display = 'none';
        
        switch(action) {
            case 'new-ticket':
                document.getElementById('ticketForm').classList.add('active');
                break;
            case 'my-tickets':
                showTickets();
                break;
            case 'faq':
                // Por ahora redirige o muestra un mensaje
                if (typeof window.showToast === 'function') {
                    window.showToast('info', 'Sección de FAQ próximamente');
                }
                showOptions();
                break;
        }
    }

    function showTickets() {
        const container = document.getElementById('ticketsContainer');
        document.getElementById('ticketsList').classList.add('active');

        if (userTickets.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem 1rem; color: #64748b;">
                    <p>No tienes tickets todavía</p>
                </div>
            `;
        } else {
            container.innerHTML = userTickets.map(t => `
                <div class="ticket-item" data-id="${t.id}">
                    <div class="ticket-header">
                        <span class="ticket-id">${t.id}</span>
                        <span class="ticket-status ${t.status}">${getStatusLabel(t.status)}</span>
                    </div>
                    <div class="ticket-subject">${t.subject}</div>
                    <div class="ticket-preview">${t.description.substring(0, 50)}...</div>
                </div>
            `).join('');
        }
    }

    function getStatusLabel(status) {
        const labels = {
            'new': 'Nuevo',
            'open': 'En progreso',
            'resolved': 'Resuelto'
        };
        return labels[status] || status;
    }

    function submitTicket() {
        const category = document.getElementById('ticketCategory').value;
        const subject = document.getElementById('ticketSubject').value;
        const description = document.getElementById('ticketDescription').value;

        if (!category || !subject || !description) {
            if (typeof window.showToast === 'function') {
                window.showToast('error', 'Por favor completa todos los campos');
            }
            return;
        }

        const ticketId = generateTicketId();
        const ticket = {
            id: ticketId,
            category,
            subject,
            description,
            status: 'new',
            createdAt: new Date().toISOString(),
            hasNewResponse: false
        };

        userTickets.unshift(ticket);
        localStorage.setItem('opsis_user_tickets', JSON.stringify(userTickets));

        // También guardar para SuperAdmin
        const allTickets = JSON.parse(localStorage.getItem('opsis_support_tickets') || '[]');
        allTickets.unshift({
            ...ticket,
            user: {
                name: 'Usuario Demo',
                email: 'usuario@empresa.com',
                company: 'Empresa Demo'
            }
        });
        localStorage.setItem('opsis_support_tickets', JSON.stringify(allTickets));

        // Mostrar éxito
        document.getElementById('ticketForm').classList.remove('active');
        document.getElementById('successMessage').classList.add('active');
        document.getElementById('newTicketId').textContent = ticketId;

        // Limpiar formulario
        document.getElementById('ticketCategory').value = '';
        document.getElementById('ticketSubject').value = '';
        document.getElementById('ticketDescription').value = '';

        if (typeof window.showToast === 'function') {
            window.showToast('success', `Ticket ${ticketId} creado exitosamente`);
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
