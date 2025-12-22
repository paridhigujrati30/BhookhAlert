// Handle seating customers
function handleSeatCustomer() {
    const nextCustomer = queueManager.getNextCustomer();
    
    if (!nextCustomer) {
        showNotification('No customers in queue', 'info');
        return;
    }

    // Add to seated customers
    queueManager.seatedCustomers = queueManager.seatedCustomers || [];
    queueManager.seatedCustomers.push({
        ...nextCustomer,
        seatedAt: new Date()
    });

    // Update positions and wait times
    queueManager.updatePositions();
    queueManager.calculateWaitTimes();
    saveQueueManager();

    // Update display
    staffManager.updateQueueDisplay();
    staffManager.updateStats();

    // Broadcast update (simulated)
    mockSocket.broadcast('queueUpdate', {
        customerSeated: nextCustomer.id,
        timestamp: new Date().toISOString()
    });

    showNotification(`${nextCustomer.name} has been seated!`, 'success');
}

// Handle marking no-show
function handleMarkNoShow() {
    if (!staffManager.selectedCustomerId) {
        showNotification('Please select a customer first', 'error');
        return;
    }

    const customer = queueManager.getCustomerById(staffManager.selectedCustomerId);
    
    if (!customer) {
        showNotification('Customer not found', 'error');
        return;
    }

    // Remove customer from queue
    queueManager.removeCustomer(staffManager.selectedCustomerId);
    saveQueueManager();

    // Update display
    staffManager.selectedCustomerId = null;
    staffManager.updateQueueDisplay();
    staffManager.updateStats();

    // Broadcast update (simulated)
    mockSocket.broadcast('queueUpdate', {
        customerRemoved: staffManager.selectedCustomerId,
        timestamp: new Date().toISOString()
    });

    showNotification(`${customer.name} marked as no-show`, 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `notification ${type}`;
    notificationDiv.textContent = message;
    
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

// Initialize seat customer functionality
function initializeSeatCustomer() {
    const seatNextBtn = document.getElementById('seatNextBtn');
    const markNoShowBtn = document.getElementById('markNoShowBtn');

    if (seatNextBtn) {
        seatNextBtn.addEventListener('click', handleSeatCustomer);
    }

    if (markNoShowBtn) {
        markNoShowBtn.addEventListener('click', handleMarkNoShow);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeSeatCustomer);

