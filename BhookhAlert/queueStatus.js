// Notification Service class
class NotificationService {
    constructor() {
        this.notifications = [];
    }

    showNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        };
        this.notifications.push(notification);
        this.displayNotification(notification);
    }

    displayNotification(notification) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification ${notification.type}`;
        notificationDiv.textContent = notification.message;
        
        const container = document.getElementById('notifications') || document.body;
        container.appendChild(notificationDiv);
        
        setTimeout(() => {
            notificationDiv.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notificationDiv.classList.remove('show');
            setTimeout(() => notificationDiv.remove(), 300);
        }, 3000);
    }

    checkDiscountEligibility(customer) {
        if (customer.estimatedWaitTime > 30) {
            this.showNotification(`🎉 Special Offer! Get 15% off your meal for waiting ${customer.estimatedWaitTime} minutes!`, 'discount');
        }
    }
}

// Global notification service
const notificationService = new NotificationService();

// Update queue status display
function updateQueueStatus() {
    const customerId = sessionStorage.getItem('currentCustomerId');
    if (!customerId) {
        window.location.href = 'customer.html';
        return;
    }
    
    const customer = queueManager.getCustomerById(parseFloat(customerId));
    
    if (!customer) {
        // Customer might have been seated or removed
        document.getElementById('statusMessage').textContent = 'You have been seated!';
        document.getElementById('positionDisplay').textContent = '0';
        document.getElementById('waitTimeDisplay').textContent = '0';
        return;
    }
    
    // Update position
    queueManager.updatePositions();
    queueManager.calculateWaitTimes();
    
    const position = customer.position;
    const waitTime = customer.estimatedWaitTime;
    
    document.getElementById('positionDisplay').textContent = position || '0';
    document.getElementById('waitTimeDisplay').textContent = waitTime || '0';
    
    // Update status message
    if (customer.isVIP) {
        document.getElementById('statusMessage').textContent = `VIP Priority - You're next in line!`;
    } else {
        document.getElementById('statusMessage').textContent = `You are ${position}${getOrdinalSuffix(position)} in line`;
    }
    
    // Check for discount eligibility
    notificationService.checkDiscountEligibility(customer);
    
    // Show/hide discount banner
    const discountBanner = document.getElementById('discountBanner');
    if (discountBanner) {
        if (waitTime > 30) {
            discountBanner.style.display = 'block';
        } else {
            discountBanner.style.display = 'none';
        }
    }
    
    // Update progress bar
    updateProgressBar(waitTime);
    
    // Update queue visualization
    updateQueueVisualization();
    
    // Save updated queue
    saveQueueManager();
}

// Update progress bar
function updateProgressBar(waitTime) {
    const progressFill = document.getElementById('progressFill');
    if (!progressFill) return;
    
    // Calculate progress (assuming max wait time of 60 minutes)
    const maxWaitTime = 60;
    const progress = Math.min((waitTime / maxWaitTime) * 100, 100);
    progressFill.style.width = `${progress}%`;
}

// Get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

// Update queue visualization
function updateQueueVisualization() {
    const queueContainer = document.getElementById('queueVisualization');
    if (!queueContainer) return;
    
    const allCustomers = queueManager.getAllCustomers();
    queueContainer.innerHTML = '';
    
    allCustomers.slice(0, 10).forEach((customer, index) => {
        const customerDiv = document.createElement('div');
        customerDiv.className = `queue-item ${customer.isVIP ? 'vip' : ''} ${index === 0 ? 'next' : ''}`;
        customerDiv.innerHTML = `
            <span class="queue-position">${customer.position}</span>
            <span class="queue-name">${customer.name}</span>
            <span class="queue-party">Party of ${customer.partySize}</span>
            ${customer.isVIP ? '<span class="vip-badge">VIP</span>' : ''}
        `;
        queueContainer.appendChild(customerDiv);
    });
}

// Animate queue movement
function animateQueueMovement() {
    const queueItems = document.querySelectorAll('.queue-item');
    queueItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 80);
    });
}

// Simulate real-time updates using mock socket
function startRealTimeUpdates() {
    mockSocket.connect();
    
    mockSocket.on('queueUpdate', (data) => {
        updateQueueStatus();
        animateQueueMovement();
    });
    
    // Also update periodically
    setInterval(() => {
        updateQueueStatus();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeQueueManager();
    updateQueueStatus();
    animateQueueMovement();
    startRealTimeUpdates();
    
    // Update every 5 seconds
    setInterval(() => {
        updateQueueStatus();
        animateQueueMovement();
    }, 5000);
});

