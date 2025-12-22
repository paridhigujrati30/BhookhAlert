// Analytics Manager class
class AnalyticsManager {
    constructor() {
        this.hourlyData = this.initializeHourlyData();
        this.loadAnalyticsData();
    }

    // Initialize hourly data structure
    initializeHourlyData() {
        const data = {};
        for (let hour = 0; hour < 24; hour++) {
            data[hour] = {
                customersServed: 0,
                queueLength: 0,
                waitTime: 0,
                count: 0
            };
        }
        return data;
    }

    // Load analytics data from sessionStorage
    loadAnalyticsData() {
        const saved = sessionStorage.getItem('analyticsData');
        if (saved) {
            this.hourlyData = JSON.parse(saved);
        } else {
            // Generate some sample data for demonstration
            this.generateSampleData();
        }
    }

    // Save analytics data
    saveAnalyticsData() {
        sessionStorage.setItem('analyticsData', JSON.stringify(this.hourlyData));
    }

    // Generate sample data for demonstration
    generateSampleData() {
        const currentHour = new Date().getHours();
        
        // Simulate peak hours (12-14, 18-20)
        for (let hour = 0; hour < 24; hour++) {
            let customersServed = 0;
            let queueLength = 0;
            let waitTime = 0;

            if (hour >= 12 && hour <= 14) {
                // Lunch peak
                customersServed = Math.floor(Math.random() * 15) + 20;
                queueLength = Math.floor(Math.random() * 10) + 15;
                waitTime = Math.floor(Math.random() * 10) + 20;
            } else if (hour >= 18 && hour <= 20) {
                // Dinner peak
                customersServed = Math.floor(Math.random() * 20) + 25;
                queueLength = Math.floor(Math.random() * 15) + 20;
                waitTime = Math.floor(Math.random() * 15) + 25;
            } else if (hour >= 11 && hour <= 21) {
                // Regular hours
                customersServed = Math.floor(Math.random() * 10) + 5;
                queueLength = Math.floor(Math.random() * 8) + 3;
                waitTime = Math.floor(Math.random() * 8) + 10;
            } else {
                // Off hours
                customersServed = Math.floor(Math.random() * 3);
                queueLength = Math.floor(Math.random() * 3);
                waitTime = Math.floor(Math.random() * 5) + 5;
            }

            this.hourlyData[hour] = {
                customersServed: customersServed,
                queueLength: queueLength,
                waitTime: waitTime,
                count: 1
            };
        }

        this.saveAnalyticsData();
    }

    // Get peak hours
    getPeakHours() {
        const hours = [];
        for (let hour = 0; hour < 24; hour++) {
            hours.push({
                hour: hour,
                queueLength: this.hourlyData[hour].queueLength,
                customersServed: this.hourlyData[hour].customersServed
            });
        }
        return hours.sort((a, b) => b.queueLength - a.queueLength).slice(0, 5);
    }

    // Get average wait time
    getAverageWaitTime() {
        let totalWaitTime = 0;
        let totalCount = 0;
        
        for (let hour = 0; hour < 24; hour++) {
            totalWaitTime += this.hourlyData[hour].waitTime;
            totalCount += this.hourlyData[hour].count;
        }
        
        return totalCount > 0 ? Math.round(totalWaitTime / totalCount) : 0;
    }

    // Get customers served per hour
    getCustomersServedPerHour() {
        let totalServed = 0;
        let activeHours = 0;
        
        for (let hour = 0; hour < 24; hour++) {
            if (this.hourlyData[hour].customersServed > 0) {
                totalServed += this.hourlyData[hour].customersServed;
                activeHours++;
            }
        }
        
        return activeHours > 0 ? Math.round(totalServed / activeHours) : 0;
    }

    // Get hourly breakdown
    getHourlyBreakdown() {
        const breakdown = [];
        for (let hour = 0; hour < 24; hour++) {
            if (this.hourlyData[hour].customersServed > 0) {
                breakdown.push({
                    hour: hour,
                    customers: this.hourlyData[hour].customersServed
                });
            }
        }
        return breakdown;
    }

    // Get queue trend data
    getQueueTrend() {
        const trend = [];
        for (let hour = 0; hour < 24; hour++) {
            trend.push({
                hour: hour,
                queueLength: this.hourlyData[hour].queueLength
            });
        }
        return trend;
    }

    // Get customer type distribution
    getCustomerTypeDistribution() {
        const allCustomers = queueManager.getAllCustomers();
        const vipCount = queueManager.vipQueue.length;
        const regularCount = queueManager.regularQueue.length;
        
        return {
            vip: vipCount,
            regular: regularCount,
            total: allCustomers.length
        };
    }

    // Get no-show rate
    getNoShowRate() {
        // Simulate no-show data
        const totalCustomers = 100; // Example total
        const noShows = 8; // Example no-shows
        return Math.round((noShows / totalCustomers) * 100);
    }

