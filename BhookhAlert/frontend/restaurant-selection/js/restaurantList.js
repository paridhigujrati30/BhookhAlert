// Simulated restaurant data with image placeholders
const restaurants = [
    {
        id: 1,
        name: "Spice Garden",
        cuisine: "Indian",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        waitTime: 15,
        queueLength: 8,
        rating: 4.5
    },
    {
        id: 2,
        name: "Pasta Paradise",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        waitTime: 25,
        queueLength: 12,
        rating: 4.7
    },
    {
        id: 3,
        name: "Sushi Zen",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        waitTime: 30,
        queueLength: 15,
        rating: 4.8
    },
    {
        id: 4,
        name: "Burger House",
        cuisine: "American",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
        waitTime: 10,
        queueLength: 5,
        rating: 4.3
    },
    {
        id: 5,
        name: "Taco Fiesta",
        cuisine: "Mexican",
        image: "https://images.unsplash.com/photo-1565299585323-38174c2d6a0e?w=400&h=300&fit=crop",
        waitTime: 20,
        queueLength: 10,
        rating: 4.6
    },
    {
        id: 6,
        name: "Dragon Wok",
        cuisine: "Chinese",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop",
        waitTime: 18,
        queueLength: 7,
        rating: 4.4
    }
];

// Store selected restaurant ID in sessionStorage
function selectRestaurant(restaurantId) {
    sessionStorage.setItem('selectedRestaurantId', restaurantId);
    window.location.href = '../customer-dashboard/customer.html';
}

// Get queue status class based on queue length
function getQueueStatusClass(queueLength) {
    if (queueLength < 5) return 'low';
    if (queueLength < 10) return 'medium';
    return 'high';
}

// Generate star rating display
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    return stars;
}

// Render restaurant cards
function renderRestaurants() {
    const grid = document.getElementById('restaurantGrid');
    
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.onclick = () => selectRestaurant(restaurant.id);
        
        const statusClass = getQueueStatusClass(restaurant.queueLength);
        const statusText = restaurant.queueLength < 5 ? 'Low Wait' : 
                          restaurant.queueLength < 10 ? 'Moderate Wait' : 'High Wait';
        
        card.innerHTML = `
            <div class="restaurant-image" style="background-image: url('${restaurant.image}')"></div>
            <div class="restaurant-content">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-cuisine">${restaurant.cuisine} Cuisine</div>
                <div class="restaurant-rating">
                    <span class="rating-stars">${getStarRating(restaurant.rating)}</span>
                    <span class="rating-value">${restaurant.rating}</span>
                </div>
                <div class="restaurant-info">
                    <div class="info-item">
                        <div class="info-label">Wait Time</div>
                        <div class="info-value">${restaurant.waitTime} min</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">In Queue</div>
                        <div class="info-value">${restaurant.queueLength}</div>
                    </div>
                </div>
                <div class="queue-status ${statusClass}">${statusText}</div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderRestaurants);
