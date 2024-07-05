const apiUrl = 'https://api.coingecko.com/api/v3/coins';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchFavoriteCoins();
});

async function fetchFavoriteCoins() {
    showLoading();
    const favoriteCoins = await Promise.all(favorites.map(async (id) => {
        const response = await fetch(`${apiUrl}/${id}`);
        return await response.json();
    }));
    displayFavorites(favoriteCoins);
}

function displayFavorites(coins) {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = coins.map(coin => `
        <div class="coin-card">
            <img src="${coin.image.small}" alt="${coin.name}" />
            <h2>${coin.name}</h2>
            <p>Price: $${coin.market_data.current_price.usd}</p>
            <a href="coins.html?id=${coin.id}">Details</a>
        </div>
    `).join('');
}

function showLoading() {
    document.getElementById('favorites-list').innerHTML = `
        <div class="loading-shimmer"></div>
        <div class="loading-shimmer"></div>
        <div class="loading-shimmer"></div>
    `;
}
