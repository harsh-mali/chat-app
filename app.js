// Sample data
const users = [
    { id: 1, name: 'Nina Sulivan', initial: 'NS', color: '--avatar-1', status: 'OK, noted!', online: true },
    { id: 2, name: 'Clifton Barnett', initial: 'CB', color: '--avatar-2', status: 'How about a great day...', online: true },
    { id: 3, name: 'Andrea Mendoza', initial: 'AM', color: '--avatar-3', status: 'Give me your notes from...', online: false },
    { id: 4, name: 'Vincent Oliver', initial: 'VO', color: '--avatar-4', status: 'I\'ll look through NEXUS...', online: true },
    { id: 5, name: 'Steven Marsh', initial: 'SM', color: '--avatar-5', status: 'Check if you can find it an...', online: false }
];

const suggestedPeople = [
    { id: 6, name: 'Warren Smith', email: 'warren@nexus.com', initial: 'W', color: '--avatar-2', mutualConnections: 12 },
    { id: 7, name: 'Kris Johnson', email: 'kris@nexus.com', initial: 'K', color: '--avatar-3', mutualConnections: 8 },
    { id: 8, name: 'Herbert Wilson', email: 'herbert@nexus.com', initial: 'H', color: '--avatar-4', mutualConnections: 5 }
];

const sharedContent = {
    media: [
        { id: 1, type: 'image', url: 'https://picsum.photos/400/300?random=1', date: '2024-03-20' },
        { id: 2, type: 'image', url: 'https://picsum.photos/400/300?random=2', date: '2024-03-19' },
        { id: 3, type: 'image', url: 'https://picsum.photos/400/300?random=3', date: '2024-03-18' },
        { id: 4, type: 'image', url: 'https://picsum.photos/400/300?random=4', date: '2024-03-17' }
    ],
    files: [
        { id: 5, name: 'Project_Presentation.pdf', size: '2.4 MB', date: '2024-03-20' },
        { id: 6, name: 'Meeting_Notes.docx', size: '524 KB', date: '2024-03-19' }
    ],
    links: [
        { id: 7, url: 'https://github.com/project', title: 'Project Repository', date: '2024-03-20' },
        { id: 8, url: 'https://figma.com/design', title: 'Design System', date: '2024-03-19' }
    ]
};

// DOM Elements
const chatList = document.getElementById('chatList');
const suggestedPeopleList = document.getElementById('suggestedPeople');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sharedFilesGrid = document.getElementById('sharedFiles');
const contentTabs = document.querySelectorAll('.tab-btn');
const viewOptions = document.querySelectorAll('.view-options .action-btn');

// Menu items configuration
const menuItems = [
    { id: 'chats', icon: 'fa-comments', label: 'Chats', badge: '3' },
    { id: 'contacts', icon: 'fa-users', label: 'Contacts' },
    { id: 'calls', icon: 'fa-phone-alt', label: 'Calls', badge: '1' },
    { id: 'settings', icon: 'fa-cog', label: 'Settings' },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications', badge: '5' },
    { id: 'storage', icon: 'fa-hdd', label: 'Storage' }
];

