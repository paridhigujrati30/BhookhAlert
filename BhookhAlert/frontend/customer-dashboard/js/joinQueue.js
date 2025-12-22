// Customer class
class Customer {
    constructor(name, partySize, isVIP = false) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.partySize = partySize;
        this.isVIP = isVIP;
        this.joinTime = new Date();
        this.position = null;
        this.estimatedWaitTime = 0;
    }

    getWaitTime() {
        return this.estimatedWaitTime;
    }
}

// VIP Customer class (extends Customer)
class VIPCustomer extends Customer {
    constructor(name, partySize) {
        super(name, partySize, true);
        this.priority = 1; // Higher priority
    }
}

// Queue Manager class
class QueueManager {
    constructor() {
        this.regularQueue = []; // FIFO queue
        this.vipQueue = []; // Priority queue
        this.seatedCustomers = [];
        this.nextPosition = 1;
    }

    // Add customer to appropriate queue
    addCustomer(customer) {
        if (customer.isVIP) {
            this.vipQueue.push(customer);
            this.vipQueue.sort((a, b) => a.priority - b.priority);
        } else {
            this.regularQueue.push(customer);
        }
        
        this.updatePositions();
        this.calculateWaitTimes();
        return customer;
    }

    // Update positions for all customers
    updatePositions() {
        let position = 1;
        
        // VIP customers get positions first
        this.vipQueue.forEach(customer => {
            customer.position = position++;
        });
        
        // Then regular customers
        this.regularQueue.forEach(customer => {
            customer.position = position++;
        });
    }

    // Calculate estimated wait times
    calculateWaitTimes() {
        const avgWaitPerCustomer = 5; // 5 minutes per customer
        
        this.vipQueue.forEach((customer, index) => {
            customer.estimatedWaitTime = (index + 1) * 3; // VIPs wait less
        });
        
        this.regularQueue.forEach((customer, index) => {
            const vipCount = this.vipQueue.length;
            customer.estimatedWaitTime = (vipCount * 3) + ((index + 1) * avgWaitPerCustomer);
        });
    }

    // Get next customer to seat (VIPs first, then FIFO)
    getNextCustomer() {
        if (this.vipQueue.length > 0) {
            return this.vipQueue.shift();
        }
        if (this.regularQueue.length > 0) {
            return this.regularQueue.shift();
        }
        return null;
    }

    // Remove customer (no-show)
    removeCustomer(customerId) {
        this.regularQueue = this.regularQueue.filter(c => c.id !== customerId);
        this.vipQueue = this.vipQueue.filter(c => c.id !== customerId);
        this.updatePositions();
        this.calculateWaitTimes();
    }

    // Get customer by ID
    getCustomerById(customerId) {
        const allCustomers = [...this.regularQueue, ...this.vipQueue];
        return allCustomers.find(c => c.id === customerId);
    }

    // Get all customers in queue
    getAllCustomers() {
        return [...this.vipQueue, ...this.regularQueue];
    }

    // Get queue length
    getQueueLength() {
        return this.regularQueue.length + this.vipQueue.length;
    }
}

// Global queue manager instance
let queueManager = new QueueManager();

// Initialize queue manager from sessionStorage if exists
function initializeQueueManager() {
    const savedQueue = sessionStorage.getItem('queueData');
    if (savedQueue) {
        try {
            const data = JSON.parse(savedQueue);
            queueManager = Object.assign(new QueueManager(), data);
            // Reconstruct customer objects
            queueManager.regularQueue = queueManager.regularQueue.map(c => {
                const customer = Object.assign(new Customer(), c);
                customer.joinTime = new Date(c.joinTime);
                return customer;
            });
            queueManager.vipQueue = queueManager.vipQueue.map(c => {
                const customer = Object.assign(new VIPCustomer(), c);
                customer.joinTime = new Date(c.joinTime);
                return customer;
            });
        } catch (e) {
            console.error('Error loading queue data:', e);
            queueManager = new QueueManager();
        }
    }
}

// Save queue manager to sessionStorage
function saveQueueManager() {
    sessionStorage.setItem('queueData', JSON.stringify(queueManager));
}

// Join queue form handler
function handleJoinQueue(event) {
    event.preventDefault();
    
    const name = document.getElementById('customerName').value.trim();
    const partySize = parseInt(document.getElementById('partySize').value);
    const isVIP = document.getElementById('isVIP').checked;
    
    if (!name || partySize < 1) {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    const customer = isVIP ? 
        new VIPCustomer(name, partySize) : 
        new Customer(name, partySize);
    
    queueManager.addCustomer(customer);
    saveQueueManager();
    
    // Store current customer ID
    sessionStorage.setItem('currentCustomerId', customer.id);
    
    // Redirect to status page
    window.location.href = 'status.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeQueueManager();
    
    const joinForm = document.getElementById('joinQueueForm');
    if (joinForm) {
        joinForm.addEventListener('submit', handleJoinQueue);
    }
});

