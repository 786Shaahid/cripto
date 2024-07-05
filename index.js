const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
let currentPage = 1;
let coins = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchCoins();
    document.getElementById('search').addEventListener('input', debounce(searchCoins, 300));
});

async function fetchCoins(page = 1) {
    showLoading();
    const response = await fetch(`${apiUrl}?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}`);
    coins = await response.json();
    displayCoins(coins);
    setupPagination();
}

function displayCoins(coins) {
    const coinsList = document.getElementById('coins-list');
    coinsList.innerHTML = coins.map(coin => `
        <div class="coin-card">
            <img src="${coin.image}" alt="${coin.name}" />
            <h2>${coin.name}</h2>
            <p>Price: $${coin.current_price}</p>
            <p>Volume: $${coin.total_volume}</p>
            <button onclick="addToFavorites('${coin.id}')">Add to Favorites</button>
            <a href="coins.html?id=${coin.id}">Details</a>
        </div>
    `).join('');
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <button onclick="changePage(${currentPage + 1})">Next</button>
    `;
}

function changePage(page) {
    currentPage = page;
    fetchCoins(page);
}

function searchCoins() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(query));
    displayCoins(filteredCoins);
}

function sortCoins(attribute) {
    coins.sort((a, b) => a[attribute] - b[attribute]);
    displayCoins(coins);
}

function showLoading() {
    document.getElementById('coins-list').innerHTML = `
        <div class="loading-shimmer"></div>
        <div class="loading-shimmer"></div>
        <div class="loading-shimmer"></div>
    `;
}

function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

function addToFavorites(coinId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(coinId)) {
        favorites.push(coinId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}