// Initialize chat list with online status
function initializeChatList() {
    chatList.innerHTML = '';
    users.forEach(user => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
            <div class="avatar-container">
                <div class="avatar" style="background: var(${user.color})">${user.initial}</div>
                <span class="status-indicator ${user.online ? 'online' : ''}"></span>
            </div>
            <div class="chat-item-info">
                <div class="chat-item-name">${user.name}</div>
                <div class="chat-item-last-message">${user.status}</div>
            </div>
            <div class="chat-item-meta">
                <span class="time">12m</span>
                ${user.online ? '<span class="typing">typing...</span>' : ''}
            </div>
        `;
        chatItem.addEventListener('click', () => selectChat(user));
        chatList.appendChild(chatItem);
    });
}

// Initialize suggested people with mutual connections
function initializeSuggestedPeople() {
    suggestedPeopleList.innerHTML = '';
    suggestedPeople.forEach(person => {
        const personItem = document.createElement('div');
        personItem.className = 'chat-item';
        personItem.innerHTML = `
            <div class="avatar" style="background: var(${person.color})">${person.initial}</div>
            <div class="chat-item-info">
                <div class="chat-item-name">${person.name}</div>
                <div class="chat-item-last-message">${person.mutualConnections} mutual connections</div>
            </div>
            <button class="action-btn connect-btn" title="Connect">
                <i class="fas fa-plus"></i>
            </button>
        `;
        suggestedPeopleList.appendChild(personItem);
    });
}

// Select chat with enhanced UI feedback
function selectChat(user) {
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Update group avatars
    const groupAvatars = document.querySelector('.group-avatars');
    groupAvatars.innerHTML = users.slice(0, 3).map(u => 
        `<div class="avatar" style="background: var(${u.color})">${u.initial}</div>`
    ).join('');
    
    loadMessages(user);
}

// Enhanced message loading with empty state
function loadMessages(user) {
    messagesContainer.innerHTML = '';
    
    const messages = [
        { id: 1, sender: user, content: 'Hey there! How are you?', time: '9:30 PM', status: 'read' },
        { id: 2, sender: 'me', content: 'I\'m doing great! Thanks for asking.', time: '9:31 PM', status: 'read' },
        { id: 3, sender: user, content: 'That\'s wonderful to hear!', time: '9:32 PM', status: 'delivered' }
    ];

    if (messages.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-state-icon">👋</div>
            <div class="empty-state-text">Start a conversation</div>
            <div class="empty-state-subtext">Send a message to begin chatting</div>
        `;
        messagesContainer.appendChild(emptyState);
        return;
    }

    messages.forEach((message, index) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender === 'me' ? 'outgoing' : ''}`;
        messageElement.style.animationDelay = `${index * 0.1}s`;
        
        messageElement.innerHTML = `
            ${message.sender !== 'me' ? `
                <div class="avatar-container">
                    <div class="avatar" style="background: var(${user.color})">${user.initial}</div>
                    <span class="status-indicator ${user.online ? 'online' : ''}"></span>
                </div>
            ` : ''}
            <div class="message-content">
                <div class="message-bubble" style="animation-delay: ${index * 0.1 + 0.2}s">${message.content}</div>
                <div class="message-meta" style="animation-delay: ${index * 0.1 + 0.4}s">
                    <span class="message-time">${message.time}</span>
                    ${message.sender === 'me' ? `
                        <span class="message-status">
                            <i class="fas ${message.status === 'read' ? 'fa-check-double' : 'fa-check'}"
                               style="color: ${message.status === 'read' ? '#4f46e5' : 'inherit'}"></i>
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
    });

    // Add typing indicator if user is online
    if (user.online) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message typing';
        typingIndicator.style.animationDelay = `${messages.length * 0.1}s`;
        typingIndicator.innerHTML = `
            <div class="avatar-container">
                <div class="avatar" style="background: var(${user.color})">${user.initial}</div>
                <span class="status-indicator online"></span>
            </div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enhanced message sending with animations and status
function sendMessage(content) {
    if (!content.trim()) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'message outgoing';
    
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    messageElement.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">${content}</div>
            <div class="message-meta">
                <span class="message-time">${currentTime}</span>
                <span class="message-status">
                    <i class="fas fa-check"></i>
                </span>
            </div>
        </div>
    `;
    
    // Remove empty state if present
    const emptyState = messagesContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    messagesContainer.appendChild(messageElement);
    messageInput.value = '';
    
    // Simulate message status updates with animations
    setTimeout(() => {
        const status = messageElement.querySelector('.message-status i');
        status.className = 'fas fa-check-double';
        status.style.color = '#4f46e5';
        status.style.transform = 'scale(1.2)';
        setTimeout(() => {
            status.style.transform = 'scale(1)';
        }, 300);
    }, 1000);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Event Listeners
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

document.querySelector('.send-btn').addEventListener('click', () => {
    sendMessage(messageInput.value);
});

// Content tab switching
contentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        contentTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// View options switching
viewOptions.forEach(option => {
    option.addEventListener('click', () => {
        viewOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});

// Initialize menu bar
function initializeMenuBar() {
    const menuBar = document.createElement('div');
    menuBar.className = 'menu-bar';
    
    menuItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item' + (index === 0 ? ' active' : '');
        menuItem.innerHTML = `
            <i class="fas ${item.icon}"></i>
            ${item.label}
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
        `;
        
        menuItem.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            menuItem.classList.add('active');
            handleMenuItemClick(item.id);
        });
        
        menuBar.appendChild(menuItem);
    });
    
    const appContainer = document.querySelector('.app-container');
    appContainer.insertBefore(menuBar, appContainer.firstChild);
}

// Handle menu item clicks
function handleMenuItemClick(menuId) {
    // Clear any existing empty states
    messagesContainer.innerHTML = '';
    
    switch (menuId) {
        case 'chats':
            initializeChatList();
            loadMessages(users[0]);
            break;
        case 'contacts':
            initializeSuggestedPeople();
            displayContactsView();
            break;
        case 'calls':
            displayCallsView();
            break;
        case 'settings':
            displaySettingsView();
            break;
        case 'notifications':
            displayNotificationsView();
            break;
        case 'storage':
            // No need to initialize shared content for storage
            break;
    }
}

// Display different views
function displayContactsView() {
    const contactsView = document.createElement('div');
    contactsView.className = 'empty-state';
    contactsView.innerHTML = `
        <div class="empty-state-icon">👥</div>
        <div class="empty-state-text">Contacts</div>
        <div class="empty-state-subtext">Manage your contacts and connections</div>
    `;
    messagesContainer.appendChild(contactsView);
}

function displayCallsView() {
    const callsView = document.createElement('div');
    callsView.className = 'empty-state';
    callsView.innerHTML = `
        <div class="empty-state-icon">📞</div>
        <div class="empty-state-text">Calls</div>
        <div class="empty-state-subtext">View your call history and start new calls</div>
    `;
    messagesContainer.appendChild(callsView);
}

function displaySettingsView() {
    const settingsView = document.createElement('div');
    settingsView.className = 'empty-state';
    settingsView.innerHTML = `
        <div class="empty-state-icon">⚙️</div>
        <div class="empty-state-text">Settings</div>
        <div class="empty-state-subtext">Customize your chat experience</div>
    `;
    messagesContainer.appendChild(settingsView);
}

function displayNotificationsView() {
    const notificationsView = document.createElement('div');
    notificationsView.className = 'empty-state';
    notificationsView.innerHTML = `
        <div class="empty-state-icon">🔔</div>
        <div class="empty-state-text">Notifications</div>
        <div class="empty-state-subtext">Stay updated with your latest notifications</div>
    `;
    messagesContainer.appendChild(notificationsView);
}

// Update initialize app function
function initializeApp() {
    initializeMenuBar();
    initializeChatList();
    initializeSuggestedPeople();
    
    // Update message input container
    const messageInputContainer = document.querySelector('.input-container');
    messageInputContainer.innerHTML = `
        <input type="text" id="messageInput" placeholder="Type your message...">
        <div class="input-actions">
            <button class="action-btn" title="Attach">
                <i class="fas fa-paperclip"></i>
            </button>
            <button class="action-btn" title="Emoji">
                <i class="fas fa-smile"></i>
            </button>
            <button class="action-btn send-btn" title="Send">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;
    
    // Re-attach event listeners
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(e.target.value);
        }
    });

    document.querySelector('.send-btn').addEventListener('click', () => {
        sendMessage(messageInput.value);
    });
}

// Handle splash screen
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.querySelector('.splash-screen');
    const appContainer = document.querySelector('.app-container');
    
    // Remove splash screen after animations
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        appContainer.classList.add('show');
        
        // Initialize app after splash screen
        setTimeout(() => {
            initializeApp();
        }, 500);
    }, 2500); // Total animation duration
}); 