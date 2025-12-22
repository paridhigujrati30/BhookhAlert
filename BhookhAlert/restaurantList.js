// Simulated restaurant data with image placeholders
const restaurants = [
    {
        id: 1,
        name: "Spice Garden",
        cuisine: "Indian",
        image: "https://i.pinimg.com/736x/4a/76/c6/4a76c60f36ec142c3aea5e84fc18548e.jpg",
        waitTime: 15,
        queueLength: 8,
        rating: 4.5
    },
    {
        id: 2,
        name: "Pasta Paradise",
        cuisine: "Italian",
        image: "https://i.pinimg.com/736x/b2/41/53/b2415341dba02e5c690233d80bfc7136.jpg",
        waitTime: 25,
        queueLength: 12,
        rating: 4.7
    },
    {
        id: 3,
        name: "Sushi Zen",
        cuisine: "Japanese",
        image: "https://i.pinimg.com/736x/f5/69/27/f56927f0889d6f6c28eb943f563b46a6.jpg",
        waitTime: 30,
        queueLength: 15,
        rating: 4.8
    },
    {
        id: 4,
        name: "Burger House",
        cuisine: "American",
        image: "https://i.pinimg.com/736x/a1/bc/ed/a1bced55fdcb0690e119c0c9e5e7e7d2.jpg",
        waitTime: 10,
        queueLength: 5,
        rating: 4.3
    },
    {
        id: 5,
        name: "Taco Fiesta",
        cuisine: "Mexican",
        image: "https://i.pinimg.com/1200x/49/c8/fb/49c8fb814cd082b12b5a50a939babd7a.jpg",
        waitTime: 20,
        queueLength: 10,
        rating: 4.6
    },
    {
        id: 6,
        name: "Dragon Wok",
        cuisine: "Chinese",
        image: "https://i.pinimg.com/1200x/f2/f1/67/f2f167c4f0733dbbb143d202712d5e3b.jpg",
        waitTime: 18,
        queueLength: 7,
        rating: 4.4
    },
    {
        id: 7,
        name: "Indian House",
        cuisine: "Indian",
        image: "https://i.pinimg.com/736x/b4/2e/7c/b42e7c5f4382cf468d6181100224fa85.jpg",
        waitTime: 23,
        queueLength: 19,
        rating: 4.8
    },
    {
        id: 8,
        name: "FroyoLand",
        cuisine: "Desserts",
        image: "https://i.pinimg.com/736x/fa/87/5b/fa875b9221d0f6fde7b87c25a6607f63.jpg",
        waitTime: 3,
        queueLength: 4,
        rating: 4.3
    },
   {
    id: 9,
    name: "BurgerBodega",
    cuisine: "Bugers",
    image: "https://i.pinimg.com/1200x/cd/50/a3/cd50a3d76c4a2a4fa51f4b638068099c.jpg",
    waitTime: 18,
    queueLength: 10,
    rating: 4.3
   },
   {
    id: 10,
    name: "WingsWar",
    cuisine: "Chicken Wings",
    image: "https://i.pinimg.com/736x/ce/de/a9/cedea9d5655f2175f9a5fc6aab3083cd.jpg",
    waitTime: 13,
    queueLength: 8,
    rating: 4.7
   }
];

// Store selected restaurant ID in sessionStorage
function selectRestaurant(restaurantId) {
    sessionStorage.setItem('selectedRestaurantId', restaurantId);
    window.location.href = 'customer.html';
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
