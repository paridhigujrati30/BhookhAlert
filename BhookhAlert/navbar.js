// Shared Navbar Component
function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <div class="nav-container">
            <div class="nav-brand">
                <a href="../index.html">BhookhAlert</a>
            </div>
            <div class="nav-links">
                <a href="../restaurant-selection/selectRestaurant.html" class="nav-link">Restaurants</a>
                <a href="../customer-dashboard/status.html" class="nav-link">Queue</a>
                <a href="#" class="nav-link" onclick="showProfile(); return false;">Profile</a>
            </div>
        </div>
    `;
    return navbar;
}

function showProfile() {
    alert('Profile feature coming soon!');
}

// Insert navbar at the beginning of body
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = createNavbar();
    body.insertBefore(navbar, body.firstChild);
});

