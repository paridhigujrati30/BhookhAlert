// Reservation class
class Reservation {
    constructor(name, partySize, date, time, phone) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.partySize = partySize;
        this.date = date;
        this.time = time;
        this.phone = phone;
        this.status = 'pending'; // pending, checked-in, seated, cancelled
        this.createdAt = new Date();
    }
}

// Reservation Manager class
class ReservationManager {
    constructor() {
        this.reservations = [];
        this.loadReservations();
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
        this.saveReservations();
        return reservation;
    }

    getReservationByPhone(phone) {
        return this.reservations.find(r => r.phone === phone && r.status === 'pending');
    }

    checkInReservation(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (reservation) {
            reservation.status = 'checked-in';
            this.saveReservations();
            return reservation;
        }
        return null;
    }

    saveReservations() {
        sessionStorage.setItem('reservations', JSON.stringify(this.reservations));
    }

    loadReservations() {
        const saved = sessionStorage.getItem('reservations');
        if (saved) {
            this.reservations = JSON.parse(saved);
        }
    }

    getAllReservations() {
        return this.reservations;
    }
}

// Global reservation manager
const reservationManager = new ReservationManager();

// Initialize with sample reservations if none exist
function initializeSampleReservations() {
    const allReservations = reservationManager.getAllReservations();
    if (allReservations.length === 0) {
        const today = new Date().toISOString().split('T')[0];
        const sampleReservations = [
            new Reservation('John Smith', 4, today, '19:00', '555-0101'),
            new Reservation('Sarah Johnson', 2, today, '19:30', '555-0102'),
            new Reservation('Mike Davis', 6, today, '20:00', '555-0103')
        ];
        sampleReservations.forEach(res => reservationManager.addReservation(res));
    }
}

// Handle reservation check-in form
function handleReservationCheckin(event) {
    event.preventDefault();
    
    const phone = document.getElementById('reservationPhone').value.trim();
    
    if (!phone) {
        alert('Please enter your phone number.');
        return;
    }
    
    const reservation = reservationManager.getReservationByPhone(phone);
    
    if (!reservation) {
        document.getElementById('checkinResult').innerHTML = `
            <div class="result-message error">
                No reservation found for this phone number.
            </div>
        `;
        return;
    }
    
    // Check if reservation is for today
    const today = new Date().toISOString().split('T')[0];
    if (reservation.date !== today) {
        document.getElementById('checkinResult').innerHTML = `
            <div class="result-message warning">
                Your reservation is for ${reservation.date}, not today.
            </div>
        `;
        return;
    }
    
    // Check in the reservation
    const checkedIn = reservationManager.checkInReservation(reservation.id);
    
    if (checkedIn) {
        // Add to queue with VIP priority
        const customer = new VIPCustomer(reservation.name, reservation.partySize);
        queueManager.addCustomer(customer);
        saveQueueManager();
        sessionStorage.setItem('currentCustomerId', customer.id);
        
        document.getElementById('checkinResult').innerHTML = `
            <div class="result-message success">
                <h3>✓ Check-in Successful!</h3>
                <p>Reservation for ${reservation.name}, party of ${reservation.partySize}</p>
                <p>You have been added to the queue with VIP priority.</p>
                <button onclick="window.location.href='status.html'" class="btn-primary">View Queue Status</button>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeQueueManager();
    initializeSampleReservations();
    
    const checkinForm = document.getElementById('reservationCheckinForm');
    if (checkinForm) {
        checkinForm.addEventListener('submit', handleReservationCheckin);
    }
});

