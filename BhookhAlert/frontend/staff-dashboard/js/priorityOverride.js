// Handle priority override
function handlePriorityOverride(event) {
    event.preventDefault();
    
    const customerSelect = document.getElementById('customerSelect');
    const customerId = parseFloat(customerSelect.value);
    
    if (!customerId) {
        showNotification('Please select a customer', 'error');
        return;
    }

    const customer = queueManager.getCustomerById(customerId);
    
    if (!customer) {
        showNotification('Customer not found', 'error');
        return;
    }

    if (customer.isVIP) {
        showNotification('Customer is already a VIP', 'info');
        return;
    }

    // Convert to VIP
    const vipCustomer = new VIPCustomer(customer.name, customer.partySize);
    vipCustomer.id = customer.id;
    vipCustomer.joinTime = customer.joinTime;

    // Remove from regular queue and add to VIP queue
    queueManager.regularQueue = queueManager.regularQueue.filter(c => c.id !== customerId);
    queueManager.vipQueue.push(vipCustomer);
    queueManager.vipQueue.sort((a, b) => a.priority - b.priority);

    // Update positions and wait times
    queueManager.updatePositions();
    queueManager.calculateWaitTimes();
    saveQueueManager();

    // Update displays
    staffManager.updateQueueDisplay();
    staffManager.updateStats();
    updateCustomerSelect();

    // Broadcast update (simulated)
    mockSocket.broadcast('queueUpdate', {
        priorityOverride: customerId,
        timestamp: new Date().toISOString()
    });

    showNotification(`${customer.name} upgraded to VIP priority!`, 'success');
}

// Update customer select dropdown
function updateCustomerSelect() {
    const customerSelect = document.getElementById('customerSelect');
    if (!customerSelect) return;

    const currentValue = customerSelect.value;
    customerSelect.innerHTML = '<option value="">Select a customer</option>';

    const allCustomers = queueManager.getAllCustomers();
    const regularCustomers = allCustomers.filter(c => !c.isVIP);

    regularCustomers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (Party of ${customer.partySize})`;
        customerSelect.appendChild(option);
    });

    if (currentValue) {
        customerSelect.value = currentValue;
    }
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

// Initialize priority override
function initializePriorityOverride() {
    const priorityForm = document.getElementById('priorityOverrideForm');
    
    if (priorityForm) {
        priorityForm.addEventListener('submit', handlePriorityOverride);
    }

    // Update customer select when queue changes
    setInterval(() => {
        updateCustomerSelect();
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeQueueManager();
    updateCustomerSelect();
    initializePriorityOverride();
});

