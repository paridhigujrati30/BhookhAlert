// ------------------------
// Customer classes
// ------------------------
class Customer {
    constructor(name, partySize, phoneNumber, isVIP = false) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.partySize = partySize;
        this.phoneNumber = phoneNumber;
        this.isVIP = isVIP;
        this.joinTime = new Date();
        this.position = null;
        this.estimatedWaitTime = 0;
    }
}

class VIPCustomer extends Customer {
    constructor(name, partySize, phoneNumber) {
        super(name, partySize, phoneNumber, true);
        this.priority = 1; // VIP priority
    }
}

// ------------------------
// QueueManager class
// ------------------------
class QueueManager {
    constructor() {
        this.regularQueue = [];
        this.vipQueue = [];
    }

    addCustomer(customer) {
        if (customer.isVIP) {
            this.vipQueue.push(customer);
        } else {
            this.regularQueue.push(customer);
        }
        this.updatePositions();
        this.calculateWaitTimes();
        return customer;
    }

    updatePositions() {
        let pos = 1;
        this.vipQueue.forEach(c => c.position = pos++);
        this.regularQueue.forEach(c => c.position = pos++);
    }

    calculateWaitTimes() {
        const vipWait = 3; // minutes per VIP
        const regularWait = 5; // minutes per regular
        this.vipQueue.forEach((c, i) => c.estimatedWaitTime = (i + 1) * vipWait);
        this.regularQueue.forEach((c, i) => c.estimatedWaitTime = this.vipQueue.length * vipWait + (i + 1) * regularWait);
    }

    save() {
        sessionStorage.setItem('queueData', JSON.stringify(this));
    }

    static load() {
        const data = sessionStorage.getItem('queueData');
        if (!data) return new QueueManager();

        const obj = JSON.parse(data);
        const manager = new QueueManager();

        // Reconstruct regular customers
        manager.regularQueue = obj.regularQueue.map(c => {
            const cust = new Customer(c.name, c.partySize, c.phoneNumber, c.isVIP);
            cust.id = c.id;
            cust.joinTime = new Date(c.joinTime);
            cust.position = c.position;
            cust.estimatedWaitTime = c.estimatedWaitTime;
            return cust;
        });

        // Reconstruct VIP customers
        manager.vipQueue = obj.vipQueue.map(c => {
            const vip = new VIPCustomer(c.name, c.partySize, c.phoneNumber);
            vip.id = c.id;
            vip.joinTime = new Date(c.joinTime);
            vip.position = c.position;
            vip.estimatedWaitTime = c.estimatedWaitTime;
            return vip;
        });

        return manager;
    }
}

// ------------------------
// Global queue manager
// ------------------------
let queueManager = QueueManager.load();

// ------------------------
// Booking modal
// ------------------------
function showBookingConfirmation(customer) {
    // Remove existing modal if present
    const existing = document.querySelector('.booking-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = 1000;

    modal.innerHTML = `
        <div class="modal-content" style="background:#fff; padding:20px; border-radius:10px; max-width:400px; width:90%; text-align:center;">
            <h2>Booking Confirmed!</h2>
            <p><strong>Name:</strong> ${customer.name}</p>
            <p><strong>Party Size:</strong> ${customer.partySize}</p>
            <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
            <p><strong>Queue Position:</strong> ${customer.position}</p>
            <p><strong>Estimated Wait:</strong> ${customer.estimatedWaitTime} minutes</p>
            ${customer.isVIP ? '<p style="color:red"><strong>VIP Priority</strong> - Faster seating!</p>' : ''}
            <button id="closeModalBtn" style="margin-top:15px; padding:10px 20px;">View Queue Status</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Redirect to status page on button click
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        modal.remove();
        window.location.href = 'status.html';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });
}

// ------------------------
// Form submission
// ------------------------
function handleJoinQueue(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const partySize = parseInt(document.getElementById('partySize').value);
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const isVIP = document.getElementById('isVIP').checked;

    if (!name || !partySize || !phoneNumber) {
        alert('Please fill all fields.');
        return;
    }

    const customer = isVIP 
        ? new VIPCustomer(name, partySize, phoneNumber) 
        : new Customer(name, partySize, phoneNumber);

    queueManager.addCustomer(customer);
    queueManager.save();
    sessionStorage.setItem('currentCustomerId', customer.id);

    showBookingConfirmation(customer);
}

// ------------------------
// Initialize
// ------------------------
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('joinQueueForm');
    if (form) form.addEventListener('submit', handleJoinQueue);
});