    // Update analytics when customer is seated
    recordCustomerSeated() {
        const currentHour = new Date().getHours();
        this.hourlyData[currentHour].customersServed++;
        this.saveAnalyticsData();
    }
}

// Global analytics manager instance
const analyticsManager = new AnalyticsManager();

// Render peak hours chart
function renderPeakHoursChart() {
    const chartContainer = document.getElementById('peakHoursChart');
    if (!chartContainer) return;

    const peakHours = analyticsManager.getPeakHours();
    
    chartContainer.innerHTML = '<div class="chart-bar"></div>';
    const chartBar = chartContainer.querySelector('.chart-bar');

    peakHours.forEach(item => {
        const barItem = document.createElement('div');
        barItem.className = 'bar-item';
        
        const maxQueue = Math.max(...peakHours.map(h => h.queueLength));
        const barHeight = maxQueue > 0 ? (item.queueLength / maxQueue) * 100 : 0;
        
        barItem.innerHTML = `
            <div class="bar" style="height: ${barHeight}%"></div>
            <div class="bar-label">${item.hour}:00</div>
            <div class="bar-value">${item.queueLength}</div>
        `;
        
        chartBar.appendChild(barItem);
    });
}

// Render queue trend chart
function renderQueueTrendChart() {
    const chartContainer = document.getElementById('queueTrendChart');
    if (!chartContainer) return;

    const trend = analyticsManager.getQueueTrend();
    
    chartContainer.innerHTML = '<div class="chart-bar"></div>';
    const chartBar = chartContainer.querySelector('.chart-bar');

    const maxQueue = Math.max(...trend.map(t => t.queueLength));
    
    trend.forEach(item => {
        const barItem = document.createElement('div');
        barItem.className = 'bar-item';
        
        const barHeight = maxQueue > 0 ? (item.queueLength / maxQueue) * 100 : 0;
        
        barItem.innerHTML = `
            <div class="bar" style="height: ${barHeight}%"></div>
            <div class="bar-label">${item.hour}</div>
        `;
        
        chartBar.appendChild(barItem);
    });
}

// Render customer type chart
function renderCustomerTypeChart() {
    const chartContainer = document.getElementById('customerTypeChart');
    if (!chartContainer) return;

    const distribution = analyticsManager.getCustomerTypeDistribution();
    const total = distribution.total || 1;
    
    const vipPercent = Math.round((distribution.vip / total) * 100);
    const regularPercent = Math.round((distribution.regular / total) * 100);
    
    chartContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 30px; height: 30px; background: #ffc107; border-radius: 4px;"></div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #3d2817;">VIP Customers</div>
                    <div style="color: #8b4513; font-size: 0.9rem;">${distribution.vip} (${vipPercent}%)</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 30px; height: 30px; background: #c85a1a; border-radius: 4px;"></div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #3d2817;">Regular Customers</div>
                    <div style="color: #8b4513; font-size: 0.9rem;">${distribution.regular} (${regularPercent}%)</div>
                </div>
            </div>
        </div>
    `;
}

// Render hourly breakdown
function renderHourlyBreakdown() {
    const breakdownContainer = document.getElementById('hourlyBreakdown');
    if (!breakdownContainer) return;

    const breakdown = analyticsManager.getHourlyBreakdown();
    breakdownContainer.innerHTML = '';

    breakdown.forEach(item => {
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        
        const hourLabel = item.hour < 12 ? `${item.hour}:00 AM` : 
                         item.hour === 12 ? '12:00 PM' : 
                         `${item.hour - 12}:00 PM`;
        
        hourlyItem.innerHTML = `
            <span class="hourly-time">${hourLabel}</span>
            <span class="hourly-count">${item.customers} customers</span>
        `;
        
        breakdownContainer.appendChild(hourlyItem);
    });
}

// Update all analytics displays
function updateAnalytics() {
    initializeQueueManager();
    
    // Update metrics
    const avgWaitTime = analyticsManager.getAverageWaitTime();
    const customersServed = analyticsManager.getCustomersServedPerHour();
    const noShowRate = analyticsManager.getNoShowRate();

    const avgWaitTimeMetric = document.getElementById('avgWaitTimeMetric');
    const customersServedMetric = document.getElementById('customersServedMetric');
    const noShowRateMetric = document.getElementById('noShowRateMetric');

    if (avgWaitTimeMetric) avgWaitTimeMetric.textContent = `${avgWaitTime} min`;
    if (customersServedMetric) customersServedMetric.textContent = customersServed;
    if (noShowRateMetric) noShowRateMetric.textContent = `${noShowRate}%`;

    // Render charts
    renderPeakHoursChart();
    renderQueueTrendChart();
    renderCustomerTypeChart();
    renderHourlyBreakdown();
}

// Initialize analytics
function initializeAnalytics() {
    updateAnalytics();

    const refreshBtn = document.getElementById('refreshAnalytics');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateAnalytics();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeAnalytics);

