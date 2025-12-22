// Update reservation monitor display
function updateReservationMonitor() {
    const reservationList = document.getElementById('reservationList');
    if (!reservationList) return;

    reservationList.innerHTML = '';

    const allReservations = reservationManager.getAllReservations();
    const today = new Date().toISOString().split('T')[0];

    // Filter reservations for today
    const todayReservations = allReservations.filter(r => r.date === today);

    if (todayReservations.length === 0) {
        reservationList.innerHTML = '<div class="empty-reservations">No reservations for today</div>';
        return;
    }

    // Sort by time
    todayReservations.sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
    });

    todayReservations.forEach(reservation => {
        const reservationItem = document.createElement('div');
        reservationItem.className = 'reservation-item';
        
        reservationItem.innerHTML = `
            <div class="reservation-info">
                <div class="reservation-name">${reservation.name}</div>
                <div class="reservation-details">
                    Party of ${reservation.partySize} • ${reservation.time} • ${reservation.phone}
                </div>
            </div>
            <div class="reservation-status ${reservation.status}">
                ${reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('-', ' ')}
            </div>
        `;

        reservationList.appendChild(reservationItem);
    });
}

// Initialize reservation monitor
function initializeReservationMonitor() {
    // Wait for reservation manager to be available
    if (typeof reservationManager === 'undefined') {
        setTimeout(initializeReservationMonitor, 100);
        return;
    }
    
    updateReservationMonitor();

    // Update periodically
    setInterval(() => {
        updateReservationMonitor();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeReservationMonitor);

