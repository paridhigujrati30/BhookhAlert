// Mock Socket Service for simulating real-time updates
class MockSocketService {
    constructor() {
        this.listeners = {};
        this.updateInterval = null;
    }

    // Simulate connecting to a socket
    connect() {
        console.log('Mock socket connected');
        // Simulate periodic updates
        this.updateInterval = setInterval(() => {
            this.emit('queueUpdate', {
                timestamp: new Date().toISOString(),
                queueLength: this.getMockQueueLength()
            });
        }, 3000); // Update every 3 seconds
    }

    // Simulate disconnecting
    disconnect() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        console.log('Mock socket disconnected');
    }

    // Register event listeners
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    // Emit events to registered listeners
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                callback(data);
            });
        }
    }

    // Get mock queue length for simulation
    getMockQueueLength() {
        return Math.floor(Math.random() * 20) + 5;
    }

    // Simulate server broadcast
    broadcast(event, data) {
        this.emit(event, data);
    }
}

// Global mock socket instance
const mockSocket = new MockSocketService();


