const apiUrl = 'https://api.coingecko.com/api/v3/coins';
const urlParams = new URLSearchParams(window.location.search);
const coinId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    fetchCoinDetails();
    fetchChart('1');
});

async function fetchCoinDetails() {
    showLoading();
    const response = await fetch(`${apiUrl}/${coinId}`);
    const coin = await response.json();
    displayCoinDetails(coin);
}

function displayCoinDetails(coin) {
    const coinDetails = document.getElementById('coin-details');
    coinDetails.innerHTML = `
        <h2>${coin.name}</h2>
        <img src="${coin.image.large}" alt="${coin.name}" />
        <p>${coin.description.en}</p>
        <p>Rank: ${coin.market_cap_rank}</p>
        <p>Current Price: $${coin.market_data.current_price.usd}</p>
        <p>Market Cap: $${coin.market_data.market_cap.usd}</p>
    `;
}

async function fetchChart(days) {
    const response = await fetch(`${apiUrl}/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    const data = await response.json();
    renderChart(data.prices);
}

function renderChart(prices) {
    const ctx = document.getElementById('price-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: prices.map(price => new Date(price[0]).toLocaleDateString()),
            datasets: [{
                label: 'Price',
                data: prices.map(price => price[1]),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
}

function showLoading() {
    document.getElementById('coin-details').innerHTML = `
        <div class="loading-shimmer"></div>
    `;
}
