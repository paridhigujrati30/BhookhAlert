// Staff Manager class
class StaffManager {
    constructor() {
        this.selectedCustomerId = null;
    }

    // Get queue statistics
    getQueueStats() {
        const allCustomers = queueManager.getAllCustomers();
        const vipCount = queueManager.vipQueue.length;
        const regularCount = queueManager.regularQueue.length;
        
        let totalWaitTime = 0;
        allCustomers.forEach(customer => {
            totalWaitTime += customer.estimatedWaitTime || 0;
        });
        const avgWaitTime = allCustomers.length > 0 ? 
            Math.round(totalWaitTime / allCustomers.length) : 0;

        return {
            total: allCustomers.length,
            vip: vipCount,
            regular: regularCount,
            avgWaitTime: avgWaitTime
        };
    }

    // Update queue display
    updateQueueDisplay() {
        const queueList = document.getElementById('queueList');
        if (!queueList) return;

        queueList.innerHTML = '';

        const allCustomers = queueManager.getAllCustomers();

        if (allCustomers.length === 0) {
            queueList.innerHTML = '<div class="empty-queue">No customers in queue</div>';
            return;
        }

        allCustomers.forEach(customer => {
            const queueItem = document.createElement('div');
            queueItem.className = `queue-item-staff ${customer.isVIP ? 'vip' : ''} ${customer.id === this.selectedCustomerId ? 'selected' : ''}`;
            queueItem.dataset.customerId = customer.id;
            
            queueItem.innerHTML = `
                <div class="queue-position">${customer.position}</div>
                <div class="queue-info">
                    <div class="queue-name">
                        ${customer.name}
                        ${customer.isVIP ? '<span class="vip-badge">VIP</span>' : ''}
                    </div>
                    <div class="queue-details">
                        <span>Party of ${customer.partySize}</span>
                        <span>Phone: ${customer.phoneNumber || 'N/A'}</span>
                        <span>Wait: ${customer.estimatedWaitTime || 0} min</span>
                        <span>Joined: ${this.formatTime(customer.joinTime)}</span>
                    </div>
                </div>
            `;

            queueItem.addEventListener('click', () => {
                this.selectCustomer(customer.id);
            });

            queueList.appendChild(queueItem);
        });
    }

    // Select a customer
    selectCustomer(customerId) {
        this.selectedCustomerId = customerId;
        this.updateQueueDisplay();
    }

    // Format time
    formatTime(dateString) {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Update statistics display
    updateStats() {
        const stats = this.getQueueStats();
        
        const totalQueueCount = document.getElementById('totalQueueCount');
        const vipCount = document.getElementById('vipCount');
        const regularCount = document.getElementById('regularCount');
        const avgWaitTime = document.getElementById('avgWaitTime');

        if (totalQueueCount) totalQueueCount.textContent = stats.total;
        if (vipCount) vipCount.textContent = stats.vip;
        if (regularCount) regularCount.textContent = stats.regular;
        if (avgWaitTime) avgWaitTime.textContent = `${stats.avgWaitTime} min`;
    }

    // Refresh queue
    refreshQueue() {
        initializeQueueManager();
        queueManager.updatePositions();
        queueManager.calculateWaitTimes();
        this.updateQueueDisplay();
        this.updateStats();
        saveQueueManager();
    }
}

// Global staff manager instance
const staffManager = new StaffManager();

// Initialize queue management
function initializeQueueManagement() {
    // Make sure queue manager is initialized
    if (typeof initializeQueueManager === 'function') {
        initializeQueueManager();
    }
    
    // Initialize queue positions and wait times
    if (queueManager) {
        queueManager.updatePositions();
        queueManager.calculateWaitTimes();
    }
    
    staffManager.updateQueueDisplay();
    staffManager.updateStats();

    // Refresh button
    const refreshBtn = document.getElementById('refreshQueue');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            staffManager.refreshQueue();
        });
    }

    // Set up periodic updates
    setInterval(() => {
        staffManager.refreshQueue();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeQueueManagement);

